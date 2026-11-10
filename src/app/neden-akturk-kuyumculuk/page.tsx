import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const values = [
  {
    index: '01',
    title: 'El işçiliği',
    text: 'Her parça, hasırın karakterini koruyan ölçü ve oranlarla hazırlanır; form, denge ve kullanım rahatlığı birlikte değerlendirilir.',
  },
  {
    index: '02',
    title: 'Ürüne özel kayıt',
    text: 'Ürün kodu, sertifika numarası ve teknik bilgiler aynı kayıtta bir araya gelir. Böylece ürünün kimliği sonradan da doğrulanabilir.',
  },
  {
    index: '03',
    title: 'Açık ürün bilgisi',
    text: 'Ayar, gram, renk, üretim tarihi ve ürün içeriği gibi bilgiler sertifika kaydında açık ve anlaşılır biçimde gösterilir.',
  },
  {
    index: '04',
    title: 'Satış sonrası destek',
    text: 'Bakım ve kullanım bilgileri ürünle birlikte sunulur; bakım talepleri ürün kaydı üzerinden daha düzenli biçimde takip edilir.',
  },
];

export default function NedenAkturkKuyumculuk() {
  return (
    <div className="bg-[#f4f0e8] text-[#10211e]">
      <header className="border-b border-[#9b8050]/25 px-5 py-20 sm:px-9 sm:py-28 lg:px-14 lg:py-36">
        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20">
          <p className="pt-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#876d3e]">Aktürk Hakkında</p>
          <div>
            <h1 className="max-w-[12ch] font-serif text-[3.35rem] leading-[0.98] tracking-[-0.04em] sm:text-7xl lg:text-[6rem]">Takının ötesinde, kaydı olan bir değer.</h1>
            <p className="mt-9 max-w-2xl border-t border-[#9b8050]/30 pt-7 text-[1rem] leading-8 text-[#10211e]/60 sm:text-lg">
              Aktürk Kuyumculuk; Trabzon hasırının el işçiliğini, ürüne özel kayıt ve satış sonrası bakım yaklaşımıyla birlikte sunar.
            </p>
          </div>
        </div>
      </header>

      <section className="px-5 py-24 sm:px-9 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto grid max-w-[96rem] gap-14 lg:grid-cols-[0.48fr_0.52fr] lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#ded5c8] lg:sticky lg:top-32 lg:self-start">
            <Image src="/images/instagram/model-set-classic.jpg" alt="Model üzerinde Aktürk Kuyumculuk hasır seti" fill quality={90} sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover object-[50%_47%]" />
          </div>

          <div>
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.28em] text-[#876d3e]">Neden Aktürk?</p>
            <h2 className="mt-5 max-w-[12ch] font-serif text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">Her aşamada aynı özen.</h2>
            <div className="mt-12 border-t border-[#9b8050]/30">
              {values.map((value) => (
                <article key={value.index} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#9b8050]/24 py-8 sm:grid-cols-[4rem_1fr] sm:py-10">
                  <span className="pt-1 font-serif text-sm italic text-[#94743b]">{value.index}</span>
                  <div>
                    <h3 className="font-serif text-3xl tracking-[-0.025em]">{value.title}</h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[#10211e]/58 sm:text-base sm:leading-8">{value.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a1714] px-5 py-20 text-white sm:px-9 sm:py-24 lg:px-14 lg:py-28">
        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[0.63rem] font-bold uppercase tracking-[0.28em] text-[#d7bd7c]">Ürün Kimliği</p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Ürününüzün bilgileri, ihtiyaç duyduğunuzda ulaşılabilir kalır.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/56 sm:text-base sm:leading-8">Ürün veya sertifika koduyla teknik kayıtları kontrol edebilir, doğrulanmış sertifikayı PDF olarak indirebilirsiniz.</p>
          </div>
          <Link href="/sertifika" className="group inline-flex min-h-13 w-fit items-center gap-4 border border-[#d7bd7c]/65 px-7 py-3.5 text-[0.67rem] font-bold uppercase tracking-[0.18em] text-[#e4ce98] transition-colors hover:bg-[#d7bd7c] hover:text-[#0a1714]">
            Ürünü Doğrulayın <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[96rem] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-2xl sm:text-3xl">Koleksiyonları yakından inceleyin.</p>
          <Link href="/urunler/bileklik" className="group inline-flex w-fit items-center gap-3 text-[0.67rem] font-bold uppercase tracking-[0.18em] text-[#6f552b]">Koleksiyonlara Git <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>
      </section>
    </div>
  );
}
