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

export default function Navbar() {
  return (
    <nav aria-label="Ana menü" className="fixed inset-x-0 top-0 z-50 hidden border-b border-white/[0.08] bg-[#071310]/95 text-white backdrop-blur-md lg:block">
      <div className="mx-auto grid h-20 max-w-[118rem] grid-cols-[1fr_auto_1fr] items-center gap-8 px-14 xl:px-20">
        <Link href="/" className="flex w-fit items-center gap-3.5" aria-label="Aktürk Kuyumculuk ana sayfa">
          <span className="relative h-10 w-10 flex-none">
            <Image src="/images/logo-no-background.png" alt="" fill sizes="40px" className="scale-125 object-contain" priority />
          </span>
          <span className="font-serif text-[1.12rem] font-medium tracking-[0.06em] text-[#dfc47f]">AKTÜRK</span>
        </Link>

        <div className="flex items-center justify-center gap-7 xl:gap-9">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative py-2 text-[0.82rem] font-medium tracking-[0.015em] text-white/68 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-[#c9aa62] after:transition-transform hover:text-white hover:after:origin-left hover:after:scale-x-100"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/altin-fiyatlari" className="hidden text-[0.78rem] font-medium tracking-[0.02em] text-white/52 transition-colors hover:text-white/85 xl:block">
            Altın Fiyatları
          </Link>
          <SearchBox inputWidth="w-52" iconSize="h-[1.1rem] w-[1.1rem]" />
          <Link
            href="/iletisim"
            className="group inline-flex min-h-10 items-center gap-2 border-b border-[#c9aa62]/60 text-[0.78rem] font-medium tracking-[0.02em] text-white/76 transition-colors hover:border-[#d8ba74] hover:text-white"
          >
            İletişim <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
