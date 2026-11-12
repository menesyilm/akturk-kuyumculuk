'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { ArrowLeft, Expand, MessageCircle, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import ImageWithLoader from '@/components/ImageWithLoader';

interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  image2?: string;
  category?: string;
  createdAt?: Timestamp;
  renk?: string;
  gram?: string;
  ayar?: string;
  sira?: string;
  productCode?: string;
}

interface ProductDetailPageProps {
  collectionName: 'bileklik' | 'kolye' | 'set' | 'yuzukvekupe';
  collectionTitle: string;
}

export default function ProductDetailPage({ collectionName, collectionTitle }: ProductDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, collectionName, params.id as string));
        if (!productDoc.exists()) {
          router.push(`/urunler/${collectionName}`);
          return;
        }
        setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
      } catch {
        router.push(`/urunler/${collectionName}`);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [collectionName, params.id, router]);

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#f4f0e8]">
        <p className="text-[0.67rem] font-bold uppercase tracking-[0.24em] text-[#876d3e]">Ürün yükleniyor</p>
      </div>
    );
  }

  if (!product) return null;

  const images = [product.image, product.image2].filter(Boolean) as string[];
  const details = [
    ['Kategori', product.category || collectionTitle],
    ['Renk', product.renk],
    ['Gram', product.gram ? `${product.gram} gr` : undefined],
    ['Ayar', product.ayar],
    ['Sıra', product.sira],
  ].filter((entry) => entry[1]);

  return (
    <div className="min-h-screen bg-[#f4f0e8] px-5 pb-24 pt-10 text-[#10211e] sm:px-9 sm:pb-32 lg:px-14 lg:pb-40 lg:pt-16">
      <div className="mx-auto max-w-[96rem]">
        <Link href={`/urunler/${collectionName}`} className="mb-8 inline-flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#765a2d] sm:mb-12">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> {collectionTitle} Koleksiyonuna Dön
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 xl:gap-24">
          <div className={`grid gap-3 sm:gap-5 ${images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {images.map((image, index) => (
              <button key={image} type="button" onClick={() => setLightboxImage(image)} className="group relative aspect-[4/5] overflow-hidden bg-[#ded5c8] text-left" aria-label={`${product.name} ${index + 1}. görselini büyüt`}>
                <ImageWithLoader src={image} alt={`${product.name} - ${index + 1}`} fill sizes="(max-width: 1023px) 100vw, 38vw" className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.02]" />
                <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center bg-[#f4f0e8]/92 text-[#10211e] opacity-0 transition-opacity group-hover:opacity-100">
                  <Expand aria-hidden="true" className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[0.63rem] font-bold uppercase tracking-[0.27em] text-[#876d3e]">{collectionTitle} Koleksiyonu</p>
            <h1 className="mt-5 font-serif text-[3rem] leading-[1.02] tracking-[-0.035em] sm:text-6xl">{product.name}</h1>
            {product.productCode && <p className="mt-5 text-[0.67rem] font-semibold uppercase tracking-[0.16em] text-[#10211e]/45">Ürün kodu · {product.productCode}</p>}

            {product.description && <p className="mt-8 border-t border-[#9b8050]/28 pt-7 text-[0.98rem] leading-8 text-[#10211e]/60">{product.description}</p>}

            {details.length > 0 && (
              <dl className="mt-8 border-y border-[#9b8050]/28">
                {details.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[0.42fr_0.58fr] border-b border-[#9b8050]/20 py-4 last:border-b-0">
                    <dt className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#10211e]/42">{label}</dt>
                    <dd className="text-sm text-[#10211e]/75">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-9">
              <a href="https://wa.me/905312831934" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 w-full items-center justify-center gap-3 bg-[#0a1714] px-7 py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#f4f0e8] transition-colors hover:bg-[#8b6d39]">
                <MessageCircle aria-hidden="true" className="h-4 w-4" /> Fiyat ve Bilgi Alın
              </a>
              <p className="mt-4 text-center text-xs leading-5 text-[#10211e]/42">El yapımı ürünlerde gram ve fiyat ürüne göre değişebilir.</p>
            </div>
          </aside>
        </div>
      </div>

      {lightboxImage && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#06100e]/95 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={`${product.name} görseli`} onClick={() => setLightboxImage(null)}>
          <button type="button" onClick={() => setLightboxImage(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center border border-white/25 text-white" aria-label="Görseli kapat">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
          <div className="relative h-[88vh] w-[92vw]" onClick={(event) => event.stopPropagation()}>
            <ImageWithLoader src={lightboxImage} alt={product.name} fill sizes="92vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
