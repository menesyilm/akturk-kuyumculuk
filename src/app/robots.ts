import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/giris'],
      },
    ],
    sitemap: 'https://www.akturkkuyumculuk.com/sitemap.xml',
  };
}
