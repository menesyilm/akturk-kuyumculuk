'use client';
import Link from 'next/link';
import Image from 'next/image';

import { BadgeCheck } from 'lucide-react';
import SearchBox from './SearchBox';

export default function Navbar() {

  const menuItems = [
    { name: 'BİLEKLİK', href: '/urunler/bileklik' },
    { name: 'KOLYE', href: '/urunler/kolye' },
    { name: 'YÜZÜK VE KÜPE', href: '/urunler/yuzukvekupe' },
    { name: 'SET', href: '/urunler/set' },
    { name: 'ALTIN FİYATLARI', href: '/altin-fiyatlari' },
    { name: 'SERTİFİKA DOĞRULA', href: '/sertifika', featured: true },
  ];

  return (
    <nav aria-label="Ana menü" className="hidden lg:block fixed top-0 left-0 right-0 bg-brand-dark-gray border-b-2 border-brand-gold z-50 shadow-2xl shadow-brand-light-gray/50">
      {/* Orta Kısım - Logo */}
      <div className="border-b border-brand-medium-gray">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo (sol) */}
            <div className="flex-1 flex justify-start">
              <Link href="/" className="flex items-center">
                <div className="relative xl:h-20 xl:w-20 lg:h-16 lg:w-16">
                  <Image
                    src="/images/logo-no-background.png"
                    alt="Aktürk Kuyumculuk"
                    fill
                    sizes="80px"
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Caption (ortada) */}
            <div className="flex-1 flex justify-center mt-4">
              <div className="relative xl:h-125 xl:w-125 lg:h-100 lg:w-100">
                <Image
                  src="/images/caption-2.png"
                  alt="Caption"
                  fill
                  sizes="(min-width: 1280px) 500px, 400px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Arama + Bize Ulaşın (sağda) */}
            <div className="flex-1 flex justify-end items-center gap-3 xl:gap-4">
              <SearchBox 
                inputWidth="xl:w-56 lg:w-40"
                iconSize="xl:w-8 xl:h-8 lg:w-6 lg:h-6"
              />
              <Link
                href="/iletisim"
                 className="text-xs block btn-primary text-brand-black px-1.5 py-1.5"
              >
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Kısım - Menü */}
      <div className="bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-14 overflow-x-auto">
            <div className="flex space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`xl:text-lg lg:text-sm font-bold transition-colors whitespace-nowrap border-b-2 py-1 ${
                    item.featured
                      ? 'text-brand-gold border-brand-gold flex items-center gap-1.5'
                      : 'text-black border-transparent hover:text-brand-gold hover:border-brand-gold'
                  }`}
                >
                  {item.featured && <BadgeCheck aria-hidden="true" className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
