import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.akturkkuyumculuk.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/urunler/bileklik',
    '/urunler/kolye',
    '/urunler/yuzukvekupe',
    '/urunler/set',
    '/sertifika',
    '/altin-fiyatlari',
    '/uretim',
    '/neden-akturk-kuyumculuk',
    '/iletisim',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/sertifika' ? 0.9 : 0.7,
  }));
}
