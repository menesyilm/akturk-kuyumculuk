'use client';

import Image from 'next/image';
import Link from 'next/link';
import SearchBox from './SearchBox';

const menuItems = [
  { name: 'Bileklik', href: '/urunler/bileklik' },
  { name: 'Kolye', href: '/urunler/kolye' },
  { name: 'Yüzük & Küpe', href: '/urunler/yuzukvekupe' },
  { name: 'Set Takım', href: '/urunler/set' },
];

type NavbarProps = {
  overlay?: boolean;
};

export default function Navbar({ overlay = false }: NavbarProps) {
  return (
    <nav
      aria-label="Ana menü"
      className={`${overlay ? 'absolute bg-gradient-to-b from-black/55 via-black/20 to-transparent' : 'fixed border-b border-white/[0.08] bg-[#071310]/95 backdrop-blur-md'} inset-x-0 top-0 z-50 hidden text-white lg:block`}
    >
      <div className={`${overlay ? 'h-24' : 'h-20'} mx-auto grid max-w-[118rem] grid-cols-[1fr_auto_1fr] items-center gap-8 px-14 xl:px-20`}>
        <Link href="/" className="flex w-fit items-center gap-3.5" aria-label="Aktürk Kuyumculuk ana sayfa">
          <span className={`${overlay ? 'h-12 w-12' : 'h-10 w-10'} relative flex-none`}>
            <Image src="/images/logo-mark.webp" alt="" fill sizes={overlay ? '48px' : '40px'} className="scale-125 object-contain" />
          </span>
          <span className={`${overlay ? 'text-[1.4rem] text-[#f5e4b2]' : 'text-[1.12rem] text-[#dfc47f]'} font-serif font-medium tracking-[0.08em]`}>AKTÜRK</span>
        </Link>

        <div className="flex items-center justify-center gap-7 xl:gap-9">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative py-2 text-sm font-medium tracking-[0.03em] text-white/82 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-[#c9aa62] after:transition-transform hover:text-white hover:after:origin-left hover:after:scale-x-100"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/altin-fiyatlari" className="hidden text-sm font-medium tracking-[0.03em] text-white/76 transition-colors hover:text-white xl:block">
            Altın Fiyatları
          </Link>
          <SearchBox inputWidth="w-52" iconSize="h-[1.1rem] w-[1.1rem]" />
          <Link
            href="/iletisim"
            className="inline-flex min-h-10 items-center border-b border-[#c9aa62]/70 text-sm font-medium tracking-[0.03em] text-white/88 transition-colors hover:border-[#e7cf92] hover:text-white"
          >
            İletişim
          </Link>
        </div>
      </div>
    </nav>
  );
}
