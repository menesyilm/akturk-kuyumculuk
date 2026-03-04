'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface SearchBoxProps {
  inputWidth?: string; // Tailwind class örn: "xl:w-56 lg:w-40" veya "w-40 sm:w-56"
  iconSize?: string; // Tailwind class örn: "xl:w-8 xl:h-8 lg:w-6 lg:h-6" veya "w-6 h-6"
  onResultClick?: () => void; // Opsiyonel: sonuç tıklandığında ek bir callback
}

export default function SearchBox({ 
  inputWidth = "xl:w-56 lg:w-40 w-25", 
  iconSize = "xl:w-8 xl:h-8 lg:w-6 lg:h-6",
  onResultClick
}: SearchBoxProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Tüm ürünleri yükle
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const categories = ['bileklik', 'kolye', 'yuzukvekupe', 'set'];
        const products: Product[] = [];

        for (const category of categories) {
          const querySnapshot = await getDocs(collection(db, category));
          querySnapshot.forEach((doc) => {
            products.push({
              id: doc.id,
              name: doc.data().name,
              category: category,
              image: doc.data().image,
            });
          });
        }

        setAllProducts(products);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      }
    };

    fetchAllProducts();
  }, []);

  // Arama yapıldığında filtreleme
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery, allProducts]);

  // Dışarı tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    onResultClick?.(); // Parent'tan gelen callback varsa çağır
  };

  return (
    <div ref={searchRef} className="relative flex items-center">
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputWidth} px-4 py-2 pr-10 bg-white text-black border-2 border-brand-medium-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all placeholder-brand-medium-gray`}
              autoFocus
            />

          {/* Arama Sonuçları Dropdown */}
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute top-full right-0 mt-2 bg-white border-2 border-brand-gold shadow-2xl max-h-[168px] sm:max-h-[288px] xl:max-h-[520px] overflow-y-auto z-50 w-64 sm:w-80 md:w-96">
              {searchResults.map((product) => (
                <Link
                  key={`${product.category}-${product.id}`}
                  href={`/urunler/${product.category}/${product.id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 hover:bg-brand-light-gray/10 border-b border-brand-medium-gray last:border-b-0 transition-colors"
                >
                  <div className="relative w-8 h-8 sm:w-12 sm:h-12 xl:w-20 xl:h-20 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-brand-black font-semibold text-xs sm:text-sm xl:text-base">{product.name}</p>
                    <p className="text-brand-medium-gray uppercase text-xs sm:text-sm xl:text-base">{product.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Sonuç Bulunamadı */}
          {searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full right-0 mt-2 bg-white border-2 border-brand-gold shadow-2xl p-4 z-50 w-64 sm:w-80 md:w-96">
              <p className="text-brand-medium-gray text-sm text-center">Ürün bulunamadı</p>
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="p-1"
      >
        <Search className={`${iconSize} text-brand-gold`} />
      </button>
    </div>
  );
}
