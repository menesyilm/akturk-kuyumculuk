import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Firebase Firestore mock
const mockGetDocs = jest.fn();

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: (...args: any[]) => mockGetDocs(...args),
    deleteDoc: jest.fn(),
    doc: jest.fn(),
}));

// Firebase Auth mock
jest.mock('firebase/auth', () => ({
    signOut: jest.fn(),
}));

// Firebase config mock
jest.mock('@/lib/firebase', () => ({
    db: {},
    auth: {},
}));

// useAuth mock
jest.mock('@/hooks/useAuth', () => ({
    __esModule: true,
    default: () => ({
        user: {
            email: 'admin@test.com',
        },
        loading: false,
    }),
}));

// router mock
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// next/image mock
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

// ConfirmPopup mock
jest.mock('@/components/ConfirmPopup', () => {
    return function MockConfirmPopup() {
        return <div data-testid="confirm-popup" />;
    };
});

import AdminPage from '@/app/admin/page';

describe('Admin Page', () => {
    beforeEach(() => {
        mockGetDocs.mockResolvedValue({
            forEach: jest.fn(), // boş koleksiyon döndür
        });
    });

    test('renders admin panel title', async () => {
        render(<AdminPage />);

        expect(
            await screen.findByText('Admin Paneli')
        ).toBeInTheDocument();
    });

    test('renders user email', async () => {
        render(<AdminPage />);

        expect(
            await screen.findByText(/admin@test.com/i)
        ).toBeInTheDocument();
    });

    test('renders add product button', async () => {
        render(<AdminPage />);

        expect(
            await screen.findByRole('link', {
                name: /\+ yeni ürün ekle/i,
            })
        ).toBeInTheDocument();
    });

    test('renders logout button', async () => {
        render(<AdminPage />);

        expect(
            await screen.findByRole('button', {
                name: /çıkış yap/i,
            })
        ).toBeInTheDocument();
    });

    test('renders statistics cards', async () => {
        render(<AdminPage />);

        expect(
            await screen.findByText('Toplam Ürün')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Kategori Sayısı')
        ).toBeInTheDocument();
    });

    test('renders empty products message', async () => {
        render(<AdminPage />);

        expect(
            await screen.findByText('Henüz ürün eklenmemiş')
        ).toBeInTheDocument();

        expect(
            screen.getByText('İlk ürününüzü ekleyerek başlayın')
        ).toBeInTheDocument();
    });
});