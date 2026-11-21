import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getDocs } from 'firebase/firestore';
import type { ReactNode } from 'react';
import ProductCollectionPage from '@/components/ProductCollectionPage';

jest.mock('@/lib/firebaseDb', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((_db: unknown, collectionName: string) => ({ collectionName })),
  getDocs: jest.fn(),
}));
jest.mock('@/components/ImageWithLoader', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

describe('ProductCollectionPage', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('shows a load error and retries the collection request', async () => {
    const mockedGetDocs = jest.mocked(getDocs);
    mockedGetDocs
      .mockRejectedValueOnce(new Error('network unavailable'))
      .mockResolvedValueOnce({
        docs: [
          {
            id: 'bileklik-1',
            data: () => ({
              name: 'Hasır Bileklik',
              image: 'https://example.com/bileklik.jpg',
            }),
          },
        ],
      } as never);

    render(
      <ProductCollectionPage
        collectionName="bileklik"
        title="Bileklik"
        description="El işçiliği bileklikler."
      />,
    );

    const errorPanel = await screen.findByRole('alert');
    expect(errorPanel).toHaveTextContent(/koleksiyon şu anda yüklenemiyor/i);
    expect(screen.queryByText(/yakında yeni parçalar/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /yeniden dene/i }));

    expect(await screen.findByRole('heading', { name: 'Hasır Bileklik' })).toBeInTheDocument();
    await waitFor(() => expect(mockedGetDocs).toHaveBeenCalledTimes(2));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
