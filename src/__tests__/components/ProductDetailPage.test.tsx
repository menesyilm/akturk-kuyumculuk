import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getDoc } from 'firebase/firestore';
import ProductDetailPage from '@/components/ProductDetailPage';

const pushMock = jest.fn();
const routerMock = { push: pushMock };

jest.mock('@/lib/firebaseDb', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((_db: unknown, collectionName: string, id: string) => ({ collectionName, id })),
  getDoc: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'urun-1' }),
  useRouter: () => routerMock,
}));
jest.mock('@/components/ImageWithLoader', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));

const productSnapshot = {
  id: 'urun-1',
  exists: () => true,
  data: () => ({
    name: 'Klasik Hasır Bileklik',
    image: 'https://example.com/bileklik.jpg',
    description: 'El işçiliği ürün.',
  }),
};

describe('ProductDetailPage', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    document.body.style.overflow = '';
  });

  test('closes the lightbox with Escape and restores focus to its trigger', async () => {
    jest.mocked(getDoc).mockResolvedValue(productSnapshot as never);

    render(<ProductDetailPage collectionName="bileklik" collectionTitle="Bileklik" />);

    await screen.findByRole('heading', { name: 'Klasik Hasır Bileklik' });
    const imageTrigger = screen.getByRole('button', { name: /1\. görselini büyüt/i });
    imageTrigger.focus();
    fireEvent.click(imageTrigger);

    expect(screen.getByRole('dialog', { name: /klasik hasır bileklik görseli/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /görseli kapat/i })).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(imageTrigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });

  test('shows a load error and retries the product request', async () => {
    const mockedGetDoc = jest.mocked(getDoc);
    mockedGetDoc
      .mockRejectedValueOnce(new Error('network unavailable'))
      .mockResolvedValueOnce(productSnapshot as never);

    render(<ProductDetailPage collectionName="bileklik" collectionTitle="Bileklik" />);

    const errorPanel = await screen.findByRole('alert');
    expect(errorPanel).toHaveTextContent(/ürün şu anda yüklenemiyor/i);
    expect(pushMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /yeniden dene/i }));

    expect(await screen.findByRole('heading', { name: 'Klasik Hasır Bileklik' })).toBeInTheDocument();
    await waitFor(() => expect(mockedGetDoc).toHaveBeenCalledTimes(2));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
