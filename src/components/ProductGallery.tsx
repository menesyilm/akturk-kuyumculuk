'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  image: string;
  collectionName: string;
}

const CATEGORY_COLLECTIONS = [
  { name: 'yuzukvekupe' },
  { name: 'bileklik' },
  { name: 'kolye' },
  { name: 'set' },
];

export default function ProductGallery({ className }: { className?: string }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(3);
      else setVisibleCount(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const all: Product[] = [];
        for (const col of CATEGORY_COLLECTIONS) {
          const snap = await getDocs(collection(db, col.name));
          snap.forEach((doc) => {
            const data = doc.data();
            if (data.image) {
              all.push({
                id: doc.id,
                name: data.name ?? '',
                image: data.image,
                collectionName: col.name,
              });
            }
          });
        }
        const shuffled = all.sort(() => Math.random() - 0.5);
        // Ensure enough items for a seamless loop
        if (shuffled.length > 0) {
          while (shuffled.length < 8) shuffled.push(...shuffled);
        }
        setItems(shuffled);
        setLoaded(true);
      } catch (err) {
        console.error('ProductGallery fetch error:', err);
        setLoaded(true);
      }
    };
    fetchAll();
  }, []);

  // Duplicate for seamless infinite loop
  const loop = [...items, ...items];

  return (
    <div className={`relative overflow-hidden bg-brand-black ${className ?? 'h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px]'}`}>
      {!loaded && (
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: visibleCount }).map((_, index) => (
            <div key={index} className="flex items-center justify-center border-r border-brand-medium-gray/20 last:border-r-0">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-gold/30 border-t-brand-gold" />
            </div>
          ))}
        </div>
      )}

      {loaded && (
        <div className="h-full overflow-hidden">
          <div
            className="flex h-full gallery-scroll-right"
            style={{ width: `${loop.length * (100 / visibleCount)}%` }}
          >
            {loop.map((p, i) => {
              const imageKey = `${p.collectionName}-${p.id}-${i}`;

              return (
                <Link
                key={imageKey}
                href={`/urunler/${p.collectionName}/${p.id}`}
                className="relative flex-shrink-0 overflow-hidden group"
                style={{ width: `${100 / loop.length}%` }}
              >
                {!loadedImages[imageKey] && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-black">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-gold/30 border-t-brand-gold" />
                  </div>
                )}
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  unoptimized
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  onLoad={() => setLoadedImages((current) => ({ ...current, [imageKey]: true }))}
                  className={`object-cover object-top transition-all duration-500 group-hover:scale-110 ${loadedImages[imageKey] ? "opacity-100" : "opacity-0"}`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
