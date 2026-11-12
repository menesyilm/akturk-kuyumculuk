import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';

const contactRows = [
  { icon: MapPin, label: 'Adres', content: 'Kemerkaya Mah. Kunduracılar Cad. Çarşı Sok. Çarşı Han Kat: 2, Ortahisar / Trabzon' },
  { icon: Phone, label: 'Cep Telefonu', content: '+90 531 283 19 34', href: 'tel:+905312831934' },
  { icon: Phone, label: 'Sabit Telefon', content: '+90 462 321 06 68', href: 'tel:+904623210668' },
  { icon: Mail, label: 'E-posta', content: 'kuyumculukakturk@gmail.com', href: 'mailto:kuyumculukakturk@gmail.com' },
];

export default function IletisimPage() {
  return (
    <div className="bg-[#f4f0e8] text-[#10211e]">
      <header className="border-b border-[#9b8050]/25 px-5 py-20 sm:px-9 sm:py-28 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-[96rem]">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#876d3e]">İletişim</p>
          <h1 className="mt-6 max-w-[13ch] font-serif text-[3.35rem] leading-[0.98] tracking-[-0.04em] sm:text-7xl lg:text-[6rem]">Trabzon’da bize ulaşın.</h1>
          <p className="mt-8 max-w-2xl text-[1rem] leading-8 text-[#10211e]/58 sm:text-lg">Ürün, sipariş, bakım veya sertifika işlemleri hakkında telefon, WhatsApp ya da e-posta üzerinden bilgi alabilirsiniz.</p>
        </div>
      </header>

      <section className="px-5 py-20 sm:px-9 sm:py-28 lg:px-14 lg:py-36">
        <div className="mx-auto grid max-w-[96rem] gap-14 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
          <div>
            <p className="text-[0.63rem] font-bold uppercase tracking-[0.28em] text-[#876d3e]">Aktürk Kuyumculuk</p>
            <div className="mt-7 border-t border-[#9b8050]/30">
              {contactRows.map((row) => {
                const Icon = row.icon;
                const content = row.href ? <a href={row.href} className="transition-colors hover:text-[#8b6d39]">{row.content}</a> : row.content;
                return (
                  <div key={row.label} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[#9b8050]/24 py-6">
                    <Icon aria-hidden="true" className="mt-1 h-5 w-5 text-[#9a783f]" />
                    <div>
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.17em] text-[#10211e]/42">{row.label}</p>
                      <div className="mt-2 text-sm leading-7 text-[#10211e]/72 sm:text-base">{content}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <a href="https://wa.me/905312831934" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#0a1714] px-5 py-3 text-[0.63rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#8b6d39]">
                <MessageCircle aria-hidden="true" className="h-4 w-4" /> WhatsApp
              </a>
              <a href="https://maps.google.com/?q=Kemerkaya+Mah.+Kundurac%C4%B1lar+Cad.+%C3%87ar%C5%9F%C4%B1+Sok.+%C3%87ar%C5%9F%C4%B1+Han+Ortahisar+Trabzon" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 border border-[#876d3e]/55 px-5 py-3 text-[0.63rem] font-bold uppercase tracking-[0.16em] text-[#6f552b]">
                <Navigation aria-hidden="true" className="h-4 w-4" /> Yol Tarifi
              </a>
            </div>

            <div className="mt-10 flex items-start gap-4 border-t border-[#9b8050]/30 pt-7">
              <Clock aria-hidden="true" className="mt-1 h-5 w-5 text-[#9a783f]" />
              <p className="text-sm leading-7 text-[#10211e]/58">Hafta içi 09.00—17.00<br />Cumartesi 10.00—16.00<br />Pazar kapalı</p>
            </div>
          </div>

          <div className="relative min-h-[32rem] overflow-hidden border border-[#9b8050]/24 bg-[#ded5c8] lg:min-h-[44rem]">
            <iframe
              title="Aktürk Kuyumculuk haritası"
              src="https://www.google.com/maps/embed?pb=!3m2!1str!2str!4v1761934374301!5m2!1str!2str!6m8!1m7!1s0xgzFnIueSh2jJgg3B_kAQ!2m2!1d41.00639157716616!2d39.72607529600786!3f188.43383259017082!4f-16.690193043676757!5f0.43279263888731334"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale-[15%]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
