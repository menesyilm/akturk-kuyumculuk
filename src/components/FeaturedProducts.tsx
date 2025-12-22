'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  image: string;
  image2?: string;
  category: string;
  collectionName: string;
  description?: string;
}

// Kategori koleksiyonları (module scope - stable reference)
const CATEGORY_COLLECTIONS = [
  { name: 'yuzukvekupe', label: 'Yüzük ve Küpe' },
  { name: 'bileklik', label: 'Bileklik' },
  { name: 'kolye', label: 'Kolye' },
  { name: 'set', label: 'Set' },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const allProducts: Product[] = [];

        for (const col of CATEGORY_COLLECTIONS) {
          const querySnapshot = await getDocs(collection(db, col.name));
          querySnapshot.forEach((doc) => {
            allProducts.push({
              id: doc.id,
              collectionName: col.name,
              category: col.label,
              ...doc.data(),
            } as Product);
          });
        }

        const shuffled = allProducts.sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      } catch (err) {
        console.error('Ürünler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="py-8 sm:py-12 lg:py-16 bg-brand-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xs lg:text-3xl xl:text-4xl font-serif text-brand-light-gray">
              ALTINDA USTALIK, TASARIMDA KARAKTER
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-brand-black  shadow-sm whileInView-pulse">
                <div className="aspect-square bg-brand-medium-gray"></div>
                <div className="p-2 sm:p-3 lg:p-4 space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-brand-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif text-brand-light-gray mb-2">
            ALTINDA USTALIK, TASARIMDA KARAKTER
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "auto" }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-brand-gold mx-auto"
          ></motion.div>
        </motion.div>

        {/* Ürün Kartları Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: false,  margin: "100px" }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <Link
                href={`/urunler/${product.collectionName}/${product.id}`}
                className="block group bg-brand-dark-gray overflow-hidden ring-1 ring-brand-gold cursor-pointer transition-shadow duration-300 hover:shadow-lg hover:shadow-brand-light-gray/50"
              >
              {/* Ürün Görseli */}
                <div className="relative h-40 sm:h-60 lg:h-80 xl:h-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {product.image2 && (
                    <Image
                      src={product.image2}
                      alt={`${product.name} - 2`}
                      fill
                      className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  )}
                </div>

              {/* Ürün Bilgileri */}
              <div className="p-2 sm:p-3 lg:p-4 flex flex-col">
                {/* Başlık - Sabit yükseklik */}
                <div className="h-10 sm:h-11 lg:h-12 mb-1 sm:mb-2">
                  <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-brand-light-gray line-clamp-2 group-hover:text-brand-gold transition-colors">
                    {product.name}
                  </h3>
                </div>

                {/* Açıklama - Sabit yükseklik */}
                <div className="h-8 sm:h-9 lg:h-10">
                  {product.description && (
                    <p className="text-[10px] sm:text-xs lg:text-sm text-brand-medium-gray line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
