'use client'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion';

type SortOption = 'recommended' | 'name-asc' | 'name-desc';

interface Product {
  id: string
  name: string
  price: number
  image: string
  image2?: string
  description?: string
  category: string
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('recommended')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'set'))
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]
        setProducts(productsData)
        setSortedProducts(productsData)
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let sorted = [...products];
    
    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
        break;
      case 'recommended':
      default:
        sorted = products;
        break;
    }
    
    setSortedProducts(sorted);
  }, [sortBy, products]);

  if (loading) {
    return (
      <div className="min-h-[calc(125vh-5rem)] sm:min-h-[calc(125vh-6rem)] lg:min-h-[calc(125vh-7.5rem)] bg-brand-black flex items-center justify-center">
        <div className="text-brand-gold text-base sm:text-lg lg:text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(125vh-5rem)] sm:min-h-[calc(125vh-6rem)] lg:min-h-[calc(125vh-7.5rem)] bg-brand-black">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 pt-5 pt-10 lg:pt-15 pb-8 sm:pb-12 lg:pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          className="text-xl sm:text-xl lg:text-3xl xl:text-4xl font-bold text-brand-gold text-center mb-6 sm:mb-8"
        >SET
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-end mb-4 sm:mb-6 lg:mb-8"
        >          
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-brand-light-gray text-xs sm:text-sm lg:text-base">Sırala:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-brand-dark-gray text-brand-light-gray border border-brand-gold px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm lg:text-base focus:outline-none"
            >
              <option value="recommended">Önerilen</option>
              <option value="name-asc">İsme Göre (A-Z)</option>
              <option value="name-desc">İsme Göre (Z-A)</option>
            </select>
          </div>
        </motion.div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-brand-light-gray text-sm sm:text-base lg:text-lg">Henüz ürün bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, margin: "100px" }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              >
              <Link 
                key={product.id}
                href={`/urunler/set/${product.id}`}
                className="block bg-brand-dark-gray overflow-hidden ring-1 ring-brand-gold cursor-pointer group transition-shadow duration-300 hover:shadow-lg hover:shadow-brand-light-gray/50"
              >
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
                              <div className="p-2 sm:p-3 lg:p-4 flex flex-col">
                {/* Başlık - Sabit yükseklik */}
                <div className="h-10 sm:h-11 lg:h-12 mb-1 sm:mb-2">
                  <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-brand-gold text-center line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                {/* Açıklama - Sabit yükseklik */}
                <div className="h-8 sm:h-9 lg:h-10">
                  {product.description && (
                    <p className="text-[10px] sm:text-xs lg:text-sm text-brand-light-gray line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
              </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
