'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import ConfirmPopup from '@/components/ConfirmPopup';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  image: string;
  image2?: string;
  category?: string;
  description?: string;
  collectionName?: string;
  createdAt?: Timestamp;
}

const collections = [
  { name: 'yuzukvekupe', label: 'Yüzük ve Küpe' },
  { name: 'bileklik', label: 'Bileklik' },
  { name: 'kolye', label: 'Kolye' },
  { name: 'set', label: 'Set' },
];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth(true);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletePopup, setDeletePopup] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
    collectionName?: string;
  }>({
    isOpen: false,
    productId: '',
    productName: '',
    collectionName: '',
  });

  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts: Product[] = [];

        for (const col of collections) {
          const querySnapshot = await getDocs(collection(db, col.name));

          querySnapshot.forEach((d) => {
            const data = d.data() as Omit<Product, 'id' | 'collectionName'>;
            allProducts.push({
              id: d.id,
              collectionName: col.name,
              ...data,
            });
          });
        }

        allProducts.sort((a: Product, b: Product) => {
          const aSec = a.createdAt?.seconds ?? 0;
          const bSec = b.createdAt?.seconds ?? 0;
          return bSec - aSec;
        });

        setProducts(allProducts);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleDelete = async (productId: string, productName: string, collectionName?: string) => {
    try {
      setDeletingId(productId);
      const targetCollection = collectionName || 'products';
      await deleteDoc(doc(db, targetCollection, productId));
      setProducts(products.filter(p => p.id !== productId));
      alert('Ürün başarıyla silindi!');
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
      alert('Ürün silinirken bir hata oluştu!');
    } finally {
      setDeletingId(null);
    }
  };

  const openDeletePopup = (productId: string, productName: string, collectionName?: string) => {
    setDeletePopup({
      isOpen: true,
      productId,
      productName,
      collectionName,
    });
  };

  const closeDeletePopup = () => {
    setDeletePopup({
      isOpen: false,
      productId: '',
      productName: '',
      collectionName: '',
    });
  };

  const confirmDelete = () => {
    handleDelete(deletePopup.productId, deletePopup.productName, deletePopup.collectionName);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/giris');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  if (authLoading || !user || loading) {
    return (
      <div className="fixed inset-0 bg-brand-dark-gray flex items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 border-b-4 border-brand-gold mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-brand-light-gray font-medium text-sm sm:text-base">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark-gray py-6 sm:py-8 lg:py-12">
      <div className="max-w-sm sm:max-w-xl lg:max-w-4xl xl:max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Başlık ve Butonlar */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-gold">Admin Paneli</h1>
            <p className="text-white mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
              Hoş geldiniz, {user.email}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
            <Link
              href="/admin/urun-ekle"
              className="flex-1 sm:flex-initial px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 btn-primary text-sm sm:text-base lg:text-lg font-bold text-center"
            >
              + Yeni Ürün Ekle
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-initial px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 btn-warning text-sm sm:text-base lg:text-lg font-bold"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
          {/* Toplam Ürün */}
          <div className="bg-brand-black border-2 border-brand-gold p-3 sm:p-4 lg:p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-medium-gray text-xs sm:text-sm font-medium mb-1">Toplam Ürün</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-gold">{products.length}</p>
              </div>
              <div className="bg-brand-gold bg-opacity-20 p-2 sm:p-2.5 lg:p-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Kategoriler */}
          <div className="bg-brand-black border-2 border-brand-medium-gray p-3 sm:p-4 lg:p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-medium-gray text-xs sm:text-sm font-medium mb-1">Kategori Sayısı</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-light-gray">{collections.length}</p>
              </div>
              <div className="bg-brand-medium-gray bg-opacity-20 p-2 sm:p-2.5 lg:p-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-brand-light-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Ürün Tablosu */}
        {products.length === 0 ? (
          <div className="bg-brand-black border-2 border-brand-gold shadow-2xl p-8 sm:p-10 lg:p-12 text-center">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📦</div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-brand-gold mb-2">
              Henüz ürün eklenmemiş
            </h3>
            <p className="text-brand-light-gray mb-4 sm:mb-6 text-sm sm:text-base">
              İlk ürününüzü ekleyerek başlayın
            </p>
            <Link
              href="/admin/urun-ekle"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-brand-gold text-white hover:bg-brand-dark-gray transition-colors font-bold shadow-lg text-sm sm:text-base"
            >
              Ürün Ekle
            </Link>
          </div>
        ) : (
          <div className="bg-brand-black border-2 border-brand-medium-gray shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-black border-b-2 border-brand-gold">
                  <tr>
                    <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm lg:text-md text-brand-gold uppercase tracking-wider">
                      Ürün
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm lg:text-md text-brand-gold uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="hidden lg:table-cell px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm lg:text-md text-brand-gold uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-right text-xs sm:text-sm lg:text-md text-brand-gold uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-medium-gray">
                  {products.map((product) => (
                    <tr key={product.id} className="bg-white transition-colors">
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 flex-shrink-0 border-2 border-brand-gold overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-2 sm:ml-3 lg:ml-4">
                            <div className="text-xs sm:text-sm lg:text-base font-medium text-brand-medium-gray">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs sm:text-sm font-medium bg-brand-gold text-white rounded">
                          {product.category || 'Diğer'}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="text-xs sm:text-sm text-brand-medium-gray max-w-xs truncate">
                          {product.description || '-'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 sm:gap-3">
                          <Link
                            href={`/admin/urun-duzenle/${product.id}?collection=${product.collectionName}`}
                            className="text-brand-gold hover:text-brand-light-gray transition-colors"
                            title="Düzenle"
                          >
                            <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Link>
                          <button
                            onClick={() => openDeletePopup(product.id, product.name, product.collectionName)}
                            disabled={deletingId === product.id}
                            className="text-red-500 hover:text-red-400 transition-colors"
                            title="Sil"
                          >
                            {deletingId === product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-red-500"></div>
                            ) : (
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      <ConfirmPopup
        isOpen={deletePopup.isOpen}
        onClose={closeDeletePopup}
        onConfirm={confirmDelete}
        title="Ürün Silme Onayı"
        message={`"${deletePopup.productName}" ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        confirmButtonClass="btn-warning"
      />
    </div>
  );
}
