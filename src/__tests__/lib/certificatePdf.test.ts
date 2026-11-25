/** @jest-environment node */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createCertificatePdf } from '@/lib/certificatePdf';

const fontDir = join(process.cwd(), 'public', 'fonts', 'certificate');
const assets = {
  titleFont: readFileSync(join(fontDir, 'SourceSerif4Display-Semibold.ttf')).toString('base64'),
  bodyFont: readFileSync(join(fontDir, 'SourceSans3-Regular.ttf')).toString('base64'),
};

const single = {
  title: '22K Sarı Altın Bileklik',
  verificationUrl: 'https://www.akturkkuyumculuk.com/sertifika?code=BLK-TEST-001',
  verificationCode: 'BLK-TEST-001',
  productCode: 'BLK-TEST-001',
  certificateNumber: 'AKS-TEST-001',
  productType: 'Bileklik',
  physicalCount: 1,
  engravingCodes: ['AKTEST01'],
  parts: [],
  warrantyInfo: 'BİR YILLIK RENK GÜVENCESİ\nRenk değişimine karşı üretim kaynaklı kusurlar için güvence verilir.',
  careInstructions: 'SAKLAMA VE TEMİZLİK\nYumuşak ve kuru bir bezle temizleyiniz.',
};

function parts(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    type: 'Bileklik',
    code: 'TPT-TEST-' + String(index + 1).padStart(3, '0'),
    markCode: 'AK' + String(index + 1).padStart(6, '0'),
    gram: '9,50',
    ayar: '22K',
    color: 'Sarı',
    stone: 'Taşsız Ürün',
    batchNumber: 'URT-2026-H48-BLK',
  }));
}

test('tekil belge bir yatay A4 üretir ve PDF içinde doğrulama bağlantısı bulunur', () => {
  const pdf = createCertificatePdf(single, assets);
  expect(pdf.getNumberOfPages()).toBe(1);
  expect(pdf.internal.pageSize.getWidth()).toBeCloseTo(297, 1);
  expect(pdf.internal.pageSize.getHeight()).toBeCloseTo(210, 1);
  expect(pdf.output()).toContain('/URI (' + single.verificationUrl + ')');
});

test('dört parça ve on ürün bütün satırlarıyla birer ek sayfaya sığar', () => {
  for (const count of [4, 10]) {
    const pdf = createCertificatePdf({ ...single, parts: parts(count), physicalCount: count }, assets);
    expect(pdf.getNumberOfPages()).toBe(2);
  }
});

test('uzun politika metni ve büyük ürün listesi gerektiğinde ek sayfa oluşturur', () => {
  const warrantyInfo = Array.from({ length: 40 }, () => single.warrantyInfo).join('\n\n');
  const withLongPolicies = createCertificatePdf({ ...single, warrantyInfo }, assets);
  const withLotsOfParts = createCertificatePdf({ ...single, parts: parts(35), physicalCount: 35 }, assets);
  expect(withLongPolicies.getNumberOfPages()).toBeGreaterThan(1);
  expect(withLotsOfParts.getNumberOfPages()).toBeGreaterThan(3);
});
