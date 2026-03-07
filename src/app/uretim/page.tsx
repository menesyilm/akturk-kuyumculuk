"use client";

import { Flame, Cog, TestTube, Hammer, Sparkles, Medal } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Uretim() {
  const productionSteps = [
    {
      icon: Flame,
      title: 'Eritme Aşaması',
      description: 'Üretimde kullanılan altın, saflık ve kalite standartlarına uygun alaşım oranlarıyla hazırlanır. Altın, 1064–1150°C aralığında özel eritme ocaklarında kontrollü şekilde eritilir. Bu aşamada homojen yapı elde edilmesi sağlanır ve altın, üretime hazır hale getirilir.',
      temp: '1064-1150°C',
    },
    {
      icon: Cog,
      title: 'Silindir Makinesi',
      description: 'Elde edilen altın çubuklar, silindir makinelerinde kademeli olarak inceltilir. Bu işlem sayesinde altın, ürün tasarımına uygun ölçü ve kalınlığa getirilir. Silindirleme süreci, metalin dayanıklılığını ve form bütünlüğünü koruyacak şekilde gerçekleştirilir.',
      detail: '8mm → 1.2mm',
    },
    {
      icon: Flame,
      title: 'Tav Fırını',
      description: 'İnceltme sonrası altın, 700°C sıcaklıkta tav fırınında kontrollü olarak yumuşatılır. Bu işlem, metalin esnekliğini artırarak sonraki aşamalarda form verme işlemlerinin kusursuz şekilde yapılmasını sağlar.',
      temp: '700°C',
    },
    {
      icon: Cog,
      title: 'Haddeli Tel Makinesi',
      description: 'Yumuşatılan altın teller, haddeli tel makinelerinde mikron hassasiyetinde inceltilir. 1,2 mm kalınlığındaki altın tel, yaklaşık 31 mikron seviyesine kadar düşürülerek ürün formuna uygun hale getirilir. Bu aşama, ürünün estetik ve dayanıklılık dengesini belirleyen kritik süreçlerden biridir.',
      detail: '1.2mm → 31 micron',
    },
    {
      icon: TestTube,
      title: 'Laboratuvar Analizi',
      description: 'Üretim süreci tamamlanan altın teller ve ürünler, yetkili laboratuvarlarda analiz edilir. Altın ayarı, saflık oranı ve teknik değerler test edilerek sertifikalandırılır. Laboratuvar sonuçları, ürün kimliği ve seri numarasıyla sistemimize kaydedilir.',
      detail: 'Sertifikalı Ayar Kontrolü',
    },
    {
      icon: Hammer,
      title: 'Usta İşçiliği',
      description: 'Tüm teknik aşamaların ardından ürünler, deneyimli ustalarımızın el işçiliğiyle son haline getirilir. Her parça; form, simetri, estetik ve konfor açısından titizlikle kontrol edilir. Bu aşamada ürün, Aktürk Kuyumculuk kalite standartlarına uygun hale getirilir.',
      detail: 'El İşçiliği',
    },
  ];

  const workshopSteps = [
    {
      icon: Hammer,
      title: 'Tokmak ve Form Verme',
      description: 'Ürün üzerindeki tel birleşim noktaları ve detaylar, ustalarımız tarafından hassas şekilde şekillendirilir. Tokmaklama işlemi, ürünün dengeli ve sağlam bir form kazanmasını sağlar.',
    },
    {
      icon: Cog,
      title: 'Presleme',
      description: 'Ürün, pres makinelerinde kontrollü basınç altında şekillendirilir. Bu işlem, tel ve yüzeylerin tam uyum sağlaması ve ürün bütünlüğünün artırılması amacıyla uygulanır.',
    },
    {
      icon: Sparkles,
      title: 'Renklendirme',
      description: 'Tüm kalite kontrolleri tamamlandıktan sonra ürün, son teknoloji işlemlerle renklendirilir. Renklendirme sonrası ürün tekrar laboratuvar analizine tabi tutulur ve son kontroller gerçekleştirilir.',
    },
  ];

  return (
    <div className="min-h-screen lg:min-h-[calc(125vh-7.5rem)] bg-brand-black pt-8 pt-12 lg:pt-30 lg:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="text-center pb-8 sm:pb-12 lg:pb-16"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif text-brand-light-gray mb-2 sm:mb-3 lg:mb-4">
            Üretim Süreci
          </h1>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "auto" }}
            viewport={{ once: false, margin: "100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 sm:w-24 lg:w-32 h-0.5 sm:h-1 bg-brand-gold mx-auto mb-3 sm:mb-4 lg:mb-6"
          ></motion.div>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-brand-medium-gray max-w-3xl mx-auto px-4">
            Ham maddeden son ürüne kadar her adım, kontrollü ve izlenebilir bir sistemle yönetilir.
          </p>
        </motion.div>

        {/* Ayar Seçenekleri */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="pb-8 sm:pb-12 lg:pb-16"
        >
          <div className="bg-brand-dark-gray p-4 sm:p-6 lg:p-8 border border-brand-medium-gray">
            <div className="flex items-center justify-center mb-3 sm:mb-4 lg:mb-6">
              <Medal className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-brand-gold mr-2 sm:mr-3 lg:mr-4" />
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-serif text-brand-light-gray">
                Ayar Seçenekleri
              </h2>
            </div>
            <p className="text-brand-medium-gray text-xs sm:text-sm lg:text-base xl:text-lg text-center mb-4 sm:mb-6 lg:mb-8 px-4">
              Ürünlerimiz, müşterilerimizin talebine göre farklı ayarlarda üretilir
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {['22 Ayar', '18 Ayar', '14 Ayar', '8 Ayar'].map((ayar) => (
                <div key={ayar} className="bg-brand-gold p-3 sm:p-4 lg:p-6  sm: text-center">
                  <p className="text-brand-light-gray text-base sm:text-lg lg:text-xl xl:text-2xl font-bold">{ayar}</p>
                </div>
              ))}
            </div>
            <p className="text-brand-medium-gray text-center mt-3 sm:mt-4 lg:mt-6 text-xs sm:text-sm lg:text-base px-4">
              Altın rafinerilerinden ham madde olarak aldığımız has altını laboratuvarda analize tabi tutarak, 
              müşterilerimizden talep edilen ayarı ayarlayıp işleme tabi tutarız.
            </p>
          </div>
        </motion.section>

        {/* Üretim Aşamaları */}
        <section className="pb-8 sm:pb-12 lg:pb-16">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "100px" }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif text-brand-light-gray text-center mb-6 sm:mb-8 lg:mb-12"
          >
            Üretim Süreci
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {productionSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.05, margin: "100px" }}
                  transition={{ duration: 0.5 }}
                  className="bg-brand-dark-gray p-4 sm:p-6 lg:p-8  sm: border border-brand-medium-gray hover:border-brand-gold transition-all duration-300 group relative"
                >
                  {/* Numara Badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-black font-bold text-sm sm:text-base lg:text-xl shadow-lg">
                    {index + 1}
                  </div>
                  
                  <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6 mt-2 sm:mt-3 lg:mt-4">
                    <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-brand-gold group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-serif text-brand-light-gray text-center mb-2 sm:mb-3 lg:mb-4">
                    {step.title}
                  </h3>
                  
                  {(step.temp || step.detail) && (
                    <div className="text-center mb-2 sm:mb-3 lg:mb-4">
                      <span className="inline-block bg-brand-gold text-brand-black px-2 sm:px-3 lg:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {step.temp || step.detail}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-brand-medium-gray text-center leading-relaxed text-xs sm:text-sm lg:text-base">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Atölye Aşaması */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="pb-8 sm:pb-12 lg:pb-16"
        >
          <div className="bg-brand-dark-gray  sm: lg:rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-12 border border-brand-medium-gray">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif text-brand-light-gray text-center mb-6 sm:mb-8 lg:mb-12">
              Atölye Aşaması
            </h2>
            <p className="text-brand-medium-gray text-xs sm:text-sm lg:text-base xl:text-lg text-center mb-6 sm:mb-8 lg:mb-12 max-w-3xl mx-auto px-4">
              Tokmak – Form Verme – Presleme – Renklendirme
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
              {workshopSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "100px" }}
                    transition={{ duration: 0.5 }}
                    className="bg-brand-dark-gray p-3 sm:p-4 lg:p-6  sm: border border-brand-medium-gray"
                  >
                    <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-brand-gold" />
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-serif text-brand-light-gray text-center mb-2 sm:mb-3 lg:mb-4">
                      {step.title}
                    </h3>
                    <p className="text-brand-medium-gray text-center leading-relaxed text-xs sm:text-sm lg:text-base">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-brand-dark-gray  sm: p-4 sm:p-6 lg:p-8 border-l-2 sm:border-l-4 border-brand-gold">
              <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-serif text-brand-light-gray mb-2 sm:mb-3 lg:mb-4">
                Son Aşama ve Kalite Kontrolü
              </h3>
              <p className="text-brand-medium-gray leading-relaxed mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">
                Üretimin son aşamasında kullanılan tüm kilit parçalar ve tasarım detayları yeniden kontrol edilir. 
                Laboratuvar analizlerinden olumlu sonuç alınmasının ardından ürün, üretim onayını alır ve ortalama 3 iş günü içinde teslimata hazır hale getirilir.
              </p>
              <p className="text-brand-medium-gray leading-relaxed mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">
                Bu süreçte;
              </p>
              <ul className="text-brand-medium-gray leading-relaxed mb-2 sm:mb-3 space-y-1 text-xs sm:text-sm lg:text-base">
                <li>• Ürünün hangi usta tarafından üretildiği,</li>
                <li>• Hangi aşamalardan geçtiği ve</li>
                <li>• Analiz raporları</li>
              </ul>
              <p className="text-brand-medium-gray leading-relaxed mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">
                ürün kimliği ve seri numarasıyla sistemimize kayıt altına alınır.
              </p>
              <p className="text-brand-gold leading-relaxed text-xs sm:text-sm lg:text-base font-semibold">
                Müşterilerimiz, bu bilgiler üzerinden ürünlerinin üretim ve analiz detaylarını şeffaf şekilde inceleyebilir.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Ürün Kimliği ve Güvence */}
        <section className="pb-8 sm:pb-12 lg:pb-16">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "100px" }}
              transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
              className="bg-brand-dark-gray p-4 sm:p-6 lg:p-8  sm: border border-brand-gold"
            >
              <div className="flex items-center mb-3 sm:mb-4 lg:mb-6">
                <TestTube className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-brand-gold mr-2 sm:mr-3 lg:mr-4" />
                <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-serif text-brand-light-gray">
                  Ürün Kimliği Sistemi
                </h3>
              </div>
              <p className="text-brand-medium-gray leading-relaxed mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">
                Her ürünümüze özel ürün kimliği numarası ile müşterilerimiz:
              </p>
              <ul className="space-y-2 sm:space-y-3 text-brand-medium-gray">
                <li className="flex items-start text-xs sm:text-sm lg:text-base">
                  <span className="text-brand-gold mr-2 font-bold">✓</span>
                  Ürünün hangi ustalar tarafından üretildiğini görebilir
                </li>
                <li className="flex items-start text-xs sm:text-sm lg:text-base">
                  <span className="text-brand-gold mr-2 font-bold">✓</span>
                  Laboratuvar analiz raporlarına ulaşabilir
                </li>
                <li className="flex items-start text-xs sm:text-sm lg:text-base">
                  <span className="text-brand-gold mr-2 font-bold">✓</span>
                  Ürünün sıfır ve orijinal olduğunu teyit edebilir
                </li>
                <li className="flex items-start text-xs sm:text-sm lg:text-base">
                  <span className="text-brand-gold mr-2 font-bold">✓</span>
                  Sadece kendilerine özel üretildiğini görebilir
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "100px" }}
              transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
              className="bg-brand-dark-gray p-4 sm:p-6 lg:p-8  sm: border border-brand-gold"
            >
              <div className="flex items-center mb-3 sm:mb-4 lg:mb-6">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-brand-gold mr-2 sm:mr-3 lg:mr-4" />
                <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-serif text-brand-light-gray">
                  Kalite Garantisi
                </h3>
              </div>
              <p className="text-brand-medium-gray leading-relaxed mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base">
                Aktürk Kuyumculuk olarak üretimin her aşamasında kaliteyi garanti altına alıyoruz.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-brand-medium-gray">
                <li className="flex items-start text-xs sm:text-sm lg:text-base">
                  <span className="text-brand-gold mr-2 font-bold">✔</span>
                  Sertifikalı laboratuvar analizleri
                </li>
                <li className="flex items-start text-xs sm:text-sm lg:text-base">
                  <span className="text-brand-gold mr-2 font-bold">✔</span>
                  Ayar garantisi ve belgelendirme
                </li>
                <li className="flex items-start text-xs sm:text-sm lg:text-base">
                  <span className="text-brand-gold mr-2 font-bold">✔</span>
                  Uzman usta kadrosu ile üretim
                </li>
                <li className="flex items-start text-xs sm:text-sm lg:text-base">
                  <span className="text-brand-gold mr-2 font-bold">✔</span>
                  Ömür boyu bakım ve onarım desteği
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="text-center bg-brand-dark-gray p-6 sm:p-8 lg:p-12 mb-8 border-2 border-brand-gold"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-brand-light-gray mb-3 sm:mb-4 lg:mb-6">
            Sizin İçin Üretiyoruz
          </h2>
          <p className="text-brand-medium-gray text-xs sm:text-sm lg:text-base xl:text-lg max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8 px-4">
            Her bir ürünümüz, geleneksel ustalık ve modern teknolojinin birleşimiyle hayat buluyor. 
            Yaşayan efsanenizi bizimle yaratın, nesilden nesile aktarın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="tel:05312831934" 
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 btn-primary text-xs sm:text-base"
            >
              Bizi Arayın
            </a>
            <Link
              href="/urunler/bileklik"
              className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 btn-primary text-xs sm:text-base"
            >
              Ürünleri İnceleyin
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
