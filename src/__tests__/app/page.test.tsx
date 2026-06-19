import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

// ProductGallery componenti oldukça büyük ve kendi içerisinde başka bağımlılıklar içeriyor olabilir.
// Bu testte ProductGallery'nin içeriğini değil, Home sayfasının davranışını test etmek istediğimiz için mock'luyoruz.
jest.mock('@/components/ProductGallery', () => {
    return function MockProductGallery() {
        return <div data-testid="product-gallery">Product Gallery</div>;
    };
});

// Framer Motion animasyonları test ortamında çalışmaz.
// Bu yüzden motion.div'i normal bir div gibi davranacak şekilde mock'luyoruz.
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => (
            <div {...props}>{children}</div>
        ),
    },
}));

describe('Home Page', () => {

    test('renders successfully', () => {

        // Home sayfasını render ediyoruz.
        render(<Home />);

        // Mock'ladığımız ProductGallery sayfada var mı kontrol ediyoruz.
        // Eğer bulunamazsa sayfa düzgün render olmamış demektir.
        expect(screen.getByTestId('product-gallery')).toBeInTheDocument();
    });

    test('renders all feature titles', () => {

        render(<Home />);

        // Kullanıcının ekranda görmesi gereken başlıklar var mı?
        // Eğer herhangi biri silinirse veya yanlış yazılırsa test fail olur.

        expect(screen.getByText('Kalite Garantisi')).toBeInTheDocument();
        expect(screen.getByText('Güvenilir Hizmet')).toBeInTheDocument();
        expect(screen.getByText('Uzman Ekip')).toBeInTheDocument();
        expect(screen.getByText('Özel Tasarım')).toBeInTheDocument();
        expect(screen.getByText('Şeffaf Fiyatlandırma')).toBeInTheDocument();
        expect(screen.getByText('El İşçiliği')).toBeInTheDocument();
    });

    test('renders 6 feature cards', () => {

        render(<Home />);

        // Sayfadaki tüm heading elemanlarını alıyoruz.
        // Feature başlıkları <h3> ile oluşturulduğu için
        // her biri heading olarak algılanır.

        const headings = screen.getAllByRole('heading');

        // Toplam 6 adet feature kartı oluşmuş mu?
        // Eğer biri silinirse veya eksik render edilirse test fail olur.

        expect(headings).toHaveLength(6);
    });

    test('renders feature descriptions', () => {

        render(<Home />);

        // Feature açıklamalarından bazı kritik metinlerin
        // ekranda görünür olduğunu doğruluyoruz.

        expect(
            screen.getByText(/yüksek saflıkta altın/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/güvenilir ve şeffaf hizmet/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/alanında uzman ustalarımızla/i)
        ).toBeInTheDocument();
    });
});