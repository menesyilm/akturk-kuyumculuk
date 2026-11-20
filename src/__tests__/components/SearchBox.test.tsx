import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { getDocs } from 'firebase/firestore';
import SearchBox from '@/components/SearchBox';

jest.mock('@/lib/firebaseDb', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((_db: unknown, category: string) => ({ category })),
  getDocs: jest.fn(async ({ category }: { category: string }) => ({
    docs: [{
      id: `${category}-1`,
      data: () => ({ name: `${category} ürünü`, image: 'https://example.com/product.jpg' }),
    }],
  })),
}));

describe('SearchBox', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
    jest.clearAllMocks();
  });

  test('loads the catalog only after opening search and shares the request between instances', async () => {
    render(
      <>
        <SearchBox />
        <SearchBox />
      </>,
    );

    expect(getDocs).not.toHaveBeenCalled();

    const triggers = screen.getAllByRole('button', { name: 'Ürün ara' });
    fireEvent.click(triggers[0]);

    const dialog = await screen.findByRole('dialog', { name: 'Ürün arama' });
    expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(getDocs).toHaveBeenCalledTimes(4));

    const searchInput = within(dialog).getByRole('textbox', { name: 'Ürün ara' });
    const closeButton = within(dialog).getByRole('button', { name: 'Aramayı kapat' });
    closeButton.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(searchInput).toHaveFocus();

    fireEvent.click(triggers[1]);
    await waitFor(() => expect(screen.getAllByRole('dialog', { name: 'Ürün arama' })).toHaveLength(2));
    expect(getDocs).toHaveBeenCalledTimes(4);
  });
});
