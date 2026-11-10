'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'Bileklik',
    href: '/urunler/bileklik',
    image: '/images/instagram/model-bracelet.jpg',
    line: 'Bilekte net bir çizgi.',
    className: 'lg:col-span-7 lg:row-span-2 min-h-[35rem] lg:min-h-[48rem]',
    position: 'object-center',
  },
  {
    name: 'Kolye',
    href: '/urunler/kolye',
    image: '/images/instagram/model-necklace-long.jpg',
    line: 'Hareketle değişen oran.',
    className: 'lg:col-span-5 min-h-[31rem] lg:min-h-0',
    position: 'object-center',
  },
  {
    name: 'Yüzük ve Küpe',
    href: '/urunler/yuzukvekupe',
    image: '/images/instagram/model-ring.jpg',
    secondaryImage: '/images/instagram/model-drop-set.jpg',
    line: 'Ayrıntıda kalan imza.',
    className: 'lg:col-span-5 min-h-[31rem] lg:min-h-0',
    position: 'object-center',
  },
  {
    name: 'Set Takım',
    href: '/urunler/set',
    image: '/images/instagram/model-set-classic.jpg',
    secondaryImage: '/images/instagram/model-flower-set.jpg',
    line: 'Birlikte tamamlanan görünüm.',
    className: 'lg:col-span-12 min-h-[35rem] lg:min-h-[43rem]',
    position: 'object-[50%_30%]',
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-[#8c7245]">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#f5f2eb] text-[#152825]">
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#08100f] text-white">
        <div className="mx-auto grid min-h-[100svh] max-w-[110rem] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative z-10 flex flex-col justify-end px-5 pb-16 pt-36 sm:px-9 sm:pb-20 lg:px-14 lg:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              <p className="mb-7 flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-[#e0c88e] sm:text-xs">
                <span className="h-px w-10 bg-[#d2b671]" /> Aktürk Kuyumculuk · Trabzon
              </p>
              <h1 className="font-serif text-[3.35rem] font-normal leading-[0.92] tracking-[-0.045em] text-[#fbf9f3] sm:text-7xl lg:text-[5.9rem] xl:text-[7rem]">
                Altın, sizinle
                <span className="block italic text-[#d8bd7e]">biçim kazanır.</span>
              </h1>
              <div className="mt-8 flex flex-col gap-7 border-t border-white/24 pt-7 xl:flex-row xl:items-end xl:justify-between">
                <p className="max-w-lg text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
                  Aktürk hasırı, taşıyan kişinin ritmiyle tamamlanır.
                </p>
                <Link
                  href="/urunler/bileklik"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 bg-[#f6f2e9] px-7 py-3 text-xs font-bold uppercase tracking-[0.17em] text-[#10201e] transition-colors hover:bg-[#d8bd7e]"
                >
                  Koleksiyonları Keşfet
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>

            <div className="absolute bottom-5 right-5 hidden items-center gap-3 text-[0.6rem] uppercase tracking-[0.28em] text-white/50 sm:flex lg:bottom-8 lg:right-14">
              Keşfet <ArrowDown aria-hidden="true" className="h-4 w-4 animate-bounce" />
            </div>
          </div>

          <div data-testid="hero-collage" className="relative grid min-h-[44rem] grid-cols-[1.2fr_.8fr] grid-rows-2 gap-1.5 p-1.5 lg:min-h-[100svh] lg:py-20 lg:pl-0 lg:pr-5">
            <div className="relative row-span-2 overflow-hidden bg-[#152825]">
              <Image
                src="/images/instagram/hasir-model.jpg"
                alt="Model üzerinde Aktürk Kuyumculuk hasır kolye ve bileklik"
                fill
                priority
                quality={90}
                sizes="(max-width: 1023px) 60vw, 40vw"
                className="object-cover object-[52%_36%]"
              />
            </div>
            <div className="relative overflow-hidden bg-[#d7c9b9]">
              <Image src="/images/instagram/model-bracelet.jpg" alt="Aktürk Kuyumculuk bileklik yakın planı" fill quality={90} sizes="(max-width: 1023px) 40vw, 24vw" className="object-cover object-center" />
            </div>
            <div className="relative overflow-hidden bg-[#e4d7c9]">
              <Image src="/images/instagram/model-ring.jpg" alt="Aktürk Kuyumculuk yüzük yakın planı" fill quality={90} sizes="(max-width: 1023px) 40vw, 24vw" className="object-cover object-center" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(3,9,8,.3)_100%)]" />
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto max-w-[96rem]">
          <div className="mx-auto mb-16 max-w-5xl text-center sm:mb-24">
            <Eyebrow>Koleksiyonlar</Eyebrow>
            <h2 className="mt-6 font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-[6.5rem]">
              Her parça.
              <span className="block italic text-[#9a7942]">Başka bir duruş.</span>
            </h2>
          </div>

          <div className="grid gap-3 lg:grid-cols-12 lg:auto-rows-[22rem]">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`editorial-card group relative isolate overflow-hidden bg-[#0b1715] ${category.className}`}
              >
                {category.secondaryImage ? (
                  <div className="absolute inset-0 grid grid-cols-2 gap-1.5">
                    <div className="relative overflow-hidden">
                      <Image src={category.image} alt={`Model üzerinde Aktürk Kuyumculuk ${category.name} koleksiyonu`} fill quality={90} sizes="(max-width: 1023px) 50vw, 38vw" className={`object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035] ${category.position}`} />
                    </div>
                    <div className="relative overflow-hidden">
                      <Image src={category.secondaryImage} alt="" fill quality={90} sizes="(max-width: 1023px) 50vw, 38vw" className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={category.image}
                    alt={`Model üzerinde Aktürk Kuyumculuk ${category.name} koleksiyonu`}
                    fill
                    quality={90}
                    sizes="(max-width: 1023px) 100vw, 62vw"
                    className={`object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035] ${category.position}`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/5 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 text-white sm:p-10">
                  <div>
                    <h3 className="mt-2 font-serif text-4xl sm:text-5xl">{category.name}</h3>
                    <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#e0c88e]">{category.line}</p>
                  </div>
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-full border border-white/55 transition-colors group-hover:border-[#d8bd7e] group-hover:bg-[#d8bd7e] group-hover:text-[#10201e]">
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f1ece2] px-5 py-10 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[96rem] flex-col gap-4 border-l border-[#9a7942]/45 pl-5 sm:flex-row sm:items-center sm:justify-between sm:pl-7">
          <div>
            <p className="font-serif text-xl text-[#12302d] sm:text-2xl">Elinizde Aktürk ürünü mü var?</p>
            <p className="mt-1 text-sm text-[#152825]/50">Ürün veya belge koduyla kayıt bilgilerini kontrol edebilirsiniz.</p>
          </div>
          <Link href="/sertifika" className="group inline-flex w-fit items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#745a2f]">
            Ürün kaydını doğrula <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
