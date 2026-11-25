'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, LoaderCircle, QrCode, Search, ShieldCheck, XCircle } from 'lucide-react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseDb';
import type { CertificatePart } from '@/lib/certificatePdf';
import Image from 'next/image';
import Link from 'next/link';

const CERTIFICATE_VERIFICATION_ORIGIN = 'https://www.akturkkuyumculuk.com';
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

export function buildVerificationUrl(code: string) {
  return `${CERTIFICATE_VERIFICATION_ORIGIN}/sertifika?code=${encodeURIComponent(code)}`;
}

export default function SertifikaPage() {
  const [productCode, setProductCode] = useState('');
  const [record, setRecord] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const searchRequestIdRef = useRef(0);

  const performSearch = useCallback(async (rawCode: string) => {
    const normalizedCode = rawCode.trim().toUpperCase();
    if (!normalizedCode) {
      setError('Lütfen ürün, sertifika, takip veya kazıma kodunu giriniz.');
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    setLoading(true);
    setError('');
    setRecord(null);
    setPdfError('');
    setSearchPerformed(false);

    try {
      const certificateQuery = query(
        collection(db, 'sertifikalar'),
        where('lookupCodes', 'array-contains', normalizedCode),
        limit(1)
      );
      const certificateSnapshot = await getDocs(certificateQuery);
      if (requestId !== searchRequestIdRef.current) return;

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
      const catalogSnapshots = await Promise.all(categories.map(async (category) => {
        const catalogQuery = query(
          collection(db, category),
          where('productCode', '==', normalizedCode),
          limit(1)
        );
        const catalogSnapshot = await getDocs(catalogQuery);
        return { category, catalogSnapshot };
      }));
      if (requestId !== searchRequestIdRef.current) return;

      const catalogMatch = catalogSnapshots.find(({ catalogSnapshot }) => !catalogSnapshot.empty);
      if (catalogMatch) {
        const catalogDocument = catalogMatch.catalogSnapshot.docs[0];
        setRecord({
          id: catalogDocument.id,
          source: 'catalog',
          collectionName: catalogMatch.category,
          category: catalogMatch.category,
          ...catalogDocument.data(),
        } as CertificateRecord);
        setSearchPerformed(true);
        return;
      }

      setSearchPerformed(true);
      setError('Bu kodla eşleşen aktif bir ürün veya sertifika kaydı bulunamadı.');
    } catch (searchError) {
      if (requestId !== searchRequestIdRef.current) return;
      console.error('Sertifika arama hatası:', searchError);
      setSearchPerformed(true);
      setError('Doğrulama sistemine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz.');
    } finally {
      if (requestId === searchRequestIdRef.current) setLoading(false);
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

  const isCertificateRecord = record?.source === 'certificate';
  const isCatalogRecord = record?.source === 'catalog';
  const isActive = isCertificateRecord && record?.certificateStatus?.toLowerCase() === 'active';
  const parts = record?.parts || [];
  const engravingCodes = parseStringArray(record?.engravingCodesJson);
  const title = record?.productName || record?.name || record?.productType || 'Sertifikalı Ürün';
  const productionDate = record?.productionDate || inferProductionDate(record?.productCode);

  const handlePdfDownload = async () => {
    if (!record || !isActive || pdfLoading) return;
    setPdfLoading(true);
    setPdfError('');
    const requestId = searchRequestIdRef.current;

    try {
      const verificationCode = record.productCode || record.certificateNumber || productCode;
      const { downloadCertificatePdf } = await import('@/lib/certificatePdf');
      await downloadCertificatePdf({
        title,
        verificationCode,
        verificationUrl: buildVerificationUrl(verificationCode),
        productCode: record.productCode,
        certificateNumber: record.certificateNumber,
        productionDate,
        certificateDate: record.certificateDate,
        batchNumber: record.batchNumber,
        productType: record.productType || record.category,
        gram: record.gram,
        ayar: record.ayar,
        goldColor: record.goldColor,
        stoneType: record.stoneType,
        sira: record.sira,
        physicalCount: record.physicalCount || parts.length || 1,
        warrantyPolicyVersion: record.warrantyPolicyVersion,
        warrantyInfo: record.warrantyInfo,
        careInstructions: record.careInstructions,
        engravingCodes,
        parts,
        image: record.image,
      });
    } catch (pdfError) {
      console.error('PDF oluşturma hatası:', pdfError);
      if (requestId === searchRequestIdRef.current) {
        setPdfError('PDF belgesi oluşturulamadı. Lütfen tekrar deneyiniz.');
      }
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] pb-20 pt-14 text-[#10211e] sm:pb-28 sm:pt-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-9 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <div className="mb-6 grid h-12 w-12 place-items-center border border-[#9b8050]/45 text-[#8b6d39]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="mb-4 text-[0.64rem] font-bold uppercase tracking-[0.3em] text-[#876d3e]">Ürün Kimliği</p>
          <h1 className="mb-5 max-w-3xl font-serif text-5xl leading-none tracking-[-0.04em] text-[#10211e] sm:text-6xl lg:text-7xl">
            Sertifika Doğrulama
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[#10211e]/58 sm:text-base sm:leading-8">
            Ürün, sertifika, takip veya ürün üzerindeki kazıma koduyla sorgulama yapabilirsiniz.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-7 border border-[#9b8050]/30 bg-white p-5 sm:p-7 lg:p-9"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label htmlFor="productCode" className="mb-2 block text-[0.64rem] font-bold uppercase tracking-[0.17em] text-[#10211e]/52">Doğrulama Kodu</label>
              <input
                id="productCode"
                type="text"
                autoComplete="off"
                placeholder="Örn: BLK-261104-001 veya kazıma kodu"
                value={productCode}
                onChange={(event) => setProductCode(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !loading) void performSearch(productCode);
                }}
                aria-busy={loading}
                className="w-full border border-[#9b8050]/35 bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#10211e] outline-none transition-colors placeholder:text-[#10211e]/32 focus:border-[#8b6d39] sm:text-base"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => void performSearch(productCode)}
                disabled={loading}
                className="flex min-h-13 w-full items-center justify-center gap-2 bg-[#0a1714] px-8 py-3 text-[0.67rem] font-bold uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#8b6d39] disabled:opacity-50 sm:w-auto"
              >
                {loading ? (
                  <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-black" /> Aranıyor...</>
                ) : (
                  <><Search className="w-5 h-5" /> Sorgula</>
                )}
              </button>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-3 border-t border-[#9b8050]/24 pt-5 text-xs leading-6 text-[#10211e]/50 sm:text-sm">
            <QrCode className="h-5 w-5 flex-shrink-0 text-[#8b6d39]" />
            <span>Sertifika üzerindeki QR kod okutulduğunda doğrulama kodu otomatik sorgulanır.</span>
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-7 border border-red-300 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <XCircle className="w-7 h-7 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-red-800">Kayıt Doğrulanamadı</h2>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {record && searchPerformed && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden border border-[#9b8050]/30 bg-white">
            <div className={`${isActive ? 'border-[#5b8c70] bg-[#e8f1eb]' : isCatalogRecord ? 'border-[#b48635] bg-[#fbf5e8]' : 'border-red-400 bg-red-50'} border-b p-4 sm:p-5`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                {isActive ? (
                  <CheckCircle className="h-8 w-8 flex-shrink-0 text-green-600" />
                ) : isCatalogRecord ? (
                  <ShieldCheck className="h-8 w-8 flex-shrink-0 text-[#9a7434]" />
                ) : (
                  <XCircle className="h-8 w-8 flex-shrink-0 text-red-500" />
                )}
                <div>
                  <h2 className={`${isActive ? 'text-[#2f6b4b]' : isCatalogRecord ? 'text-[#765a2d]' : 'text-red-800'} text-lg font-semibold sm:text-xl`}>
                    {isActive ? 'Sertifika Doğrulandı' : isCatalogRecord ? 'Ürün Katalogda Bulundu' : 'Sertifika Geçersiz / İptal Edilmiş'}
                  </h2>
                  <p className={`${isActive ? 'text-[#416c55]' : isCatalogRecord ? 'text-[#765a2d]' : 'text-red-700'} mt-1 text-sm`}>
                    {isActive
                      ? 'Kod, Aktürk Kuyumculuk sertifika kayıt sistemiyle eşleşmektedir.'
                      : isCatalogRecord
                        ? 'Ürün kaydı bulundu; ancak bu kodla eşleşen aktif bir sertifika bulunmadı.'
                        : 'Bu belge güncel sistemde aktif değildir. Mağaza ile iletişime geçiniz.'}
                  </p>
                </div>
                </div>
                {isActive && (
                  <button
                    type="button"
                    onClick={() => void handlePdfDownload()}
                    disabled={pdfLoading}
                    className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#0a1714] bg-[#0a1714] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#8b6d39] disabled:cursor-wait disabled:opacity-60"
                  >
                    {pdfLoading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Download aria-hidden="true" className="h-4 w-4" />}
                    {pdfLoading ? 'PDF hazırlanıyor' : 'PDF sertifikayı indir'}
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {pdfError && <p role="alert" className="mb-5 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{pdfError}</p>}
              <div className={`grid ${record.image ? 'md:grid-cols-[280px_1fr]' : ''} gap-6`}>
                {record.image && (
                  <div className="relative h-64 overflow-hidden border border-[#9b8050]/30 bg-[#ded5c8]">
                    <Image src={record.image} alt={title} unoptimized fill className="object-cover" />
                  </div>
                )}

                <div>
                  <div className="mb-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#876d3e]">Aktürk Kuyumculuk Ürün Kimliği</p>
                    <h2 className="font-serif text-2xl text-[#10211e] sm:text-3xl">{title}</h2>
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
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#10211e]/48">{section.title}</h3>
                        <div className="grid gap-px border border-[#9b8050]/24 bg-[#d8cdbb] sm:grid-cols-2">
                          {section.items.map(([label, value]) => (
                            <div key={String(label)} className="bg-[#fbfaf7] p-3 sm:p-4">
                              <p className="mb-1 text-xs text-[#10211e]/45">{label}</p>
                              <p className="break-words text-sm font-semibold text-[#10211e] sm:text-base">{displayValue(value)}</p>
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
                  <h3 className="mb-4 font-serif text-2xl text-[#10211e]">Ürün ve Kod Dökümü</h3>
                  <div className="overflow-x-auto border border-[#9b8050]/30">
                    <table className="w-full min-w-[900px] text-sm">
                      <thead className="bg-[#0a1714] text-white">
                        <tr>
                          <th className="p-3 text-left">No</th><th className="p-3 text-left">Ürün</th><th className="p-3 text-left">Takip Kodu</th><th className="p-3 text-left">Kazıma</th><th className="p-3 text-left">Gram / Ayar</th><th className="p-3 text-left">Renk / Taş</th><th className="p-3 text-left">Parti No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((part, index) => (
                          <tr key={`${part.code || 'part'}-${index}`} className="border-b border-[#9b8050]/20 last:border-0">
                            <td className="p-3 text-[#10211e]/60">{index + 1}</td>
                            <td className="p-3 text-[#10211e]/70">{displayValue(part.type)}{part.sira ? ` • Sıra ${part.sira}` : ''}</td>
                            <td className="p-3 font-semibold text-[#765a2d]">{displayValue(part.code)}</td>
                            <td className="p-3 font-semibold text-[#765a2d]">{displayValue(part.markCode)}</td>
                            <td className="p-3 text-[#10211e]/70">{displayValue(part.gram)} gr / {displayValue(part.ayar)}</td>
                            <td className="p-3 text-[#10211e]/70">{displayValue(part.color)} / {displayValue(part.stone)}</td>
                            <td className="p-3 text-[#10211e]/70">{displayValue(part.batchNumber)}</td>
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
                    <section className="border border-[#9b8050]/25 bg-[#f7f3eb] p-5">
                      <h3 className="mb-3 font-serif text-xl text-[#10211e]">Garanti ve Hizmet Kapsamı</h3>
                      <p className="whitespace-pre-line text-sm leading-6 text-[#10211e]/62">{record.warrantyInfo}</p>
                    </section>
                  )}
                  {record.careInstructions && (
                    <section className="border border-[#9b8050]/25 bg-[#f7f3eb] p-5">
                      <h3 className="mb-3 font-serif text-xl text-[#10211e]">Bakım ve Kullanım</h3>
                      <p className="whitespace-pre-line text-sm leading-6 text-[#10211e]/62">{record.careInstructions}</p>
                    </section>
                  )}
                </div>
              )}

              {record.source === 'catalog' && record.collectionName && (
                <Link href={`/urunler/${record.collectionName}/${record.id}`} className="mt-6 block w-full bg-[#0a1714] py-3 text-center text-[0.67rem] font-bold uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#8b6d39]">
                  Ürün Detayına Git
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {!searchPerformed && !loading && (
          <div className="mt-7 border border-[#9b8050]/25 bg-[#eee7dc] p-5 sm:p-7">
            <h3 className="mb-3 font-serif text-2xl text-[#10211e]">Güvenli Doğrulama</h3>
            <p className="text-sm leading-7 text-[#10211e]/58">
              Bu sayfada yalnızca ürüne ve sertifikaya ait teknik bilgiler gösterilir. Müşteri adı, iletişim, ödeme ve satış tutarı bilgileri internete aktarılmaz.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
