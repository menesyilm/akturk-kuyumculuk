'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  description: string
  price: string
  image: string
  image2?: string
  category: string
  createdAt?: Timestamp
  // Tablo alanları
  renk?: string
  gram?: string
  ayar?: string
  sira?: string
  productCode?: string
}


export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState('')

  const openLightbox = (image: string) => {
    setLightboxImage(image)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'yuzukvekupe', params.id as string))
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() } as Product
          setProduct(productData)
        } else {
          router.push('/urunler/yuzukvekupe')
        }
      } catch {
        router.push('/urunler/yuzukvekupe')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen lg:min-h-[calc(125vh-7.5rem)] bg-brand-black flex items-center justify-center">
        <div className="text-brand-gold text-base sm:text-lg lg:text-xl xl:text-2xl ">Yükleniyor...</div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const images = [product.image, product.image2].filter(Boolean) as string[]

  return (
    <div className="bg-brand-black pt-5 md:pt-10 lg:pt-15 pb-8 sm:pb-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "100px" }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className={`grid ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 sm:gap-4`}>
              {images.map((image, index) => (
                <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "100px" }}
                    transition={{ duration: 0.5 }}
                    onClick={() => openLightbox(image)}
                    className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-brand-dark-gray ring-1 ring-brand-gold overflow-hidden group cursor-zoom-in"
                  >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Ürün Bilgileri */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "100px" }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-brand-gold mb-2 sm:mb-3">
                {product.name}
              </h1>
              {product.productCode && (
                <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-dark-gray ring-1 ring-brand-gold">
                  <span className="text-brand-light-gray text-xs sm:text-sm lg:text-md xl:text-lg">Ürün Kodu: </span>
                  <span className="text-brand-gold font-semibold text-xs sm:text-sm lg:text-md xl:text-lg">{product.productCode}</span>
                </div>
              )}
            </div>

            {/* Ürün Bilgileri Tablosu */}
            <div className="border-t border-brand-gold/30 pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-brand-gold mb-2 sm:mb-3">Ürün Bilgileri</h2>
              <div className="bg-brand-dark-gray ring-1 ring-brand-gold overflow-hidden overflow-x-auto">
                <table className="w-full text-xs sm:text-sm lg:text-md xl:text-lg">
                  <thead>
                    <tr className="border-b border-brand-gold/30">
                      <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-brand-light-gray font-semibold">Ürün</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-brand-light-gray font-semibold">Renk</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-brand-light-gray font-semibold">Gram</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-brand-light-gray font-semibold">Ayar</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-brand-light-gray font-semibold">Sıra</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-brand-gold">{product.category}</td>
                      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-brand-light-gray">{product.renk || '-'}</td>
                      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-brand-light-gray">
                        {product.gram ? `${product.gram}GR` : '-'}
                      </td>
                      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-brand-light-gray">{product.ayar || '-'}</td>
                      <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-brand-light-gray">{product.sira || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fiyat Bölümü */}
            

            {product.description && (
              <div className="border-t border-brand-gold/30 pt-4 sm:pt-6">
                <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-brand-gold mb-2 sm:mb-3">Açıklama</h2>
                <p className="text-brand-light-gray leading-relaxed text-xs sm:text-sm lg:text-base xl:text-lg">
                  {product.description}
                </p>
              </div>
            )}

            {/* İletişim Butonu */}
            <div className="border-t border-brand-gold/30 pt-4 sm:pt-6">
              <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-brand-gold mb-3 sm:mb-4">Fiyat</h2>
              <a
                href="https://wa.me/905312831934" // WhatsApp numaranızı buraya ekleyin
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full btn-primary text-brand-black py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base lg:text-lg"
              >
                İletişime Geç
              </a>
              <p className="text-brand-light-gray text-xs sm:text-sm lg:text-md xl:text-lg text-center mt-2 sm:mt-3">
                Fiyat bilgisi ve detaylar için bizimle iletişime geçin
              </p>
            </div>
          </motion.div>
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div 
            className="fixed inset-0 bg-brand-black/40 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-brand-gold hover:text-brand-light-gray transition-colors z-10"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="ring-2 ring-brand-gold inline-block" onClick={(e) => e.stopPropagation()}>
              <Image
                src={lightboxImage}
                alt={product.name}
                width={0}
                height={0}
                sizes="90vw"
                className="block"
                style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        
      </div>
    </div>
  )
}
