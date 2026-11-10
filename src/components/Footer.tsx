import Image from 'next/image';
import Link from 'next/link';
import { Clock, Instagram, MessageCircle } from 'lucide-react';

const collectionLinks = [
  { label: 'Bileklik', href: '/urunler/bileklik' },
  { label: 'Kolye', href: '/urunler/kolye' },
  { label: 'Yüzük ve Küpe', href: '/urunler/yuzukvekupe' },
  { label: 'Set Takım', href: '/urunler/set' },
];

const corporateLinks = [
  { label: 'Neden Aktürk?', href: '/neden-akturk-kuyumculuk' },
  { label: 'Üretim', href: '/uretim' },
  { label: 'İletişim', href: '/iletisim' },
  { label: 'Altın Fiyatları', href: '/altin-fiyatlari' },
  { label: 'Ürün Doğrulama', href: '/sertifika' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#d6b56d]/35 bg-[#090b0a] text-white">
      <div className="mx-auto max-w-[96rem] px-5 py-16 sm:px-9 sm:py-20 lg:px-14 lg:py-24">
        <div className="grid gap-14 border-b border-white/12 pb-14 lg:grid-cols-[1.35fr_.65fr_.65fr_.85fr] lg:gap-12 lg:pb-20">
          <div>
            <Link href="/" className="flex w-fit items-center gap-4" aria-label="Aktürk Kuyumculuk ana sayfa">
              <span className="relative h-16 w-16">
                <Image src="/images/logo-no-background.png" alt="" fill sizes="64px" className="object-contain" />
              </span>
              <span>
                <span className="block font-serif text-xl tracking-[0.1em] text-[#e2c77f]">AKTÜRK</span>
                <span className="block text-[0.55rem] uppercase tracking-[0.34em] text-white/42">Kuyumculuk</span>
              </span>
            </Link>
            <p className="mt-7 max-w-md font-serif text-2xl leading-[1.35] text-white/84 sm:text-3xl">
              Altının yaşayan çizgisi, Trabzon’dan.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href="https://www.instagram.com/akturk_kuyumculuk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center border border-white/18 text-white/70 transition-colors hover:border-[#d8ba74] hover:text-[#d8ba74]"
                aria-label="Aktürk Kuyumculuk Instagram"
              >
                <Instagram aria-hidden="true" className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/905312831934"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center border border-white/18 text-white/70 transition-colors hover:border-[#d8ba74] hover:text-[#d8ba74]"
                aria-label="Aktürk Kuyumculuk WhatsApp"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#d8ba74]">Koleksiyonlar</h2>
            <ul className="mt-6 space-y-3.5">
              {collectionLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/58 transition-colors hover:text-white">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#d8ba74]">Aktürk</h2>
            <ul className="mt-6 space-y-3.5">
              {corporateLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/58 transition-colors hover:text-white">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#d8ba74]">Çalışma Saatleri</h2>
            <div className="mt-6 space-y-4 text-sm text-white/58">
              <p className="flex items-start gap-3"><Clock aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-[#d8ba74]" /> <span>Hafta içi<br /><strong className="font-normal text-white/82">09.00 — 17.00</strong></span></p>
              <p className="flex items-start gap-3"><Clock aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-[#d8ba74]" /> <span>Cumartesi<br /><strong className="font-normal text-white/82">10.00 — 16.00</strong></span></p>
              <p className="pl-7 text-white/42">Pazar kapalı</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[0.62rem] uppercase tracking-[0.16em] text-white/32 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Aktürk Kuyumculuk. Tüm hakları saklıdır.</p>
          <p>Aktürk Kuyumculuk · Trabzon</p>
        </div>
      </div>
    </footer>
  );
}
