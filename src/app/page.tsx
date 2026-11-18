'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const collections = [
  {
    index: '01',
    name: 'Bileklik',
    href: '/urunler/bileklik',
    image: '/images/instagram/model-bracelet.jpg',
    line: 'Farklı sıra ve ölçülerde hazırlanan Trabzon hasırı bileklikler.',
    card: 'lg:col-span-7',
    ratio: 'aspect-[4/5] sm:aspect-[5/4]',
    position: 'object-center',
  },
  {
    index: '02',
    name: 'Kolye',
    href: '/urunler/kolye',
    image: '/images/instagram/hasir-model.jpg',
    line: 'Tek başına veya setin parçası olarak kullanılabilen hasır kolyeler.',
    card: 'lg:col-span-5 lg:pt-24',
    ratio: 'aspect-[4/5]',
    position: 'object-[50%_34%]',
  },
  {
    index: '03',
    name: 'Yüzük ve Küpe',
    href: '/urunler/yuzukvekupe',
    image: '/images/instagram/model-ring.jpg',
    line: 'Hasır modelleri tamamlayan yüzük ve küpe seçenekleri.',
    card: 'lg:col-span-5 lg:pt-6',
    ratio: 'aspect-[4/5]',
    position: 'object-center',
  },
  {
    index: '04',
    name: 'Set Takım',
    href: '/urunler/set',
    image: '/images/instagram/model-set-crystal.jpg',
    line: 'Kolye, bileklik, yüzük ve küpenin aynı modelde bir araya geldiği setler.',
    card: 'lg:col-span-7 lg:pt-28',
    ratio: 'aspect-[4/5] sm:aspect-[5/4]',
    position: 'object-[50%_34%]',
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#f4f0e8] text-[#10211e]">
      <section className="relative bg-[#071310] pt-[4.5rem] text-white lg:pt-20">
        <div className="mx-auto grid max-w-[118rem] lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[0.46fr_0.54fr]">
          <div data-testid="hero-visual" className="relative order-1 aspect-[3/4] overflow-hidden border-white/[0.08] bg-[#111714] sm:aspect-[4/5] lg:order-2 lg:aspect-auto lg:min-h-[calc(100svh-5rem)] lg:border-l">
            <Image
              src="/images/instagram/model-necklace-long.jpg"
              alt="Model üzerinde uzun Aktürk Kuyumculuk hasır kolye"
              fill
              priority
              quality={90}
              sizes="(max-width: 1023px) 100vw, 54vw"
              className="object-cover object-[50%_57%] lg:object-[50%_76%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_72%,rgba(3,10,8,.22)_100%)] lg:bg-[linear-gradient(90deg,rgba(3,12,10,.1)_0%,transparent_18%)]" />
          </div>

          <div className="relative order-2 flex flex-col justify-center bg-[#071310] px-5 py-16 sm:px-10 sm:py-24 lg:order-1 lg:min-h-[calc(100svh-5rem)] lg:px-14 lg:py-20 xl:px-20">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="max-w-[36rem]"
            >
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#c6a75f]">
                Trabzon Hasırı
              </p>
              <h1 className="mt-6 max-w-[10.5ch] font-serif text-[3.35rem] font-normal leading-[0.98] tracking-[-0.038em] text-[#f6f1e8] sm:text-[4.25rem] lg:text-[clamp(4.1rem,4.05vw,4.8rem)]">
                Trabzon’da altın örülür.
              </h1>
              <p className="mt-7 max-w-[29rem] text-[1rem] leading-7 text-white/62 sm:text-[1.05rem] sm:leading-8">
                Trabzon hasırını ölçü ve gram tercihinize göre elde hazırlıyoruz.
              </p>
              <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
                <Link
                  href="/urunler/bileklik"
                  className="group inline-flex min-h-11 w-fit items-center gap-3 border-b border-[#c6a75f] pb-1 text-[0.76rem] font-semibold tracking-[0.05em] text-[#f3ede1] transition-colors hover:border-[#e3ca8d] hover:text-white"
                >
                  Koleksiyonları İnceleyin
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link href="/iletisim" className="group inline-flex min-h-11 w-fit items-center gap-2 text-[0.76rem] font-medium tracking-[0.04em] text-white/52 transition-colors hover:text-[#e2cb94]">
                  Bilgi Alın
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9b8050]/25 px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-20">
          <p className="pt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#876d3e]">El İşçiliği</p>
          <div>
            <h2 className="max-w-[13ch] font-serif text-[2.9rem] leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5.4rem]">
              Her ilmek elde tamamlanır.
            </h2>
            <div className="mt-10 grid gap-8 border-t border-[#9b8050]/32 pt-7 md:grid-cols-[1fr_auto] md:items-start">
              <p className="max-w-2xl text-[0.98rem] leading-8 text-[#10211e]/62">
                İnce altın teller, modelin ölçü ve gramına göre örülür. El işçiliği nedeniyle aynı modelde küçük farklılıklar oluşması doğaldır.
              </p>
              <Link href="/uretim" className="group inline-flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6f552b]">
                Üretim Sürecini İnceleyin
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto max-w-[96rem]">
          <div className="mb-16 flex flex-col gap-6 border-b border-[#9b8050]/30 pb-8 sm:mb-24 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#876d3e]">Koleksiyonlar</p>
              <h2 className="mt-4 font-serif text-5xl tracking-[-0.035em] sm:text-6xl">İlmekten forma.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#10211e]/56">Trabzon hasırının bileklik, kolye, yüzük, küpe ve set biçimleri.</p>
          </div>

          <div className="grid gap-x-6 gap-y-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28">
            {collections.map((collection) => (
              <Link
                key={collection.name}
                href={collection.href}
                aria-label={`${collection.name} koleksiyonunu inceleyin`}
                className={`group block ${collection.card}`}
              >
                <div className={`relative overflow-hidden bg-[#d9cebd] ${collection.ratio}`}>
                  <Image
                    src={collection.image}
                    alt={`Model üzerinde Aktürk Kuyumculuk ${collection.name} koleksiyonu`}
                    fill
                    quality={90}
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className={`object-cover transition-transform duration-[1300ms] ease-out group-hover:scale-[1.02] ${collection.position}`}
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/8" />
                </div>
                <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-[#9b8050]/28 pb-6">
                  <span className="pt-2 font-serif text-sm italic text-[#94743b]">{collection.index}</span>
                  <div>
                    <h3 className="font-serif text-[2rem] leading-none tracking-[-0.025em] sm:text-[2.5rem]">{collection.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#10211e]/55">{collection.line}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" className="mt-1 h-5 w-5 text-[#755a2e] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a1714] text-white">
        <div className="mx-auto grid max-w-[118rem] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative aspect-[4/5] min-h-[30rem] overflow-hidden bg-[#1b211e] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[48rem]">
            <Image
              src="/images/instagram/model-set-classic.jpg"
              alt="Model üzerinde Aktürk Kuyumculuk uyumlu kolye, bileklik, yüzük ve küpe seti"
              fill
              quality={90}
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="object-cover object-[50%_48%]"
            />
          </div>
          <div className="flex items-center px-5 py-20 sm:px-12 sm:py-24 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d7bd7c]">Set Takımları</p>
              <h2 className="mt-6 max-w-[11ch] font-serif text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.7rem]">Aynı örgünün bütün parçaları.</h2>
              <p className="mt-7 max-w-lg text-[0.98rem] leading-8 text-white/60">
                Kolye, bileklik, yüzük ve küpe aynı model ve renk bütünlüğü içinde bir araya gelir. Set içeriğini tercihinize göre belirleyebilirsiniz.
              </p>
              <Link href="/urunler/set" className="group mt-10 inline-flex min-h-13 items-center gap-4 border border-[#d7bd7c]/65 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.17em] text-[#e4ce98] transition-colors hover:bg-[#d7bd7c] hover:text-[#0a1714]">
                Set Koleksiyonunu İnceleyin
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#9b8050]/24 bg-[#f4f0e8] px-5 py-12 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[96rem] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#876d3e]">Ürün Kaydı</p>
            <p className="mt-2 font-serif text-2xl text-[#10211e] sm:text-3xl">Elde örülen. Kendi koduyla kayıtlı.</p>
            <p className="mt-2 text-sm leading-6 text-[#10211e]/56">Ayar, gram, üretim tarihi, ürün kodu ve sertifika bilgilerine ürün doğrulama sayfasından ulaşın.</p>
          </div>
          <Link href="/sertifika" className="group inline-flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6f552b]">
            Ürün Kaydını Doğrula
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
