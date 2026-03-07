'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, QrCode, ShieldCheck } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  collectionName: string;
  productCode?: string;
  gram?: string;
  ayar?: string;
  certificateUrl?: string;
  certificateDate?: string;
}

export default function SertifikaPage() {
  const [productCode, setProductCode] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchProduct = async () => {
    if (!productCode.trim()) {
      setError('Lütfen bir ürün kodu giriniz');
      return;
    }

    setLoading(true);
    setError('');
    setProduct(null);
    setSearchPerformed(false);

    try {
      const categories = ['bileklik', 'kolye', 'yuzukvekupe', 'set'];
      let foundProduct: Product | null = null;

      for (const category of categories) {
        const q = query(
          collection(db, category),
          where('productCode', '==', productCode.trim().toUpperCase())
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          foundProduct = {
            id: doc.id,
            collectionName: category,
            category: category,
            ...doc.data(),
          } as Product;
          break;
        }
      }

      setSearchPerformed(true);

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Bu ürün kodu ile kayıtlı bir ürün bulunamadı');
      }
    } catch (err) {
      console.error('Arama hatası:', err);
      setError('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchProduct();
    }
  };

  return (
    <div className="min-h-screen lg:min-h-[calc(125vh-7.5rem)] bg-brand-black pt-5 sm:pt-10 lg:pt-15 pb-8 sm:pb-12 lg:pb-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="flex justify-center mb-3 sm:mb-4">
            <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-brand-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mb-2 sm:mb-3 lg:mb-4 font-serif text-brand-gold">
            Sertifika Doğrulama
          </h1>
          <p className="text-brand-light-gray text-xs sm:text-sm lg:text-base xl:text-lg">
            Ürün kodunuzu girerek sertifika bilgilerini görüntüleyebilirsiniz
          </p>
        </motion.div>

        {/* Arama Kutusu */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-brand-dark-gray ring-2 ring-brand-gold p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label htmlFor="productCode" className="block text-brand-light-gray text-xs sm:text-sm lg:text-base mb-2">
                Ürün Kodu
              </label>
              <input
                id="productCode"
                type="text"
                placeholder="Örn: AK-12345"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm lg:text-base bg-brand-black text-brand-light-gray border-2 border-brand-medium-gray focus:border-brand-gold focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={searchProduct}
                disabled={loading}
                className="w-full sm:w-auto btn-primary text-brand-black px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-xs sm:text-sm lg:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-brand-black"></div>
                    <span>Aranıyor...</span>
                  </>
                ) : (
                  <>
                  <div className='flex items-center text-center justify-center gap-2'>
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Sorgula</span>
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Kod Bilgisi */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-brand-gold/30">
            <div className="flex items-center gap-2 text-brand-light-gray text-xs sm:text-sm">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
              <span>QR kod okutma özelliği yakında eklenecektir</span>
            </div>
          </div>
        </motion.div>

        {/* Hata Mesajı */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 ring-2 ring-red-500 p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-red-500 font-semibold text-sm sm:text-base lg:text-lg mb-1">Ürün Bulunamadı</h3>
                <p className="text-red-400 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ürün Bulundu */}
        {product && searchPerformed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-brand-dark-gray ring-2 ring-brand-gold overflow-hidden"
          >
            {/* Başarı Banner */}
            <div className="bg-green-900/20 border-b-2 border-green-500 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                <div>
                  <h3 className="text-green-500 font-semibold text-sm sm:text-base lg:text-lg">Sertifika Doğrulandı</h3>
                  <p className="text-green-400 text-xs sm:text-sm">Bu ürün kayıtlı ve sertifikalıdır</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
              {/* Ürün Görseli */}
              <div className="relative h-48 sm:h-64 md:h-80 bg-brand-black ring-1 ring-brand-gold overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Ürün Bilgileri */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-brand-gold mb-1 sm:mb-2">{product.name}</h2>
                  <p className="text-brand-light-gray uppercase text-xs sm:text-sm">{product.category}</p>
                </div>

                <div className="border-t border-brand-gold/30 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm lg:text-base">
                    <span className="text-brand-light-gray">Ürün Kodu:</span>
                    <span className="text-brand-gold font-semibold">{product.productCode}</span>
                  </div>

                  {product.gram && (
                    <div className="flex justify-between text-xs sm:text-sm lg:text-base">
                      <span className="text-brand-light-gray">Gram:</span>
                      <span className="text-brand-gold">{product.gram}GR</span>
                    </div>
                  )}

                  {product.ayar && (
                    <div className="flex justify-between text-xs sm:text-sm lg:text-base">
                      <span className="text-brand-light-gray">Ayar:</span>
                      <span className="text-brand-gold">{product.ayar}</span>
                    </div>
                  )}

                  {product.certificateDate && (
                    <div className="flex justify-between text-xs sm:text-sm lg:text-base">
                      <span className="text-brand-light-gray">Sertifika Tarihi:</span>
                      <span className="text-brand-gold">{product.certificateDate}</span>
                    </div>
                  )}
                </div>

                {/* Sertifika Belgesi Linki */}
                {product.certificateUrl && (
                  <div className="pt-3 sm:pt-4">
                    <a
                      href={product.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full btn-primary text-brand-black py-2 sm:py-3 text-center text-xs sm:text-sm lg:text-base"
                    >
                      Sertifika Belgesini Görüntüle
                    </a>
                  </div>
                )}

                {/* Ürün Detayına Git */}
                <Link
                  href={`/urunler/${product.collectionName}/${product.id}`}
                  className="block w-full bg-brand-black text-brand-gold ring-2 ring-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all py-2 sm:py-3 text-center font-semibold text-xs sm:text-sm lg:text-base"
                >
                  Ürün Detayına Git
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bilgilendirme */}
        {!searchPerformed && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-brand-dark-gray ring-1 ring-brand-gold/50 p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8"
          >
            <h3 className="text-brand-gold font-semibold text-base sm:text-lg lg:text-xl mb-3 sm:mb-4">Sertifika Sistemi Hakkında</h3>
            <ul className="space-y-2 text-brand-light-gray text-xs sm:text-sm lg:text-base">
              <li className="flex items-start gap-2">
                <span className="text-brand-gold mt-1">•</span>
                <span>Her ürünümüzün benzersiz bir ürün kodu bulunmaktadır</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-gold mt-1">•</span>
                <span>Ürün kodunu kullanarak sertifika doğrulaması yapabilirsiniz</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-gold mt-1">•</span>
                <span>Tüm ürünlerimiz kalite garantisi altındadır</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-gold mt-1">•</span>
                <span>Sertifika belgelerinizi dijital olarak görüntüleyebilirsiniz</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
