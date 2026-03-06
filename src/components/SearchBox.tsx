'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface SearchBoxProps {
  inputWidth?: string;
  iconSize?: string;
  onResultClick?: () => void;
  alwaysOpen?: boolean;
}

export default function SearchBox({ 
  inputWidth = "xl:w-56 lg:w-40 w-25", 
  iconSize = "xl:w-8 xl:h-8 lg:w-6 lg:h-6",
  onResultClick,
  alwaysOpen = false,
}: SearchBoxProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tüm ürünleri yükle
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const categories = ['bileklik', 'kolye', 'yuzukvekupe', 'set'];
        const products: Product[] = [];
        for (const category of categories) {
          const querySnapshot = await getDocs(collection(db, category));
          querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, name: doc.data().name, category, image: doc.data().image });
          });
        }
        setAllProducts(products);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      }
    };
    fetchAllProducts();
  }, []);

  // Arama filtrele
  useEffect(() => {
    if (searchQuery.trim() === '') { setSearchResults([]); return; }
    setSearchResults(allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, allProducts]);

  // Modal açılınca input'a odaklan
  useEffect(() => {
    if (searchOpen && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen, isMobile]);

  // ESC ile kapat
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Mobil: dışarı tıkla kapat
  useEffect(() => {
    if (!isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) closeSearch();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleResultClick = () => {
    closeSearch();
    onResultClick?.();
  };

  // Desktop Modal
  const desktopModal = (
    <AnimatePresence>
      {searchOpen && !isMobile && (
        <>
          {/* Buğu overlay */}
          <motion.div
            className="fixed inset-0 z-[999] backdrop-blur-md bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeSearch}
          />
          {/* Modal içerik */}
          <motion.div
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center px-4 pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="w-full max-w-2xl pointer-events-auto">
              {/* Input alanı */}
              <div className="relative flex items-center border-2 border-brand-gold bg-brand-black/80 rounded-sm">
                <Search className="w-5 h-5 text-brand-gold absolute left-4 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Aramak istediğiniz kelimeyi giriniz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-12 pr-12 bg-transparent text-white text-lg focus:outline-none placeholder-brand-medium-gray"
                />
                <button onClick={closeSearch} className="absolute right-4 text-brand-medium-gray hover:text-brand-gold transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sonuçlar */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 bg-brand-black/90 border-2 border-brand-gold max-h-[400px] overflow-y-auto rounded-sm"
                  >
                    {searchResults.length > 0 ? searchResults.map((product) => (
                      <Link
                        key={`${product.category}-${product.id}`}
                        href={`/urunler/${product.category}/${product.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-4 p-4 hover:bg-brand-gold/10 border-b border-brand-medium-gray/30 last:border-b-0 transition-colors"
                      >
                        <div className="relative w-14 h-14 flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill className="object-cover rounded-sm" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-base">{product.name}</p>
                          <p className="text-brand-gold text-sm uppercase">{product.category}</p>
                        </div>
                      </Link>
                    )) : (
                      <p className="text-brand-medium-gray text-center py-6">Ürün bulunamadı</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Her zaman açık (sidebar) inline arama
  if (alwaysOpen) {
    return (
      <div ref={searchRef} className="relative">
        <div className="relative flex items-center border border-brand-gold/60 bg-brand-dark-gray rounded-sm">
          <Search className="w-4 h-4 text-brand-gold absolute left-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Aramak istediğiniz kelimeyi giriniz..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-9 pr-8 bg-transparent text-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold placeholder-brand-medium-gray"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-2 text-brand-medium-gray hover:text-brand-gold transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 bg-brand-black border border-brand-gold/60 max-h-[280px] overflow-y-auto z-50 rounded-sm"
            >
              {searchResults.length > 0 ? searchResults.map((product) => (
                <Link
                  key={`${product.category}-${product.id}`}
                  href={`/urunler/${product.category}/${product.id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-2.5 hover:bg-brand-gold/10 border-b border-brand-medium-gray/20 last:border-b-0 transition-colors"
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image src={product.image} alt={product.name} fill className="object-cover rounded-sm" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xs">{product.name}</p>
                    <p className="text-brand-gold text-[10px] uppercase">{product.category}</p>
                  </div>
                </Link>
              )) : (
                <p className="text-brand-medium-gray text-xs text-center py-4">Ürün bulunamadı</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={searchRef} className="relative flex items-center">
      {/* Mobil: eski inline arama */}
      {isMobile && (
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputWidth} px-4 py-2 pr-10 bg-white text-black border-2 border-brand-medium-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-all placeholder-brand-medium-gray`}
                autoFocus
              />
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-brand-gold shadow-2xl max-h-[288px] overflow-y-auto z-50 w-64 sm:w-80">
                  {searchResults.map((product) => (
                    <Link
                      key={`${product.category}-${product.id}`}
                      href={`/urunler/${product.category}/${product.id}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 p-3 hover:bg-brand-light-gray/10 border-b border-brand-medium-gray last:border-b-0 transition-colors"
                    >
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-brand-black font-semibold text-xs">{product.name}</p>
                        <p className="text-brand-medium-gray uppercase text-xs">{product.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-brand-gold shadow-2xl p-4 z-50 w-64 sm:w-80">
                  <p className="text-brand-medium-gray text-sm text-center">Ürün bulunamadı</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Desktop modal portal */}
      {mounted && !isMobile && createPortal(desktopModal, document.body)}

      {!alwaysOpen && (
        <button onClick={() => setSearchOpen(!searchOpen)} className="p-1">
          <Search className={`${iconSize} text-brand-gold`} />
        </button>
      )}
    </div>
  );
}
