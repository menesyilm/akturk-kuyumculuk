import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const productionSteps = [
  {
    index: '01',
    title: 'Ayar ve alaşım hazırlığı',
    text: 'Üretilecek ürüne göre altın ayarı belirlenir; ham madde kontrollü biçimde hazırlanarak üretim ölçülerine getirilir.',
    note: '22 · 18 · 14 · 8 ayar',
  },
  {
    index: '02',
    title: 'Telin hazırlanması',
    text: 'Altın, inceltme ve tavlama aşamalarından geçirilerek hasır dokusuna uygun esneklik ve kalınlığa ulaştırılır.',
    note: 'Kontrollü inceltme',
  },
  {
    index: '03',
    title: 'Hasırın biçimlenmesi',
    text: 'Hazırlanan teller, ürünün ölçüsü ve modeline göre el işçiliğiyle örülür; bağlantı ve form ayrıntıları tamamlanır.',
    note: 'El işçiliği',
  },
  {
    index: '04',
    title: 'Form ve yüzey kontrolü',
    text: 'Ürünün simetrisi, kilitleri, yüzeyi ve kullanım dengesi kontrol edilir; gerekli düzeltmeler tamamlanır.',
    note: 'Teknik kontrol',
  },
  {
    index: '05',
    title: 'Kod ve sertifika kaydı',
    text: 'Ürünün ayar, gram, renk, tarih ve kod bilgileri kayıt altına alınır; sertifika ürüne özel olarak hazırlanır.',
    note: 'İzlenebilir ürün kaydı',
  },
];

export default function Uretim() {
  return (
    <div className="bg-[#f4f0e8] text-[#10211e]">
      <header className="px-5 py-20 sm:px-9 sm:py-28 lg:px-14 lg:py-36">
        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20">
          <p className="pt-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#876d3e]">Üretim</p>
          <div>
            <h1 className="max-w-[11ch] font-serif text-[3.35rem] leading-[0.98] tracking-[-0.04em] sm:text-7xl lg:text-[6rem]">Hasırın biçim aldığı süreç.</h1>
            <p className="mt-9 max-w-2xl border-t border-[#9b8050]/30 pt-7 text-[1rem] leading-8 text-[#10211e]/60 sm:text-lg">Ham maddenin hazırlanmasından ürüne özel kayıt oluşturulmasına kadar her aşama, bir sonraki adımın temelini kurar.</p>
          </div>
        </div>
      </header>

      <section className="bg-[#0a1714] text-white">
        <div className="mx-auto grid max-w-[118rem] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative aspect-[4/5] min-h-[30rem] overflow-hidden bg-[#1b211e] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[48rem]">
            <Image src="/images/instagram/model-bracelet.jpg" alt="Model üzerinde Aktürk Kuyumculuk hasır bileklik" fill quality={90} sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover object-center" />
          </div>
          <div className="flex items-center px-5 py-20 sm:px-10 sm:py-24 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <p className="text-[0.63rem] font-bold uppercase tracking-[0.28em] text-[#d7bd7c]">Ölçü · Form · Denge</p>
              <h2 className="mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">Görünmeyen ayrıntılar, ürünün kullanımını belirler.</h2>
              <p className="mt-7 text-[0.98rem] leading-8 text-white/58">Hasırın dokusu kadar, kilit yapısı, sıra ölçüsü, gram dengesi ve yüzey kontrolü de ürünün bütünlüğünün parçasıdır.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto max-w-[96rem]">
          <div className="grid gap-8 border-b border-[#9b8050]/30 pb-10 lg:grid-cols-[0.35fr_0.65fr]">
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.28em] text-[#876d3e]">Beş Aşama</p>
            <h2 className="max-w-[12ch] font-serif text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">Tek üründe birleşen kontrollü adımlar.</h2>
          </div>
          <div>
            {productionSteps.map((step) => (
              <article key={step.index} className="grid gap-5 border-b border-[#9b8050]/24 py-9 md:grid-cols-[0.12fr_0.32fr_0.4fr_0.16fr] md:items-start md:gap-8 md:py-11">
                <span className="font-serif text-sm italic text-[#94743b]">{step.index}</span>
                <h3 className="font-serif text-2xl tracking-[-0.02em] sm:text-3xl">{step.title}</h3>
                <p className="text-sm leading-7 text-[#10211e]/58 sm:text-base sm:leading-8">{step.text}</p>
                <p className="text-[0.61rem] font-bold uppercase tracking-[0.17em] text-[#876d3e] md:text-right">{step.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#9b8050]/24 px-5 py-16 sm:px-9 lg:px-14">
        <div className="mx-auto grid max-w-[96rem] gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#876d3e]">Üretim Sonrası</p>
            <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">Teknik bilgiler ürün koduyla kayıt altına alınır.</h2>
          </div>
          <Link href="/sertifika" className="group inline-flex w-fit items-center gap-3 text-[0.67rem] font-bold uppercase tracking-[0.18em] text-[#6f552b]">Ürün Kaydını Doğrula <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[96rem] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-2xl sm:text-3xl">Ürünler hakkında bilgi almak ister misiniz?</p>
          <Link href="/iletisim" className="group inline-flex min-h-12 w-fit items-center gap-3 border border-[#876d3e]/55 px-6 py-3 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#6f552b]">Bize Ulaşın <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
