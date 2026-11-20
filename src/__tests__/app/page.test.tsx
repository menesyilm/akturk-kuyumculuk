import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import type { PropsWithChildren } from 'react';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, ...safeProps } = props;
      void initial;
      void animate;
      void transition;
      return <div {...safeProps}>{children}</div>;
    },
  },
}));

describe('Home Page', () => {
  test('renders the focused hero and a single primary collection action', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/güvenle takılır,\s*nesillerce aktarılır\./i);
    expect(screen.getByRole('link', { name: 'Koleksiyonları Keşfedin' })).toHaveAttribute('href', '/urunler/bileklik');
    expect(screen.queryByRole('link', { name: 'Sertifika Doğrula' })).not.toBeInTheDocument();
  });

  test('uses the video as a full-bleed stage with centered overlay copy', () => {
    render(<Home />);
    expect(screen.getByTestId('home-hero')).toHaveClass('min-h-[100svh]');
    expect(screen.getByTestId('hero-visual')).toHaveClass('absolute', 'inset-0');
    expect(screen.getByTestId('hero-copy')).toHaveClass('text-center', 'items-center');
  });

  test('keeps the real-product image as a fallback for the process video', async () => {
    const { container } = render(<Home />);
    const hero = screen.getByTestId('hero-visual');
    expect(within(hero).getAllByRole('img')).toHaveLength(1);
    expect(within(hero).getByRole('img', { name: /trabzon hasırı üretim süreci/i })).toBeInTheDocument();
    expect(await within(hero).findByTestId('hero-video')).toHaveAttribute('preload', 'metadata');
    expect(container.querySelector('video[controls]')).not.toBeInTheDocument();
  });

  test('matches every collection title with a relevant model image', () => {
    render(<Home />);
    const expected = [
      ['Bileklik', '/urunler/bileklik'],
      ['Kolye', '/urunler/kolye'],
      ['Yüzük ve Küpe', '/urunler/yuzukvekupe'],
      ['Set Takım', '/urunler/set'],
    ];

    for (const [name, href] of expected) {
      const link = screen.getByRole('link', { name: new RegExp(name, 'i') });
      expect(link).toHaveAttribute('href', href);
      expect(within(link).getByRole('img', { name: new RegExp(name, 'i') })).toBeInTheDocument();
    }
  });

  test('does not place workshop content on the homepage', () => {
    render(<Home />);
    expect(screen.queryByText(/atölye/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/üretim anlayışımız/i)).not.toBeInTheDocument();
  });

  test('keeps product verification available without making it a primary pitch', () => {
    render(<Home />);
    const verificationLink = screen.getByRole('link', { name: 'Ürün Kaydını Sorgulayın' });
    expect(verificationLink).toHaveAttribute('href', '/sertifika');
  });
});
