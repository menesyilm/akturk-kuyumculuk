import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface CertificatePart {
  type?: string;
  code?: string;
  markCode?: string;
  sira?: string;
  gram?: string;
  ayar?: string;
  color?: string;
  stone?: string;
  batchNumber?: string;
}

interface CertificatePdfData {
  title: string;
  verificationUrl: string;
  verificationCode: string;
  productCode?: string;
  certificateNumber?: string;
  productionDate?: string;
  certificateDate?: string;
  batchNumber?: string;
  productType?: string;
  gram?: string;
  ayar?: string;
  goldColor?: string;
  stoneType?: string;
  sira?: string;
  physicalCount: number;
  warrantyPolicyVersion?: number;
  warrantyInfo?: string;
  careInstructions?: string;
  engravingCodes: string[];
  parts: CertificatePart[];
  image?: string;
}

interface CertificatePdfAssets {
  titleFont: string;
  bodyFont: string;
  logo?: Uint8Array;
  photo?: string;
}

const PAGE = { width: 297, height: 210, left: 21, right: 276, bottom: 182 };
const C = {
  ivory: '#FCF7EC',
  linen: '#F5EAD3',
  ink: '#241B14',
  brown: '#594739',
  gold: '#86601D',
  metal: '#A97C31',
  glint: '#DBBE79',
  rule: '#D4BD91',
  white: '#FFFFFF',
};
const TITLE_FONT = 'CertificateSerif';
const BODY_FONT = 'CertificateSans';
const FONT_PATH = '/fonts/certificate';
const PHOTO_TIMEOUT = 5_000;

function value(field?: string | number) {
  return field === undefined || field === '' ? '-' : String(field);
}

function font(pdf: jsPDF, size: number, style: 'body' | 'title' = 'body', color = C.ink) {
  pdf.setFont(style === 'title' ? TITLE_FONT : BODY_FONT, 'normal');
  pdf.setFontSize(size);
  pdf.setTextColor(color);
}

function letterspaced(pdf: jsPDF, text: string, x: number, y: number, size: number, spacing = 0.34) {
  font(pdf, size, 'body', C.gold);
  pdf.text(text, x, y, { charSpace: spacing });
}

function line(pdf: jsPDF, x1: number, y: number, x2: number, color = C.rule, width = 0.2) {
  pdf.setLineWidth(width);
  pdf.setDrawColor(color);
  pdf.line(x1, y, x2, y);
}

function diamond(pdf: jsPDF, x: number, y: number, d: number, color = C.metal) {
  pdf.setFillColor(color);
  pdf.lines([[d, d], [-d, d], [-d, -d], [d, -d]], x, y - d, [1, 1], 'F', true);
}

function frameCorner(pdf: jsPDF, x: number, y: number, horizontal: 1 | -1, vertical: 1 | -1) {
  const sx = horizontal * 0.71;
  const sy = vertical * 0.71;
  pdf.setDrawColor(C.metal);
  pdf.setLineWidth(0.3);
  pdf.lines([[0.2, -3.3, 4.5, -6, 9.5, -6.2], [4.1, 0, 7.3, -2.4, 10, -5.2]],
    x + 2.2 * sx, y + 14 * sy, [sx, sy], 'S');
  pdf.lines([[-3.3, 0.2, -6, 4.5, -6.2, 9.5], [0, 4.1, -2.4, 7.3, -5.2, 10]],
    x + 14 * sx, y + 2.2 * sy, [sx, sy], 'S');
  pdf.setFillColor(C.glint);
  pdf.lines([[2.3, -4.7, 7, -5.8, 10, -6.3], [-0.8, 3.2, -4.6, 7.4, -10, 6.3]],
    x + 2.9 * sx, y + 9.8 * sy, [sx, sy], 'F', true);
  diamond(pdf, x + 2 * sx, y + 2 * sy, 1.25, C.gold);
}

function drawFrame(pdf: jsPDF) {
  const { width, height } = PAGE;
  pdf.setFillColor(C.ivory);
  pdf.rect(6.8, 6.8, width - 13.6, height - 13.6, 'F');
  for (const [inset, border, thickness] of [[7.4, C.gold, 0.5], [8.35, C.glint, 0.24], [10.2, C.metal, 0.2]] as const) {
    pdf.setLineWidth(thickness);
    pdf.setDrawColor(border);
    pdf.rect(inset, inset, width - 2 * inset, height - 2 * inset);
  }
  frameCorner(pdf, 10.4, 10.4, 1, 1);
  frameCorner(pdf, width - 10.4, 10.4, -1, 1);
  frameCorner(pdf, 10.4, height - 10.4, 1, -1);
  frameCorner(pdf, width - 10.4, height - 10.4, -1, -1);
}

function addFittedImage(pdf: jsPDF, image: string | Uint8Array, format: 'JPEG' | 'PNG', x: number, y: number, w: number, h: number) {
  const { width, height } = pdf.getImageProperties(image);
  const scale = Math.min(w / width, h / height);
  const sw = width * scale;
  const sh = height * scale;
  pdf.addImage(image, format, x + (w - sw) / 2, y + (h - sh) / 2, sw, sh);
}

function drawBrand(pdf: jsPDF, logo?: Uint8Array) {
  if (logo) addFittedImage(pdf, logo, 'PNG', 21, 17, 16, 16);
  const x = logo ? 41 : PAGE.left;
  font(pdf, 23, 'title');
  pdf.text('AKTÜRK', x, 25, { charSpace: 0.7 });
  letterspaced(pdf, 'KUYUMCULUK  /  TRABZON', x + 0.25, 30.6, 8);
}

function sectionTitle(pdf: jsPDF, text: string, x: number, y: number, width: number) {
  font(pdf, 16, 'title');
  pdf.text(text, x, y);
  line(pdf, x, y + 2.7, x + width);
  diamond(pdf, x + width, y + 2.7, 0.9);
}

function drawQr(pdf: jsPDF, url: string, x: number, y: number, width: number) {
  const { modules } = QRCode.create(url, { errorCorrectionLevel: 'M' });
  const cell = width / (modules.size + 8);
  pdf.setFillColor(C.white);
  pdf.rect(x, y, width, width, 'F');
  pdf.setFillColor('#18130C');
  for (let row = 0; row < modules.size; row += 1) {
    let column = 0;
    while (column < modules.size) {
      if (!modules.get(row, column)) {
        column += 1;
        continue;
      }
      const start = column;
      while (column < modules.size && modules.get(row, column)) column += 1;
      pdf.rect(x + (start + 4) * cell, y + (row + 4) * cell, (column - start) * cell, cell, 'F');
    }
  }
  pdf.link(x, y, width, width, { url });
}

function drawProduct(pdf: jsPDF, data: CertificatePdfData, photo?: string) {
  const x = PAGE.left;
  const width = 120;
  if (photo) {
    pdf.setDrawColor(C.rule);
    pdf.setLineWidth(0.25);
    pdf.setFillColor('#F4E8D6');
    pdf.rect(x, 70, 38, 36, 'FD');
    addFittedImage(pdf, photo, 'JPEG', x + 0.9, 70.9, 36.2, 34.2);
  }
  const titleX = photo ? x + 43 : x;
  const titleWidth = photo ? width - 43 : width;
  letterspaced(pdf, 'SERTİFİKALI ÜRÜN', titleX, 75, 8.8);
  font(pdf, photo ? 19 : 24, 'title');
  let titleLines: string[] = pdf.splitTextToSize(data.title, titleWidth);
  if (titleLines.length > 3) {
    font(pdf, 16, 'title');
    titleLines = pdf.splitTextToSize(data.title, titleWidth);
  }
  // The product title normally has no more than three lines. Preserve an
  // unusually long title in the PDF metadata and keep the certificate legible.
  if (titleLines.length > 3) {
    titleLines = titleLines.slice(0, 3);
    while (pdf.getTextWidth(titleLines[2] + '…') > titleWidth) titleLines[2] = titleLines[2].slice(0, -1);
    titleLines[2] += '…';
  }
  titleLines.forEach((text, index) => pdf.text(text, titleX, 83.5 + index * 7));
  if (!photo) {
    font(pdf, 9, 'body', C.brown);
    pdf.text(data.image ? 'Ürünün kayıtlı fotoğrafı yüklenemedi.' : 'Bu kayıtta ürün fotoğrafı bulunmuyor.', titleX, 91.5 + (titleLines.length - 1) * 7);
  }
}

function drawProductFacts(pdf: jsPDF, data: CertificatePdfData) {
  const facts: [string, string | undefined][] = [
    ['Ürün kodu', data.productCode],
    ['Sertifika numarası', data.certificateNumber],
    ['Ayar / net gram', value(data.ayar) + (data.gram ? '  /  ' + data.gram + ' gr' : '')],
    ['Kategori / adet', (data.productType || '-') + '  /  ' + data.physicalCount],
    ['Üretim tarihi', data.productionDate],
    ['Belge tarihi', data.certificateDate],
    ['Üretim parti numarası', data.batchNumber],
    ['Kazıma kodu', data.parts.length ? 'Ürün dökümünde' : data.engravingCodes.join('  /  ')],
    ['Altın rengi', data.goldColor],
    ['Taş / sıra', data.stoneType ? data.stoneType + (data.sira ? '  /  ' + data.sira : '') : undefined],
  ];
  for (let index = 0; index < facts.length; index++) {
    const [label, content] = facts[index];
    const x = PAGE.left + (index % 2) * 62;
    const y = 117 + Math.floor(index / 2) * 10.1;
    font(pdf, 8.1, 'body', C.gold);
    pdf.text(label.toLocaleUpperCase('tr-TR'), x, y);
    font(pdf, 11.2);
    const text = value(content);
    const width = pdf.getTextWidth(text);
    if (width > 57) pdf.setFontSize(Math.max(7.5, 11.2 * 57 / width));
    pdf.text(text, x, y + 4.5);
    line(pdf, x, y + 6.5, x + 57);
  }
}

interface PolicyLine {
  text: string;
  style: 'section' | 'heading' | 'body' | 'gap' | 'sectionGap';
}

const POLICIES = [
  { key: 'warrantyInfo', title: 'Garanti Koşulları' },
  { key: 'careInstructions', title: 'Bakım Talimatları' },
] as const;

function policyLines(pdf: jsPDF, data: CertificatePdfData, width: number): PolicyLine[] {
  const lines: PolicyLine[] = [];
  for (const { key, title } of POLICIES) {
    if (lines.length) lines.push({ text: '', style: 'sectionGap' });
    lines.push({ text: title, style: 'section' });
    const paragraphs = (data[key]?.trim() || 'Bu kayıtta ilgili metin bulunmuyor.').split(/\r?\n\s*\r?\n/);
    for (const [index, block] of paragraphs.entries()) {
      if (index > 0) lines.push({ text: '', style: 'gap' });
      const blockLines = block.split(/\r?\n/).map((text) => text.trim()).filter(Boolean);
      const heading = blockLines[0];
      const hasHeading = blockLines.length > 1 && heading.length <= 85 && heading.toLocaleUpperCase('tr-TR') === heading;
      if (hasHeading) {
        font(pdf, 9, 'title');
        for (const text of pdf.splitTextToSize(heading, width) as string[]) lines.push({ text, style: 'heading' });
      }
      font(pdf, 10.4);
      for (const paragraph of blockLines.slice(hasHeading ? 1 : 0)) {
        for (const text of pdf.splitTextToSize(paragraph, width) as string[]) lines.push({ text, style: 'body' });
      }
    }
  }
  return lines;
}

const POLICY_LEADING = { section: 9, heading: 4.1, body: 4.3, gap: 2.5, sectionGap: 5 };

function drawPolicy(pdf: jsPDF, lines: PolicyLine[], x: number, y: number, limit: number, width: number) {
  let index = 0;
  for (; index < lines.length; index++) {
    const { text, style } = lines[index];
    const after = y + POLICY_LEADING[style];
    const next = lines[index + 1];
    const trailingLine = (style === 'section' || style === 'heading') && next ? POLICY_LEADING[next.style] : 0;
    if (after + trailingLine > limit) break;
    if (style === 'section') sectionTitle(pdf, text, x, y, width);
    if (style === 'heading') {
      font(pdf, 9, 'title', C.gold);
      pdf.text(text, x, y);
    }
    if (style === 'body') {
      font(pdf, 10.4);
      pdf.text(text, x, y);
    }
    y = after;
  }
  return { remaining: lines.slice(index), nextY: y };
}

function drawVerification(pdf: jsPDF, data: CertificatePdfData) {
  const x = PAGE.left;
  drawQr(pdf, data.verificationUrl, x, 170, 23);
  letterspaced(pdf, 'ÇEVRİMİÇİ DOĞRULAMA', x + 28, 176, 8.3);
  font(pdf, 12, 'title');
  pdf.text(data.verificationCode, x + 28, 182);
  font(pdf, 8.9, 'body', C.brown);
  pdf.text('www.akturkkuyumculuk.com/sertifika', x + 28, 187);
  pdf.link(x + 28, 183, 75, 5, { url: data.verificationUrl });
}

function drawVerifiedSeal(pdf: jsPDF, x: number, y: number) {
  pdf.setFillColor(C.linen);
  pdf.setDrawColor(C.metal);
  pdf.setLineWidth(0.35);
  pdf.circle(x, y, 8, 'FD');
  pdf.setLineWidth(0.17);
  pdf.circle(x, y, 6.55, 'S');
  font(pdf, 15, 'title', C.gold);
  pdf.text('AK', x, y + 2.05, { align: 'center' });
  letterspaced(pdf, 'KAYIT DOĞRULANDI', x + 12, y - 0.4, 8.1);
  font(pdf, 9.3, 'body', C.brown);
  pdf.text('Aktürk Kuyumculuk', x + 12, y + 4.2);
}

function drawMainPage(pdf: jsPDF, data: CertificatePdfData, assets: CertificatePdfAssets) {
  drawFrame(pdf);
  drawBrand(pdf, assets.logo);
  font(pdf, 32, 'title');
  pdf.text('Ürün Sertifikası', PAGE.left, 48);
  font(pdf, 14.5, 'title', C.gold);
  pdf.text('Orijinallik ve garanti belgesi', PAGE.left, 55.8);
  line(pdf, PAGE.left, 61.4, 139);
  diamond(pdf, 139, 61.4, 1);
  pdf.setDrawColor(C.rule);
  pdf.setLineWidth(0.24);
  pdf.line(148.5, 20, 148.5, 192);
  drawProduct(pdf, data, assets.photo);
  drawProductFacts(pdf, data);
  drawVerification(pdf, data);

  const policy = drawPolicy(pdf, policyLines(pdf, data, 121), 156, 26, 171.5, 120);
  if (policy.remaining.length) {
    font(pdf, 9, 'body', C.brown);
    pdf.text('Garanti ve bakım metni izleyen sayfada devam eder.', 156, 176);
  }
  drawVerifiedSeal(pdf, 165, Math.max(180.5, Math.min(184.5, policy.nextY + 10)));
  return policy.remaining;
}

function addContinuation(pdf: jsPDF, data: CertificatePdfData, title: string, label: string) {
  pdf.addPage();
  drawFrame(pdf);
  letterspaced(pdf, 'AKTÜRK KUYUMCULUK  /  ' + label, PAGE.left, 22, 9);
  font(pdf, 29, 'title');
  pdf.text(title, PAGE.left, 36);
  font(pdf, 10, 'body', C.brown);
  pdf.text('Ürün kodu  ' + value(data.productCode) + '    /    Sertifika  ' + value(data.certificateNumber), PAGE.left, 44);
  line(pdf, PAGE.left, 48.5, PAGE.right, C.metal, 0.32);
}

function appendPolicies(pdf: jsPDF, data: CertificatePdfData, remaining: PolicyLine[]) {
  while (remaining.length) {
    addContinuation(pdf, data, 'Garanti ve Bakım', 'DEVAM SAYFASI');
    for (const x of [PAGE.left, 156]) {
      remaining = drawPolicy(pdf, remaining, x, 58, PAGE.bottom, 120).remaining;
      if (!remaining.length) break;
    }
  }
}

const PART_COLUMNS = [
  { label: 'No', width: 12 },
  { label: 'Ürün', width: 47 },
  { label: 'Takip kodu', width: 48 },
  { label: 'Kazıma kodu', width: 31 },
  { label: 'Net gram / ayar', width: 35 },
  { label: 'Renk / taş', width: 42 },
  { label: 'Parti no', width: 40 },
];

function appendParts(pdf: jsPDF, data: CertificatePdfData) {
  if (data.parts.length === 0) return;
  let y = 0;
  function startPartsPage() {
    addContinuation(pdf, data, 'Ürün ve Kod Dökümü', 'SERTİFİKA EKİ');
    pdf.setFillColor(C.linen);
    pdf.rect(PAGE.left, 55, PAGE.right - PAGE.left, 9, 'F');
    font(pdf, 10, 'title');
    let x = PAGE.left;
    for (const { label, width } of PART_COLUMNS) {
      pdf.text(label, x + 2, 60.8);
      x += width;
    }
    y = 64;
  }

  startPartsPage();
  data.parts.forEach((part, index) => {
    const cells = [
      String(index + 1),
      value(part.type) + (part.sira ? ' / Sıra ' + part.sira : ''),
      value(part.code),
      value(part.markCode),
      (part.gram ? part.gram + ' gr' : '-') + ' / ' + value(part.ayar),
      value(part.color) + ' / ' + value(part.stone),
      value(part.batchNumber),
    ];
    font(pdf, 10.2);
    let rows: string[][] = cells.map((cell, column) => pdf.splitTextToSize(cell, PART_COLUMNS[column].width - 4));
    while (rows.some((cell) => cell.length > 0)) {
      const count = Math.max(...rows.map((cell) => cell.length));
      const spacePerFreshPage = Math.floor((PAGE.bottom - 64 - 3.6) / 4);
      const lines = Math.min(count, spacePerFreshPage);
      const height = Math.max(10.3, lines * 4 + 3.6);
      if (y + height > PAGE.bottom) startPartsPage();
      if (index % 2 === 0) {
        pdf.setFillColor('#F9F1E1');
        pdf.rect(PAGE.left, y, PAGE.right - PAGE.left, height, 'F');
      }
      let x = PAGE.left;
      font(pdf, 10.2);
      rows.forEach((cell, column) => {
        cell.slice(0, lines).forEach((text, row) => pdf.text(text, x + 2, y + 5.5 + row * 4));
        x += PART_COLUMNS[column].width;
      });
      y += height;
      line(pdf, PAGE.left, y, PAGE.right);
      rows = rows.map((cell) => cell.slice(lines));
    }
  });
}

function drawFooters(pdf: jsPDF, data: CertificatePdfData) {
  const total = pdf.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    pdf.setPage(page);
    line(pdf, 31, 195, 129);
    line(pdf, 168, 195, 266);
    diamond(pdf, 129, 195, 0.9);
    diamond(pdf, 168, 195, 0.9);
    font(pdf, 9.7, 'title', C.gold);
    pdf.text('TRABZON', 148.5, 196, { align: 'center', charSpace: 0.4 });
    font(pdf, 7.5, 'body', C.brown);
    if (data.warrantyPolicyVersion) pdf.text('Garanti politikası  /  Sürüm ' + data.warrantyPolicyVersion, 31, 198.3);
    pdf.text(page + ' / ' + total, 266, 198.3, { align: 'right' });
  }
}

export function createCertificatePdf(data: CertificatePdfData, assets: CertificatePdfAssets) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true, putOnlyUsedFonts: true });
  pdf.addFileToVFS('SourceSerif4Display-Semibold.ttf', assets.titleFont);
  pdf.addFont('SourceSerif4Display-Semibold.ttf', TITLE_FONT, 'normal');
  pdf.addFileToVFS('SourceSans3-Regular.ttf', assets.bodyFont);
  pdf.addFont('SourceSans3-Regular.ttf', BODY_FONT, 'normal');
  pdf.setProperties({ title: 'Aktürk Kuyumculuk – ' + data.title, author: 'Aktürk Kuyumculuk', subject: data.verificationCode });
  const remaining = drawMainPage(pdf, data, assets);
  appendPolicies(pdf, data, remaining);
  appendParts(pdf, data);
  drawFooters(pdf, data);
  return pdf;
}

async function fetchBytes(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('PDF kaynağı yüklenemedi.');
  return new Uint8Array(await response.arrayBuffer());
}

function base64(bytes: Uint8Array) {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x4000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x4000));
  }
  return btoa(binary);
}

async function loadPhoto(src?: string) {
  if (!src) return undefined;
  try {
    const original = new URL(src, window.location.origin);
    if (original.origin !== window.location.origin
      && (original.origin !== 'https://res.cloudinary.com' || !original.pathname.startsWith('/dyhd8ltve/image/upload/'))) return undefined;
    const response = await fetch(original, { credentials: 'omit', signal: AbortSignal.timeout(PHOTO_TIMEOUT) });
    if (!response.ok) return undefined;
    const bitmap = await createImageBitmap(await response.blob());
    try {
      const scale = Math.min(1, 1050 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) return undefined;
      context.fillStyle = '#F4E8D6';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.94);
    } finally {
      bitmap.close();
    }
  } catch {
    return undefined;
  }
}

export async function downloadCertificatePdf(data: CertificatePdfData) {
  const [titleFont, bodyFont, logo, photo] = await Promise.all([
    fetchBytes(FONT_PATH + '/SourceSerif4Display-Semibold.ttf'),
    fetchBytes(FONT_PATH + '/SourceSans3-Regular.ttf'),
    fetchBytes('/icon.png').catch(() => undefined),
    loadPhoto(data.image),
  ]);
  const pdf = createCertificatePdf(data, { titleFont: base64(titleFont), bodyFont: base64(bodyFont), logo, photo });
  const filename = 'Akturk-Sertifika-' + data.verificationCode.replace(/[^A-Z0-9_-]/gi, '-') + '.pdf';
  const url = URL.createObjectURL(pdf.output('blob'));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
