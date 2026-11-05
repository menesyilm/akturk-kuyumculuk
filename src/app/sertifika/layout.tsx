import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sertifika Doğrulama',
  description: 'Aktürk Kuyumculuk ürün, sertifika, takip veya kazıma kodunuzu güvenle doğrulayın.',
  alternates: {
    canonical: '/sertifika',
  },
};

export default function CertificateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
