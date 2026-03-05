'use client';
import Link from 'next/link';
import Image from 'next/image';

import SearchBox from './SearchBox';

export default function Navbar() {

  const menuItems = [
    { name: 'BİLEKLİK', href: '/urunler/bileklik' },
    { name: 'KOLYE', href: '/urunler/kolye' },
    { name: 'YÜZÜK VE KÜPE', href: '/urunler/yuzukvekupe' },
    { name: 'SET', href: '/urunler/set' },
    { name: 'ALTIN FİYATLARI', href: '/altin-fiyatlari' },
    { name: 'SERTİFİKA', href: '/sertifika' },
  ];

  return (
    <nav className="hidden lg:block fixed top-0 left-0 right-0 bg-brand-dark-gray border-b-2 border-brand-gold z-50 shadow-2xl shadow-brand-light-gray/50">
      {/* En Üst Bar - İletişim ve Linkler */}
      <div className="bg-brand-black border-b border-brand-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Sol - Linkler */}
            <div className="flex items-center space-x-6 xl:text-lg lg:text-sm">
              <Link href="/neden-akturk-kuyumculuk" className="text-brand-light-gray hover:text-brand-gold transition-colors">
                Neden Akturk Kuyumculuk?
              </Link>
              <Link href="/uretim" className="text-brand-light-gray hover:text-brand-gold transition-colors">
                Üretim
              </Link>
            </div>


          </div>
        </div>
      </div>

      {/* Orta Kısım - Logo */}
      <div className="border-b border-brand-medium-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo (sol) */}
            <div className="flex-1 flex justify-start">
              <Link href="/" className="flex items-center">
                <div className="relative xl:h-20 xl:w-20 lg:h-16 lg:w-16">
                  <Image
                    src="/images/logo-no-background.png"
                    alt="Aktürk Kuyumculuk"
                    fill
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
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Arama (sağda) */}
            <div className="flex-1 flex justify-end items-center">
              <SearchBox 
                inputWidth="xl:w-56 lg:w-40"
                iconSize="xl:w-8 xl:h-8 lg:w-6 lg:h-6"
              />
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
                  className="xl:text-lg lg:text-sm font-bold text-black hover:text-brand-gold transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-brand-gold py-1"
                >
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