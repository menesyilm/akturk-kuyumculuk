import { readFileSync } from "node:fs";

const RULES_FILE = new URL("../firestore.rules", import.meta.url);
const rawRules = readFileSync(RULES_FILE, "utf8");

function stripComments(source) {
  let output = "";
  let quote = null;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (quote) {
      output += character;
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === "'" || character === '"') {
      quote = character;
      output += character;
      continue;
    }

    if (character === "/" && nextCharacter === "/") {
      while (index < source.length && source[index] !== "\n") index += 1;
      output += "\n";
      continue;
    }

    if (character === "/" && nextCharacter === "*") {
      index += 2;
      while (index < source.length - 1 && !(source[index] === "*" && source[index + 1] === "/")) {
        if (source[index] === "\n") output += "\n";
        index += 1;
      }
      index += 1;
      continue;
    }

    output += character;
  }

  return output;
}

const rules = stripComments(rawRules);

function fail(message) {
  console.error(`Firestore kural kontrolü başarısız: ${message}`);
  process.exit(1);
}

function requirePattern(pattern, message, source = rules) {
  if (!pattern.test(source)) {
    fail(message);
  }
}

function extractBlock(marker, label) {
  const match = marker.exec(rules);
  if (!match) {
    fail(`${label} bloğu bulunamadı.`);
  }

  const openingBrace = match.index + match[0].lastIndexOf("{");
  let depth = 0;

  for (let index = openingBrace; index < rules.length; index += 1) {
    if (rules[index] === "{") depth += 1;
    if (rules[index] === "}") depth -= 1;

    if (depth === 0) {
      return rules.slice(openingBrace + 1, index);
    }
  }

  fail(`${label} bloğu kapanmıyor.`);
}

function extractMatchBlock(pathPattern) {
  return extractBlock(new RegExp(`match\\s+${pathPattern}\\s*\\{`), pathPattern);
}

function normalizedCondition(condition) {
  return condition.replace(/\s+/g, "");
}

function parseAllows(source, label) {
  const statements = [];
  const pattern = /allow\s+([^:;]+?)\s*:\s*if\s+([^;]+);/g;

  for (const match of source.matchAll(pattern)) {
    statements.push({
      operations: match[1].split(",").map((operation) => operation.trim()),
      condition: normalizedCondition(match[2]),
    });
  }

  const keywordCount = (source.match(/\ballow\b/g) ?? []).length;
  if (keywordCount !== statements.length) {
    fail(`${label} içinde çözümlenemeyen bir allow ifadesi bulundu.`);
  }

  return statements;
}

function requireExactAllows(block, expected, label) {
  const actual = parseAllows(block, label)
    .map(({ operations, condition }) => `${operations.join(",")}:${condition}`)
    .sort();
  const required = expected
    .map(({ operations, condition }) => `${operations.join(",")}:${normalizedCondition(condition)}`)
    .sort();

  if (actual.length !== required.length || actual.some((value, index) => value !== required[index])) {
    fail(`${label} izinleri beklenen güvenli kapsamdan farklı.`);
  }
}

const openBraces = (rules.match(/\{/g) ?? []).length;
const closeBraces = (rules.match(/\}/g) ?? []).length;
if (openBraces !== closeBraces) {
  fail("süslü parantezler dengeli değil.");
}

requirePattern(/rules_version\s*=\s*['"]2['"]\s*;/, "rules_version 2 olmalı.");

const expectedMatchPaths = [
  "/databases/{database}/documents",
  "/yuzukvekupe/{productId}",
  "/bileklik/{productId}",
  "/kolye/{productId}",
  "/set/{productId}",
  "/sertifikalar/{certificateId}",
  "/products/{productId}",
].sort();
const actualMatchPaths = [...rules.matchAll(/\bmatch\s+([^\s]+)\s*\{/g)]
  .map((match) => match[1])
  .sort();

if (
  actualMatchPaths.length !== expectedMatchPaths.length ||
  actualMatchPaths.some((path, index) => path !== expectedMatchPaths[index])
) {
  fail("match yolları beklenen tekil ve sınırlı koleksiyon listesinden farklı.");
}

const staffBlock = extractBlock(/function\s+isStaff\s*\(\s*\)\s*\{/, "isStaff");
requirePattern(
  /^\s*return\s+request\.auth\s*!=\s*null\s*&&\s*request\.auth\.token\.email\s*==\s*['"]kuyumculukakturk@gmail\.com['"]\s*;\s*$/,
  "isStaff yalnızca doğrulanmış yönetici e-postasını kabul etmeli.",
  staffBlock,
);

const publicProductCollections = [
  ["\\/yuzukvekupe\\/\\{productId\\}", "yuzukvekupe"],
  ["\\/bileklik\\/\\{productId\\}", "bileklik"],
  ["\\/kolye\\/\\{productId\\}", "kolye"],
  ["\\/set\\/\\{productId\\}", "set"],
  ["\\/products\\/\\{productId\\}", "products"],
];

for (const [pathPattern, name] of publicProductCollections) {
  const block = extractMatchBlock(pathPattern);
  requireExactAllows(
    block,
    [
      { operations: ["read"], condition: "true" },
      { operations: ["write"], condition: "isStaff()" },
    ],
    name,
  );
}

const certificateBlock = extractMatchBlock("\\/sertifikalar\\/\\{certificateId\\}");
requireExactAllows(
  certificateBlock,
  [
    { operations: ["get"], condition: "true" },
    {
      operations: ["list"],
      condition: "request.query.limit != null && request.query.limit <= 1",
    },
    { operations: ["write"], condition: "isStaff()" },
  ],
  "sertifikalar",
);

if (/match\s+\/\{[A-Za-z_][A-Za-z0-9_]*\s*=\s*\*\*\}/.test(rules)) {
  fail("genel catch-all belge eşleşmesi bulundu.");
}

for (const { operations, condition } of parseAllows(rules, "kural dosyası")) {
  const mutatesData = operations.some((operation) =>
    ["write", "create", "update", "delete"].includes(operation),
  );
  if (mutatesData && condition !== "isStaff()") {
    fail("tüm yazma, oluşturma, güncelleme ve silme izinleri yalnızca isStaff() kullanmalı.");
  }
}

console.log("Firestore güvenlik kuralı regresyon kontrolü başarılı.");
console.log("Not: Bu hızlı kontrol, Firebase derleyicisi/emülatörü yerine davranış gerilemelerini denetler.");
