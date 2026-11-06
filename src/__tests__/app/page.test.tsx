import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import type { PropsWithChildren } from 'react';

jest.mock('@/components/ProductGallery', () => {
  return function MockProductGallery() {
    return <div data-testid="product-gallery">Product Gallery</div>;
  };
});

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, whileInView, viewport, ...safeProps } = props;
      void initial;
      void animate;
      void transition;
      void whileInView;
      void viewport;
      return <div {...safeProps}>{children}</div>;
    },
    article: ({ children, ...props }: PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, whileInView, viewport, ...safeProps } = props;
      void initial;
      void animate;
      void transition;
      void whileInView;
      void viewport;
      return <article {...safeProps}>{children}</article>;
    },
  },
}));

describe('Home Page', () => {
  test('renders the live product gallery', () => {
    render(<Home />);
    expect(screen.getByTestId('product-gallery')).toBeInTheDocument();
  });

  test('renders the primary hero actions', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/el işçiliğinin\s+altın hâli/i);
    expect(screen.getByRole('link', { name: 'Koleksiyonları İncele' })).toHaveAttribute('href', '/urunler/bileklik');
    expect(screen.getAllByRole('link', { name: 'Sertifika Doğrula' })[0]).toHaveAttribute('href', '/sertifika');
  });

  test('renders all collection entrances', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /bileklik/i })).toHaveAttribute('href', '/urunler/bileklik');
    expect(screen.getByRole('link', { name: /kolye/i })).toHaveAttribute('href', '/urunler/kolye');
    expect(screen.getByRole('link', { name: /yüzük ve küpe/i })).toHaveAttribute('href', '/urunler/yuzukvekupe');
    expect(screen.getByRole('link', { name: /set takım/i })).toHaveAttribute('href', '/urunler/set');
  });

  test('renders the complete design-to-identity journey', () => {
    render(<Home />);
    const journey = screen.getByTestId('craft-journey');
    expect(within(journey).getByRole('heading', { name: 'Önce karakteri çizilir.' })).toBeInTheDocument();
    expect(within(journey).getByRole('heading', { name: 'Sonra elle tamamlanır.' })).toBeInTheDocument();
    expect(within(journey).getByRole('heading', { name: 'Ve yalnızca ona ait bir kayıt oluşur.' })).toBeInTheDocument();
    expect(within(journey).getByText('Ürüne özel kazıma kodu')).toBeInTheDocument();
  });

  test('renders three assurance layers', () => {
    render(<Home />);
    const list = screen.getByTestId('assurance-list');
    expect(within(list).getAllByRole('article')).toHaveLength(3);
    expect(within(list).getByText('Kendine özgü üretim')).toBeInTheDocument();
    expect(within(list).getByText('Şeffaf teknik kayıt')).toBeInTheDocument();
    expect(within(list).getByText('Doğrulanabilir kimlik')).toBeInTheDocument();
  });

  test('links the product identity story to certificate verification', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: 'Ürün kimliğini doğrula' })).toHaveAttribute('href', '/sertifika');
    expect(screen.getByRole('link', { name: /sertifika doğrulamaya git/i })).toHaveAttribute('href', '/sertifika');
  });
});
