'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cloudinaryImageLoader from '@/lib/cloudinaryImageLoader';
import { Search, X } from 'lucide-react';
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

const productCategories = ['bileklik', 'kolye', 'yuzukvekupe', 'set'] as const;
const categoryLabels: Record<(typeof productCategories)[number], string> = {
  bileklik: 'Bileklik',
  kolye: 'Kolye',
  yuzukvekupe: 'Yüzük ve Küpe',
  set: 'Set Takım',
};

function displayCategory(category: string) {
  return categoryLabels[category as keyof typeof categoryLabels] ?? category;
}

let productCatalogCache: Product[] | null = null;
let productCatalogRequest: Promise<Product[]> | null = null;

async function loadProductCatalog() {
  if (productCatalogCache) return productCatalogCache;
  if (productCatalogRequest) return productCatalogRequest;

  productCatalogRequest = (async () => {
    const [{ collection, getDocs }, { db }] = await Promise.all([
      import('firebase/firestore'),
      import('@/lib/firebaseDb'),
    ]);
    const categorySnapshots = await Promise.all(
      productCategories.map(async (category) => ({
        category,
        snapshot: await getDocs(collection(db, category)),
      })),
    );
    const products = categorySnapshots.flatMap(({ category, snapshot }) =>
      snapshot.docs.flatMap((document) => {
        const data = document.data();
        if (typeof data.name !== 'string' || typeof data.image !== 'string') return [];
        return [{ id: document.id, name: data.name, category, image: data.image }];
      }),
    );
    productCatalogCache = products;
    return products;
  })().catch((error) => {
    productCatalogRequest = null;
    throw error;
  });

  return productCatalogRequest;
}

const subscribeToClient = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function subscribeToViewport(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

const getMobileSnapshot = () => window.innerWidth < 1024;
const getServerMobileSnapshot = () => false;

export default function SearchBox({
  inputWidth = "xl:w-56 lg:w-40 w-25",
  iconSize = "xl:w-8 xl:h-8 lg:w-6 lg:h-6",
  onResultClick,
  alwaysOpen = false,
}: SearchBoxProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>(productCatalogCache ?? []);
  const [catalogStatus, setCatalogStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    productCatalogCache ? 'ready' : 'idle',
  );
  const mounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const isMobile = useSyncExternalStore(subscribeToViewport, getMobileSnapshot, getServerMobileSnapshot);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const componentMountedRef = useRef(false);
  const dialogTitleId = useId();

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr');
    if (!normalizedQuery) return [];
    return allProducts.filter((product) =>
      product.name.toLocaleLowerCase('tr').includes(normalizedQuery)
    );
  }, [searchQuery, allProducts]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    if (!alwaysOpen) requestAnimationFrame(() => triggerRef.current?.focus());
  }, [alwaysOpen]);

  const ensureProductsLoaded = useCallback(async () => {
    if (productCatalogCache) {
      setAllProducts(productCatalogCache);
      setCatalogStatus('ready');
      return;
    }

    setCatalogStatus('loading');
    try {
      const products = await loadProductCatalog();
      if (!componentMountedRef.current) return;
      setAllProducts(products);
      setCatalogStatus('ready');
    } catch (error) {
      if (!componentMountedRef.current) return;
      setCatalogStatus('error');
      console.error('Ürünler yüklenirken hata:', error);
    }
  }, []);

  useEffect(() => {
    componentMountedRef.current = true;
    return () => { componentMountedRef.current = false; };
  }, []);

  const toggleSearch = () => {
    if (searchOpen) {
      closeSearch();
      return;
    }
    setSearchOpen(true);
    void ensureProductsLoaded();
  };

  // Modal açılınca input'a odaklan
  useEffect(() => {
    if (searchOpen && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen, isMobile]);

  // ESC ile kapat
  useEffect(() => {
    if (!searchOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch();
        return;
      }
      if (event.key !== 'Tab' || isMobile) return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeSearch, isMobile, searchOpen]);

  // Mobil: dışarı tıkla kapat
  useEffect(() => {
    if (!isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) closeSearch();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, closeSearch]);

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
            ref={dialogRef}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center px-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="w-full max-w-2xl pointer-events-auto">
              <h2 id={dialogTitleId} className="sr-only">Ürün arama</h2>
              {/* Input alanı */}
              <div className="relative flex items-center border-2 border-brand-gold bg-brand-black/80 rounded-sm">
                <Search className="w-5 h-5 text-brand-gold absolute left-4 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  aria-label="Ürün ara"
                  placeholder="Aramak istediğiniz kelimeyi giriniz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-12 pr-12 bg-transparent text-white text-lg focus:outline-none placeholder-brand-medium-gray"
                />
                <button type="button" aria-label="Aramayı kapat" onClick={closeSearch} className="absolute right-4 text-brand-medium-gray hover:text-brand-gold transition-colors">
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
                    className="mt-2 bg-brand-black/90 border-2 border-brand-gold max-h-[400px] overflow-y-auto rounded-sm scrollbar-brand"
                  >
                    {catalogStatus === 'loading' ? (
                      <p className="text-brand-medium-gray text-center py-6" role="status">Ürünler yükleniyor…</p>
                    ) : catalogStatus === 'error' ? (
                      <p className="text-brand-medium-gray text-center py-6" role="status">Ürünler şu anda yüklenemiyor</p>
                    ) : searchResults.length > 0 ? searchResults.map((product) => (
                      <Link
                        key={`${product.category}-${product.id}`}
                        href={`/urunler/${product.category}/${product.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-4 p-4 hover:bg-brand-gold/10 border-b border-brand-medium-gray/30 last:border-b-0 transition-colors"
                      >
                        <div className="relative w-14 h-14 flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill loader={cloudinaryImageLoader} sizes="56px" className="object-cover rounded-sm" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-base">{product.name}</p>
                          <p className="text-brand-gold text-sm uppercase">{displayCategory(product.category)}</p>
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
            aria-label="Ürün ara"
            placeholder="Aramak istediğiniz kelimeyi giriniz..."
            value={searchQuery}
            onFocus={() => void ensureProductsLoaded()}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (catalogStatus === 'idle') void ensureProductsLoaded();
            }}
            className="w-full py-2.5 pl-9 pr-8 bg-transparent text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-gold placeholder-brand-light-gray"
          />
          {searchQuery && (
            <button type="button" aria-label="Aramayı temizle" onClick={() => setSearchQuery('')} className="absolute right-2 text-brand-medium-gray hover:text-brand-gold transition-colors">
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
              {catalogStatus === 'loading' ? (
                <p className="py-4 text-center text-sm text-brand-light-gray" role="status">Ürünler yükleniyor…</p>
              ) : catalogStatus === 'error' ? (
                <p className="py-4 text-center text-sm text-brand-light-gray" role="status">Ürünler şu anda yüklenemiyor</p>
              ) : searchResults.length > 0 ? searchResults.map((product) => (
                <Link
                  key={`${product.category}-${product.id}`}
                  href={`/urunler/${product.category}/${product.id}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-2.5 hover:bg-brand-gold/10 border-b border-brand-medium-gray/20 last:border-b-0 transition-colors"
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image src={product.image} alt={product.name} fill loader={cloudinaryImageLoader} sizes="40px" className="object-cover rounded-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{product.name}</p>
                    <p className="text-xs uppercase text-brand-gold">{displayCategory(product.category)}</p>
                  </div>
                </Link>
              )) : (
                <p className="py-4 text-center text-sm text-brand-light-gray">Ürün bulunamadı</p>
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
                aria-label="Ürün ara"
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
                        <Image src={product.image} alt={product.name} fill loader={cloudinaryImageLoader} sizes="40px" className="object-cover" />
                      </div>
                      <div>
                        <p className="text-brand-black font-semibold text-xs">{product.name}</p>
                        <p className="text-xs uppercase text-brand-medium-gray">{displayCategory(product.category)}</p>
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
        <button
          ref={triggerRef}
          type="button"
          aria-label={searchOpen ? 'Aramayı kapat' : 'Ürün ara'}
          onClick={toggleSearch}
          className="inline-flex h-10 w-10 items-center justify-center text-[#c9aa62] transition-colors hover:text-[#e2cc96]"
        >
          <Search className={`${iconSize} text-brand-gold`} />
        </button>
      )}
    </div>
  );
}
