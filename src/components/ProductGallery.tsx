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
        while (shuffled.length < 8) shuffled.push(...shuffled);
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {loaded && (
        <div className="h-full overflow-hidden">
          <div
            className="flex h-full gallery-scroll-right"
            style={{ width: `${loop.length * 25}%` }}
          >
            {loop.map((p, i) => (
              <Link
                key={`item-${i}`}
                href={`/urunler/${p.collectionName}/${p.id}`}
                className="relative flex-shrink-0 overflow-hidden group"
                style={{ width: `${100 / loop.length}%` }}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
