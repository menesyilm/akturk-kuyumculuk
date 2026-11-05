'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, QrCode, Search, ShieldCheck, XCircle } from 'lucide-react';
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

function displayValue(value?: string | number) {
  return value === undefined || value === null || value === '' ? '—' : String(value);
}

export default function SertifikaPage() {
  const [productCode, setProductCode] = useState('');
  const [record, setRecord] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const performSearch = useCallback(async (rawCode: string) => {
    const normalizedCode = rawCode.trim().toUpperCase();
    if (!normalizedCode) {
      setError('Lütfen ürün, sertifika, takip veya kazıma kodunu giriniz.');
      return;
    }

    setLoading(true);
    setError('');
    setRecord(null);
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
  const title = record?.productName || record?.name || record?.productType || 'Sertifikalı Ürün';

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

                  <div className="grid sm:grid-cols-2 gap-px bg-brand-gold/30 ring-1 ring-brand-gold/30">
                    {[
                      ['Ana Ürün Kodu', record.productCode],
                      ['Sertifika No', record.certificateNumber],
                      ['Sertifika Tarihi', record.certificateDate],
                      ['Ürün / Kategori', record.productType || record.category],
                      ['Fiziksel Ürün Sayısı', record.physicalCount || (parts.length || 1)],
                      ['Toplam Net Gram', record.gram ? `${record.gram} gr` : undefined],
                      ['Ayar', record.ayar],
                      ['Altın Rengi', record.goldColor],
                      ['Taş Durumu', record.stoneType],
                      ['Sıra', record.sira],
                      ['Üretim Parti No', record.batchNumber],
                      ['Garanti Politikası', record.warrantyPolicyVersion ? `Sürüm ${record.warrantyPolicyVersion}` : undefined],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="bg-brand-black p-3 sm:p-4">
                        <p className="text-brand-light-gray text-xs mb-1">{label}</p>
                        <p className="text-brand-gold text-sm sm:text-base font-semibold break-words">{displayValue(value)}</p>
                      </div>
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
      </div>
    </div>
  );
}
