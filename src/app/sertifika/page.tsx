'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, LoaderCircle, QrCode, Search, ShieldCheck, XCircle } from 'lucide-react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface CertificatePart {
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

interface CertificateRecord {
  id: string;
  source: 'certificate' | 'catalog';
  collectionName?: string;
  name?: string;
  productName?: string;
  image?: string;
  category?: string;
  productType?: string;
  productCode?: string;
  certificateNumber?: string;
  certificateDate?: string;
  productionDate?: string;
  certificateStatus?: string;
  physicalCount?: number;
  gram?: string;
  ayar?: string;
  goldColor?: string;
  stoneType?: string;
  batchNumber?: string;
  sira?: string;
  warrantyInfo?: string;
  careInstructions?: string;
  warrantyPolicyVersion?: number;
  certificatePartsJson?: string;
  engravingCodesJson?: string;
  childProductCodesJson?: string;
  parts?: CertificatePart[];
}

function parseParts(value?: string): CertificatePart[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as CertificatePart[]) : [];
  } catch {
    return [];
  }
}

function parseStringArray(value?: string): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

function displayValue(value?: string | number) {
  return value === undefined || value === null || value === '' ? '—' : String(value);
}

function inferProductionDate(productCode?: string) {
  const match = productCode?.match(/^[A-Z]+-(\d{2})(\d{2})(\d{2})-\d{3,}$/i);
  if (!match) return undefined;
  const [, year, month, day] = match;
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  if (monthNumber < 1 || monthNumber > 12 || dayNumber < 1 || dayNumber > 31) return undefined;
  return `${day}.${month}.20${year}`;
}

export default function SertifikaPage() {
  const [productCode, setProductCode] = useState('');
  const [record, setRecord] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  const performSearch = useCallback(async (rawCode: string) => {
    const normalizedCode = rawCode.trim().toUpperCase();
    if (!normalizedCode) {
      setError('Lütfen ürün, sertifika, takip veya kazıma kodunu giriniz.');
      return;
    }

    setLoading(true);
    setError('');
    setRecord(null);
    setQrDataUrl('');
    setSearchPerformed(false);

    try {
      const certificateQuery = query(
        collection(db, 'sertifikalar'),
        where('lookupCodes', 'array-contains', normalizedCode),
        limit(1)
      );
      const certificateSnapshot = await getDocs(certificateQuery);

      if (!certificateSnapshot.empty) {
        const certificateDocument = certificateSnapshot.docs[0];
        const data = certificateDocument.data();
        setRecord({
          id: certificateDocument.id,
          source: 'certificate',
          ...data,
          parts: parseParts(data.certificatePartsJson as string | undefined),
        } as CertificateRecord);
        setSearchPerformed(true);
        return;
      }

      const categories = ['bileklik', 'kolye', 'yuzukvekupe', 'set'];
      for (const category of categories) {
        const catalogQuery = query(
          collection(db, category),
          where('productCode', '==', normalizedCode),
          limit(1)
        );
        const catalogSnapshot = await getDocs(catalogQuery);
        if (!catalogSnapshot.empty) {
          const catalogDocument = catalogSnapshot.docs[0];
          setRecord({
            id: catalogDocument.id,
            source: 'catalog',
            collectionName: category,
            category,
            certificateStatus: 'active',
            ...catalogDocument.data(),
          } as CertificateRecord);
          setSearchPerformed(true);
          return;
        }
      }

      setSearchPerformed(true);
      setError('Bu kodla eşleşen aktif bir ürün veya sertifika kaydı bulunamadı.');
    } catch (searchError) {
      console.error('Sertifika arama hatası:', searchError);
      setSearchPerformed(true);
      setError('Doğrulama sistemine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code') || params.get('kod');
    if (urlCode) {
      const normalizedCode = urlCode.trim().toUpperCase();
      const timer = window.setTimeout(() => {
        setProductCode(normalizedCode);
        void performSearch(normalizedCode);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [performSearch]);

  const isActive = record?.certificateStatus !== 'cancelled';
  const parts = record?.parts || [];
  const engravingCodes = parseStringArray(record?.engravingCodesJson);
  const title = record?.productName || record?.name || record?.productType || 'Sertifikalı Ürün';
  const productionDate = record?.productionDate || inferProductionDate(record?.productCode);

  const downloadCertificatePdf = async () => {
    if (!record || pdfLoading) return;
    setPdfLoading(true);

    try {
      const verificationCode = record.productCode || record.certificateNumber || productCode;
      const verificationUrl = `${window.location.origin}/sertifika?code=${encodeURIComponent(verificationCode)}`;
      const [{ default: html2canvas }, { jsPDF }, { default: QRCode }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
        import('qrcode'),
      ]);

      const generatedQr = await QRCode.toDataURL(verificationUrl, {
        width: 240,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#12302D', light: '#FFFFFF' },
      });
      setQrDataUrl(generatedQr);
      let template = pdfTemplateRef.current;
      for (let attempt = 0; !template && attempt < 20; attempt += 1) {
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
        template = pdfTemplateRef.current;
      }
      if (!template) throw new Error('PDF şablonu hazırlanamadı.');
      const images = Array.from(template.querySelectorAll('img'));
      await Promise.all(images.map(async (image) => {
        if (image.complete) {
          await image.decode().catch(() => undefined);
          return;
        }
        await new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        });
      }));

      const canvas = await html2canvas(template, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        windowWidth: 794,
      });
      const imageData = canvas.toDataURL('image/jpeg', 0.96);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const margin = 7;
      const contentWidth = 210 - margin * 2;
      const printableHeight = 297 - margin * 2;
      const imageHeight = (canvas.height * contentWidth) / canvas.width;
      let page = 0;

      // Şablon üst kenardan başlayarak fiziksel A4 yüksekliğine sığıyorsa
      // ikinci sayfaya bölme. Normal tekli ürün belgesi 5 mm'den fazla alt
      // boşlukla tek sayfaya sığar; uzun set/toptan içerikleri ise bölünür.
      const firstPageAvailableHeight = 297 - margin;
      if (imageHeight <= firstPageAvailableHeight) {
        pdf.addImage(imageData, 'JPEG', margin, margin, contentWidth, imageHeight, undefined, 'FAST');
      } else {
        const templateRect = template.getBoundingClientRect();
        const canvasScaleY = canvas.height / templateRect.height;
        const preferredBreaks = Array.from(template.querySelectorAll<HTMLElement>('[data-pdf-break-before]')).map((element) => (
          (element.getBoundingClientRect().top - templateRect.top) * canvasScaleY
        ));
        const fallbackBreaks = Array.from(template.querySelectorAll<HTMLElement>('[data-pdf-break-after]')).map((element) => (
            (element.getBoundingClientRect().bottom - templateRect.top) * canvasScaleY
        ));
        const canvasPixelsPerMillimeter = canvas.width / contentWidth;
        const maxSegmentHeight = Math.floor(printableHeight * canvasPixelsPerMillimeter);
        const minimumUsefulSegmentHeight = Math.floor(maxSegmentHeight * 0.55);
        let startY = 0;

        while (startY < canvas.height) {
          let endY = Math.min(startY + maxSegmentHeight, canvas.height);
          if (endY < canvas.height) {
            const preferredCleanBreaks = preferredBreaks.filter((candidate) => (
              candidate >= startY + minimumUsefulSegmentHeight && candidate <= endY
            ));
            const fallbackCleanBreaks = fallbackBreaks.filter((candidate) => (
              candidate >= startY + minimumUsefulSegmentHeight && candidate <= endY
            ));
            if (preferredCleanBreaks.length > 0) {
              endY = Math.floor(preferredCleanBreaks[0]);
            } else if (fallbackCleanBreaks.length > 0) {
              endY = Math.floor(fallbackCleanBreaks[fallbackCleanBreaks.length - 1]);
            }
          }

          const segmentHeightPixels = Math.max(1, endY - startY);
          const segmentCanvas = document.createElement('canvas');
          segmentCanvas.width = canvas.width;
          segmentCanvas.height = segmentHeightPixels;
          const segmentContext = segmentCanvas.getContext('2d');
          if (!segmentContext) throw new Error('PDF sayfa bölümü hazırlanamadı.');
          segmentContext.fillStyle = '#ffffff';
          segmentContext.fillRect(0, 0, segmentCanvas.width, segmentCanvas.height);
          segmentContext.drawImage(
            canvas,
            0,
            startY,
            canvas.width,
            segmentHeightPixels,
            0,
            0,
            canvas.width,
            segmentHeightPixels,
          );

          if (page > 0) pdf.addPage();
          const segmentHeight = segmentHeightPixels / canvasPixelsPerMillimeter;
          pdf.addImage(segmentCanvas.toDataURL('image/jpeg', 0.96), 'JPEG', margin, margin, contentWidth, segmentHeight, undefined, 'FAST');
          pdf.setDrawColor(169, 133, 66);
          pdf.setLineWidth(0.45);
          pdf.rect(margin, margin, contentWidth, segmentHeight);

          startY = endY;
          page += 1;
        }
      }

      const safeCode = verificationCode.replace(/[^A-Z0-9_-]/gi, '-');
      pdf.save(`Akturk-Sertifika-${safeCode}.pdf`);
    } catch (pdfError) {
      console.error('PDF oluşturma hatası:', pdfError);
      setError('PDF belgesi oluşturulamadı. Lütfen tekrar deneyiniz.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black pt-6 sm:pt-10 pb-12 sm:pb-16">
      <div className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-7 sm:mb-10"
        >
          <div className="flex justify-center mb-3">
            <ShieldCheck className="w-14 h-14 sm:w-16 sm:h-16 text-brand-gold" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-gold mb-3">
            Sertifika Doğrulama
          </h1>
          <p className="text-brand-light-gray text-sm sm:text-base">
            Ürün, sertifika, takip veya ürün üzerindeki kazıma koduyla sorgulama yapabilirsiniz.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-brand-dark-gray ring-2 ring-brand-gold p-4 sm:p-6 lg:p-8 mb-7"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label htmlFor="productCode" className="block text-brand-light-gray text-sm mb-2">Doğrulama Kodu</label>
              <input
                id="productCode"
                type="text"
                autoComplete="off"
                placeholder="Örn: BLK-261104-001 veya kazıma kodu"
                value={productCode}
                onChange={(event) => setProductCode(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void performSearch(productCode);
                }}
                className="w-full px-4 py-3 bg-brand-black text-brand-light-gray border-2 border-brand-medium-gray focus:border-brand-gold focus:outline-none text-sm sm:text-base"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => void performSearch(productCode)}
                disabled={loading}
                className="w-full sm:w-auto btn-primary text-brand-black px-7 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-black" /> Aranıyor...</>
                ) : (
                  <><Search className="w-5 h-5" /> Sorgula</>
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-brand-gold/30 flex items-start gap-2 text-brand-light-gray text-xs sm:text-sm">
            <QrCode className="w-5 h-5 text-brand-gold flex-shrink-0" />
            <span>Sertifika üzerindeki QR kod okutulduğunda doğrulama kodu otomatik sorgulanır.</span>
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-950/40 ring-2 ring-red-500 p-5 mb-7">
            <div className="flex items-start gap-3">
              <XCircle className="w-7 h-7 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="text-red-400 font-semibold text-lg">Kayıt Doğrulanamadı</h2>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {record && searchPerformed && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-dark-gray ring-2 ring-brand-gold overflow-hidden">
            <div className={`${isActive ? 'bg-green-950/50 border-green-500' : 'bg-red-950/50 border-red-500'} border-b-2 p-4 sm:p-5`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                {isActive ? <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" /> : <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />}
                <div>
                  <h2 className={`${isActive ? 'text-green-400' : 'text-red-400'} font-semibold text-lg sm:text-xl`}>
                    {isActive ? 'Sertifika Doğrulandı' : 'Sertifika Geçersiz / İptal Edilmiş'}
                  </h2>
                  <p className={`${isActive ? 'text-green-300' : 'text-red-300'} text-sm mt-1`}>
                    {isActive ? 'Kod, Aktürk Kuyumculuk kayıt sistemiyle eşleşmektedir.' : 'Bu belge güncel sistemde aktif değildir. Mağaza ile iletişime geçiniz.'}
                  </p>
                </div>
                </div>
                {isActive && (
                  <button
                    type="button"
                    onClick={() => void downloadCertificatePdf()}
                    disabled={pdfLoading}
                    className="inline-flex min-h-11 items-center justify-center gap-2 border border-brand-gold bg-brand-black px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-black disabled:cursor-wait disabled:opacity-60"
                  >
                    {pdfLoading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Download aria-hidden="true" className="h-4 w-4" />}
                    {pdfLoading ? 'PDF hazırlanıyor' : 'PDF sertifikayı indir'}
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <div className={`grid ${record.image ? 'md:grid-cols-[280px_1fr]' : ''} gap-6`}>
                {record.image && (
                  <div className="relative h-64 bg-brand-black ring-1 ring-brand-gold overflow-hidden">
                    <Image src={record.image} alt={title} unoptimized fill className="object-cover" />
                  </div>
                )}

                <div>
                  <div className="mb-5">
                    <p className="text-brand-light-gray text-xs uppercase tracking-[0.2em] mb-2">Aktürk Kuyumculuk Ürün Kimliği</p>
                    <h2 className="text-2xl sm:text-3xl text-brand-gold font-serif">{title}</h2>
                  </div>

                  <div className="space-y-5">
                    {[
                      {
                        title: 'Kimlik ve Tarihler',
                        items: [
                          ['Ana Ürün Kodu', record.productCode],
                          ['Sertifika No', record.certificateNumber],
                          ['Kazıma Kodu', engravingCodes.join(' · ') || undefined],
                          ['Ürün / Kategori', record.productType || record.category],
                          ['Üretim Tarihi', productionDate],
                          ['Sertifika Tarihi', record.certificateDate],
                          ['Üretim Parti No', record.batchNumber],
                          ['Fiziksel Ürün Sayısı', record.physicalCount || (parts.length || 1)],
                        ],
                      },
                      {
                        title: 'Teknik Ürün Bilgileri',
                        items: [
                          ['Toplam Net Gram', record.gram ? `${record.gram} gr` : undefined],
                          ['Ayar', record.ayar],
                          ['Altın Rengi', record.goldColor],
                          ['Taş Durumu', record.stoneType],
                          ['Sıra', record.sira],
                          ['Garanti Politikası', record.warrantyPolicyVersion ? `Sürüm ${record.warrantyPolicyVersion}` : undefined],
                        ],
                      },
                    ].map((section) => (
                      <section key={section.title}>
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-light-gray">{section.title}</h3>
                        <div className="grid sm:grid-cols-2 gap-px bg-brand-gold/30 ring-1 ring-brand-gold/30">
                          {section.items.map(([label, value]) => (
                            <div key={String(label)} className="bg-brand-black p-3 sm:p-4">
                              <p className="text-brand-light-gray text-xs mb-1">{label}</p>
                              <p className="text-brand-gold text-sm sm:text-base font-semibold break-words">{displayValue(value)}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </div>

              {parts.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-brand-gold text-xl font-semibold mb-4">Ürün ve Kod Dökümü</h3>
                  <div className="overflow-x-auto ring-1 ring-brand-gold/40">
                    <table className="w-full min-w-[780px] text-sm">
                      <thead className="bg-brand-gold text-brand-black">
                        <tr>
                          <th className="text-left p-3">No</th><th className="text-left p-3">Ürün</th><th className="text-left p-3">Takip Kodu</th><th className="text-left p-3">Kazıma</th><th className="text-left p-3">Gram / Ayar</th><th className="text-left p-3">Renk / Taş</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((part, index) => (
                          <tr key={`${part.code || 'part'}-${index}`} className="border-b border-brand-gold/20 last:border-0">
                            <td className="p-3 text-brand-light-gray">{index + 1}</td>
                            <td className="p-3 text-brand-light-gray">{displayValue(part.type)}{part.sira ? ` • Sıra ${part.sira}` : ''}</td>
                            <td className="p-3 text-brand-gold font-semibold">{displayValue(part.code)}</td>
                            <td className="p-3 text-brand-gold font-semibold">{displayValue(part.markCode)}</td>
                            <td className="p-3 text-brand-light-gray">{displayValue(part.gram)} gr / {displayValue(part.ayar)}</td>
                            <td className="p-3 text-brand-light-gray">{displayValue(part.color)} / {displayValue(part.stone)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(record.warrantyInfo || record.careInstructions) && (
                <div className="grid lg:grid-cols-2 gap-5 mt-7">
                  {record.warrantyInfo && (
                    <section className="bg-brand-black ring-1 ring-brand-gold/40 p-5">
                      <h3 className="text-brand-gold text-lg font-semibold mb-3">Garanti ve Hizmet Kapsamı</h3>
                      <p className="text-brand-light-gray text-sm leading-6 whitespace-pre-line">{record.warrantyInfo}</p>
                    </section>
                  )}
                  {record.careInstructions && (
                    <section className="bg-brand-black ring-1 ring-brand-gold/40 p-5">
                      <h3 className="text-brand-gold text-lg font-semibold mb-3">Bakım ve Kullanım</h3>
                      <p className="text-brand-light-gray text-sm leading-6 whitespace-pre-line">{record.careInstructions}</p>
                    </section>
                  )}
                </div>
              )}

              {record.source === 'catalog' && record.collectionName && (
                <Link href={`/urunler/${record.collectionName}/${record.id}`} className="block mt-6 w-full bg-brand-black text-brand-gold ring-2 ring-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all py-3 text-center font-semibold">
                  Ürün Detayına Git
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {!searchPerformed && !loading && (
          <div className="bg-brand-dark-gray ring-1 ring-brand-gold/50 p-5 sm:p-7 mt-7">
            <h3 className="text-brand-gold font-semibold text-lg mb-3">Güvenli Doğrulama</h3>
            <p className="text-brand-light-gray text-sm leading-6">
              Bu sayfada yalnızca ürüne ve sertifikaya ait teknik bilgiler gösterilir. Müşteri adı, iletişim, ödeme ve satış tutarı bilgileri internete aktarılmaz.
            </p>
          </div>
        )}

        {record && qrDataUrl && (
          <div
            ref={pdfTemplateRef}
            data-testid="certificate-pdf-template"
            aria-hidden="true"
            className="fixed left-[-10000px] top-0 w-[794px] bg-white p-7 text-[#152825]"
          >
            <div className="border-[3px] border-[#a98542] p-8">
              <header className="flex items-start justify-between gap-8 border-b border-[#d8c8aa] pb-6">
                <div>
                  <p className="font-serif text-[30px] tracking-[0.16em] text-[#9a7434]">AKTÜRK</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.38em] text-[#47605c]">Kuyumculuk · Trabzon</p>
                  <h2 className="mt-6 font-serif text-[25px] leading-tight text-[#12302d]">Ürün Kimlik ve Garanti Belgesi</h2>
                  <p className="mt-2 text-[10px] leading-4 text-[#47605c]">Bu belge, Aktürk Kuyumculuk kayıt sistemindeki doğrulanmış teknik ürün bilgilerini içerir.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  {qrDataUrl ? (
                    <Image src={qrDataUrl} alt="Sertifika doğrulama QR kodu" width={112} height={112} unoptimized />
                  ) : (
                    <div className="h-28 w-28 border border-[#e1d4bd] bg-[#f7f3ea]" />
                  )}
                  <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#47605c]">Çevrimiçi doğrula</p>
                </div>
              </header>

              <section className={`py-6 ${record.image ? 'grid grid-cols-[150px_1fr] items-center gap-7 text-left' : 'text-center'}`}>
                {record.image && (
                  <div className="relative h-[150px] overflow-hidden border border-[#e1d4bd] bg-[#f7f3ea]">
                    <Image src={record.image} alt="Sertifikalı ürün görseli" fill unoptimized className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9a7434]">Sertifikalı ürün</p>
                  <h3 className="mt-2 max-w-[620px] font-serif text-[23px] leading-tight text-[#12302d]">{title}</h3>
                  <p className={`mt-3 inline-block border px-4 py-1 text-[9px] font-bold uppercase tracking-[0.16em] ${isActive ? 'border-[#2f7d5a] text-[#2f7d5a]' : 'border-red-700 text-red-700'}`}>
                    {isActive ? 'Kayıt doğrulandı' : 'Kayıt geçersiz / iptal edilmiş'}
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-px border border-[#e1d4bd] bg-[#e1d4bd]">
                {[
                  ['Ana Ürün Kodu', record.productCode],
                  ['Sertifika No', record.certificateNumber],
                  ['Kazıma Kodu', engravingCodes.join(' · ') || undefined],
                  ['Ürün / Kategori', record.productType || record.category],
                  ['Üretim Tarihi', productionDate],
                  ['Sertifika Tarihi', record.certificateDate],
                  ['Üretim Parti No', record.batchNumber],
                  ['Fiziksel Ürün Sayısı', record.physicalCount || (parts.length || 1)],
                  ['Toplam Net Gram', record.gram ? `${record.gram} gr` : undefined],
                  ['Ayar', record.ayar],
                  ['Altın Rengi', record.goldColor],
                  ['Taş Durumu / Sıra', `${displayValue(record.stoneType)}${record.sira ? ` · Sıra ${record.sira}` : ''}`],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-white px-4 py-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#6f7f7c]">{label}</p>
                    <p className="mt-1 text-[11px] font-semibold text-[#12302d]">{displayValue(value)}</p>
                  </div>
                ))}
              </section>

              {parts.length > 0 && (
                <section data-pdf-break-before className="mt-6">
                  <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7434]">Ürün ve Kod Dökümü</h4>
                  <table className="w-full border-collapse text-left text-[9px]">
                    <thead><tr className="bg-[#12302d] text-white"><th className="p-2">No</th><th className="p-2">Ürün</th><th className="p-2">Takip / Kazıma</th><th className="p-2">Gram / Ayar</th><th className="p-2">Renk / Taş</th></tr></thead>
                    <tbody>
                      {parts.map((part, index) => (
                        <tr key={`${part.code || 'pdf-part'}-${index}`} data-pdf-break-after className="border-b border-[#e8decb]">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{displayValue(part.type)}{part.sira ? ` · Sıra ${part.sira}` : ''}</td>
                          <td className="p-2 font-semibold">{displayValue(part.code)}<br />{displayValue(part.markCode)}</td>
                          <td className="p-2">{displayValue(part.gram)} gr / {displayValue(part.ayar)}</td>
                          <td className="p-2">{displayValue(part.color)} / {displayValue(part.stone)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {(record.warrantyInfo || record.careInstructions) && (
                <section data-pdf-break-before className="mt-6 grid grid-cols-2 gap-5 border-t border-[#e1d4bd] pt-5">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7434]">Garanti ve Hizmet</h4>
                    <p className="mt-2 whitespace-pre-line text-[8px] leading-[1.55] text-[#354b48]">{record.warrantyInfo || '—'}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7434]">Bakım ve Kullanım</h4>
                    <p className="mt-2 whitespace-pre-line text-[8px] leading-[1.55] text-[#354b48]">{record.careInstructions || '—'}</p>
                  </div>
                </section>
              )}

              <footer className="mt-6 flex items-end justify-between border-t border-[#e1d4bd] pt-4 text-[8px] text-[#6f7f7c]">
                <p>Belge kodu: <strong className="text-[#12302d]">{displayValue(record.certificateNumber)}</strong></p>
                <p className="text-right">Müşteri, iletişim, ödeme ve satış tutarı bilgileri bu çevrimiçi kopyada yer almaz.</p>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
