import { lstatSync, readFileSync } from "node:fs";
import { extname } from "node:path";
import { spawnSync } from "node:child_process";

const MAX_TEXT_FILE_BYTES = 5 * 1024 * 1024;
const BINARY_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png",
  ".webp",
  ".woff",
  ".woff2",
]);

const PLACEHOLDER_VALUES = [
  /^$/,
  /^<.*>$/,
  /^\$\{.*\}$/,
  /^(?:change|replace)[-_ ]?me$/i,
  /^(?:example|placeholder|your)[-_ ].*$/i,
  /^x+$/i,
  /^(?:process\.env|import\.meta\.env)(?:\.[A-Za-z0-9_]+|\[['"][^'"]+['"]\])$/,
  /^Deno\.env\.get\(.+\)$/,
  /^os\.environ(?:\.get\(.+\)|\[.+\])$/,
  /^System\.getenv\(.+\)$/,
  /^(?:string|number|boolean|unknown|never|null|undefined)(?:\s*\|\s*(?:string|number|boolean|unknown|never|null|undefined))*$/,
];

const SENSITIVE_ENV_NAMES = new Set([
  "CLOUDINARY_API_SECRET",
  "NEXT_PUBLIC_CLOUDINARY_API_SECRET",
  "GOLD_API_KEY",
  "OPENAI_API_KEY",
  "FIREBASE_PRIVATE_KEY",
  "GOOGLE_PRIVATE_KEY",
]);
const SENSITIVE_NAME_SOURCE = [...SENSITIVE_ENV_NAMES].join("|");

const TOKEN_PATTERNS = [
  {
    label: "private-key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    label: "cloudinary-authenticated-url",
    pattern: /cloudinary:\/\/[^:\s]+:[^@\s]+@[^\s]+/i,
  },
  {
    label: "openai-secret-key",
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/,
  },
  {
    label: "github-access-token",
    pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{20,})\b/,
  },
  {
    label: "aws-access-key",
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  },
];

function sourceFiles() {
  const result = spawnSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    {
      encoding: "buffer",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  if (result.status !== 0) {
    console.error("Gizli bilgi taraması için kaynak dosyalar alınamadı.");
    process.exit(2);
  }

  return result.stdout
    .toString("utf8")
    .split("\0")
    .filter(Boolean);
}

function isPlaceholder(value) {
  let normalized = value.trim().replace(/[;,]\s*$/, "").trim();
  const quoted = normalized.match(/^(['"])([\s\S]*)\1$/);
  if (quoted) normalized = quoted[2];
  return PLACEHOLDER_VALUES.some((pattern) => pattern.test(normalized));
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split("\n").length;
}

const files = sourceFiles();
const findings = [];

for (const file of files) {
  if (BINARY_EXTENSIONS.has(extname(file).toLowerCase())) {
    continue;
  }

  let metadata;
  try {
    metadata = lstatSync(file);
  } catch {
    continue;
  }

  if (metadata.isSymbolicLink() || !metadata.isFile() || metadata.size > MAX_TEXT_FILE_BYTES) {
    continue;
  }

  const buffer = readFileSync(file);
  if (buffer.includes(0)) {
    continue;
  }

  const text = buffer.toString("utf8");

  for (const [lineIndex, line] of text.split(/\r?\n/).entries()) {
    const assignmentPattern = new RegExp(
      `\\b(${SENSITIVE_NAME_SOURCE})\\b\\s*(?:=(?!=)|:(?!:))\\s*(\\$\\{[^}\\r\\n]*\\}|["'][^"'\\r\\n]*["']|[^,;}\\r\\n]+)`,
      "gi",
    );
    for (const match of line.matchAll(assignmentPattern)) {
      const [, name, value] = match;
      const normalizedName = name.toUpperCase();
      if (SENSITIVE_ENV_NAMES.has(normalizedName) && !isPlaceholder(value)) {
        findings.push({ file, line: lineIndex + 1, label: normalizedName });
      }
    }
  }

  for (const { label, pattern } of TOKEN_PATTERNS) {
    const index = text.search(pattern);
    if (index >= 0) {
      findings.push({ file, line: lineNumberAt(text, index), label });
    }
  }
}

const uniqueFindings = [
  ...new Map(findings.map((finding) => [`${finding.file}:${finding.line}:${finding.label}`, finding])).values(),
];

if (uniqueFindings.length > 0) {
  console.error("Olası özel kimlik bilgileri bulundu. Değerler güvenlik nedeniyle gösterilmedi:");
  for (const finding of uniqueFindings) {
    console.error(`- ${finding.file}:${finding.line} (${finding.label})`);
  }
  process.exit(1);
}

console.log(`Gizli bilgi taraması başarılı (${files.length} kaynak dosya).`);
