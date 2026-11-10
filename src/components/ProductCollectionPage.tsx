'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowUpRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import ImageWithLoader from '@/components/ImageWithLoader';

type SortOption = 'recommended' | 'name-asc' | 'name-desc';

interface Product {
  id: string;
  name: string;
  image: string;
  image2?: string;
  description?: string;
}

interface ProductCollectionPageProps {
  collectionName: 'bileklik' | 'kolye' | 'set' | 'yuzukvekupe';
  title: string;
  description: string;
}

export default function ProductCollectionPage({ collectionName, title, description }: ProductCollectionPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        setProducts(querySnapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Product[]);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionName]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === 'name-asc') return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    if (sortBy === 'name-desc') return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
    return sorted;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#10211e]">
      <header className="border-b border-[#9b8050]/25 px-5 py-16 sm:px-9 sm:py-20 lg:px-14 lg:py-28">
        <div className="mx-auto max-w-[96rem]">
          <p className="text-[0.64rem] font-bold uppercase tracking-[0.3em] text-[#876d3e]">Aktürk Koleksiyonları</p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <h1 className="font-serif text-[3.7rem] leading-none tracking-[-0.04em] sm:text-7xl lg:text-[6.4rem]">{title}</h1>
            <p className="max-w-xl text-sm leading-7 text-[#10211e]/58 sm:text-base sm:leading-8 lg:justify-self-end">{description}</p>
          </div>
        </div>
      </header>

      <section className="px-5 pb-24 pt-8 sm:px-9 sm:pb-32 lg:px-14 lg:pb-40">
        <div className="mx-auto max-w-[96rem]">
          <div className="mb-10 flex items-center justify-between border-b border-[#9b8050]/25 pb-5 sm:mb-14">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#10211e]/46">
              {loading ? 'Koleksiyon yükleniyor' : `${sortedProducts.length} ürün`}
            </p>
            <label className="flex items-center gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#10211e]/48">
              Sırala
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="border-0 border-b border-[#8c6f3a]/50 bg-transparent py-2 pl-1 pr-7 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#10211e] outline-none"
              >
                <option value="recommended">Önerilen</option>
                <option value="name-asc">İsim A—Z</option>
                <option value="name-desc">İsim Z—A</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#ded6c9]" />
                  <div className="mt-5 h-4 w-2/3 bg-[#ded6c9]" />
                  <div className="mt-3 h-3 w-1/2 bg-[#e7e0d6]" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="border-y border-[#9b8050]/25 py-24 text-center">
              <p className="font-serif text-3xl">Bu koleksiyona yakında yeni parçalar eklenecek.</p>
              <Link href="/iletisim" className="mt-7 inline-flex items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#765a2d]">
                Bilgi Alın <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16">
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: Math.min(index % 4, 3) * 0.05 }}
                >
                  <Link href={`/urunler/${collectionName}/${product.id}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#ded5c8]">
                      <ImageWithLoader
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                        unoptimized
                        className="object-cover transition-all duration-[900ms] ease-out group-hover:scale-[1.025] group-hover:opacity-0"
                      />
                      {product.image2 && (
                        <ImageWithLoader
                          src={product.image2}
                          alt={`${product.name} ikinci görünüm`}
                          fill
                          sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                          unoptimized
                          loaderClassName="opacity-0 group-hover:opacity-100"
                          className="object-cover opacity-0 transition-all duration-[900ms] ease-out group-hover:scale-[1.025] group-hover:opacity-100"
                        />
                      )}
                      <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-[#f4f0e8]/92 text-[#10211e] opacity-0 transition-opacity group-hover:opacity-100 sm:right-4 sm:top-4">
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="border-b border-[#9b8050]/24 pb-5 pt-4">
                      <h2 className="font-serif text-lg leading-tight sm:text-2xl">{product.name}</h2>
                      {product.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#10211e]/48 sm:text-sm sm:leading-6">{product.description}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
