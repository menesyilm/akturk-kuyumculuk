import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

describe('Site metadata routes', () => {
  test('sertifika doğrulama sayfası sitemap içinde yer alır', () => {
    const entries = sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: 'https://www.akturkkuyumculuk.com/sertifika',
          priority: 0.9,
        }),
      ]),
    );
  });

  test('yönetim ve giriş sayfaları arama motorlarına kapatılır', () => {
    const configuration = robots();

    expect(configuration.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          disallow: expect.arrayContaining(['/admin/', '/giris']),
        }),
      ]),
    );
  });
});
