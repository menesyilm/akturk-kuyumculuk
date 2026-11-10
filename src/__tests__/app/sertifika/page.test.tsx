import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import type { PropsWithChildren } from 'react';

const mockGetDocs = jest.fn();
const mockLimit = jest.fn();

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  limit: (...args: unknown[]) => mockLimit(...args),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({ db: {} }));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: PropsWithChildren) => <div>{children}</div>,
  },
}));

import SertifikaPage from '@/app/sertifika/page';

const emptySnapshot = { empty: true, docs: [] };

describe('Sertifika doğrulama sayfası', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, '', '/sertifika');
  });

  test('alt ürün koduyla set sertifikasını ve parça dökümünü gösterir', async () => {
    mockGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: 'STK-261102-001',
          data: () => ({
            certificateStatus: 'active',
            productCode: 'STK-261102-001',
            certificateNumber: 'AKS-TEST-001',
            productName: '22K Sarı Altın Taşlı Set Takım',
            image: '/images/instagram/model-set-classic.jpg',
            productType: 'Set Takım',
            productionDate: '02.11.2026',
            certificateDate: '03.11.2026',
            batchNumber: 'URT-2026-H45-SET',
            physicalCount: 4,
            gram: '40,8',
            ayar: '22K',
            goldColor: 'Sarı',
            stoneType: 'Taşlı Ürün',
            engravingCodesJson: JSON.stringify(['AK2GSQKL']),
            certificatePartsJson: JSON.stringify([
              {
                type: 'Kolye',
                code: 'STK-261102-001-01',
                markCode: 'AK2GSQKL',
                gram: '18,50',
                ayar: '22K',
                color: 'Sarı',
                stone: 'Taşlı Ürün',
              },
            ]),
          }),
        },
      ],
    });

    render(<SertifikaPage />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Doğrulama Kodu'), 'STK-261102-001-01');
    await user.click(screen.getByRole('button', { name: /sorgula/i }));

    expect(await screen.findByText('Sertifika Doğrulandı')).toBeInTheDocument();
    expect(screen.getByText('STK-261102-001')).toBeInTheDocument();
    expect(screen.getByText('STK-261102-001-01')).toBeInTheDocument();
    expect(screen.getAllByText('AK2GSQKL')).toHaveLength(2);
    expect(screen.getByText('18,50 gr / 22K')).toBeInTheDocument();
    expect(screen.getByText('02.11.2026')).toBeInTheDocument();
    expect(screen.getByText('URT-2026-H45-SET')).toBeInTheDocument();
    expect(screen.getByText('22K')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '22K Sarı Altın Taşlı Set Takım' })).toHaveAttribute(
      'src',
      expect.stringContaining('model-set-classic.jpg')
    );
    expect(screen.getByRole('button', { name: /pdf sertifikayı indir/i })).toBeInTheDocument();
  });

  test('hiçbir koleksiyonda bulunmayan kod için açık hata gösterir', async () => {
    mockGetDocs.mockResolvedValue(emptySnapshot);

    render(<SertifikaPage />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Doğrulama Kodu'), 'BULUNAMAYAN-KOD');
    await user.click(screen.getByRole('button', { name: /sorgula/i }));

    expect(await screen.findByText('Kayıt Doğrulanamadı')).toBeInTheDocument();
    expect(screen.getByText(/eşleşen aktif bir ürün veya sertifika kaydı bulunamadı/i)).toBeInTheDocument();
    expect(mockGetDocs).toHaveBeenCalledTimes(5);
    expect(mockLimit).toHaveBeenCalledTimes(5);
    expect(mockLimit).toHaveBeenCalledWith(1);
  });

  test('eski kayıtta üretim tarihini otomatik ürün kodundan gösterir', async () => {
    mockGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: 'BLK-261106-001',
          data: () => ({
            certificateStatus: 'active',
            productCode: 'BLK-261106-001',
            productName: '22K Sarı Altın Bileklik',
            ayar: '22K',
          }),
        },
      ],
    });

    render(<SertifikaPage />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Doğrulama Kodu'), 'BLK-261106-001');
    await user.click(screen.getByRole('button', { name: /sorgula/i }));

    expect(await screen.findByText('Sertifika Doğrulandı')).toBeInTheDocument();
    expect(screen.getByText('06.11.2026')).toBeInTheDocument();
  });
});
