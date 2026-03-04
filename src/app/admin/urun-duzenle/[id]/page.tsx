'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import useAuth from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ProductFormData {
  name: string;
  category: string;
  description?: string;
  price?: string;
  renk?: string;
  gram?: string;
  ayar?: string;
  sira?: string;
  productCode?: string;
}

export default function EditProduct() {
  const { user, loading: authLoading } = useAuth(true);
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
  });
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageUrl2, setImageUrl2] = useState<string>('');
  const [collectionName, setCollectionName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    { label: 'Bileklik', value: 'bileklik', collection: 'bileklik' },
    { label: 'Yüzük ve Küpe', value: 'yuzukvekupe', collection: 'yuzukvekupe' },
    { label: 'Kolye', value: 'kolye', collection: 'kolye' },
    { label: 'Set', value: 'set', collection: 'set' },
  ];
  const renkler = [
    { label: 'Yeşil', value: 'yesil', collection: 'yesil' },
    { label: 'Sarı', value: 'sari', collection: 'sari' },
    { label: 'Yeşil/Sarı', value: 'yesil_sari', collection: 'yesil_sari' },
  ];
  const ayarlar = [
    { label: '22K', value: '22K', collection: '22K' },
    { label: '18K', value: '18K', collection: '18K' },
    { label: '14K', value: '14K', collection: '14K' },
    { label: '8K', value: '8K', collection: '8K' },
  ];

  // Ürün verilerini yükle
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      // URL'den collection parametresini al
      const searchParams = new URLSearchParams(window.location.search);
      const collection = searchParams.get('collection') || 'products';
      setCollectionName(collection);
      
      try {
        const docRef = doc(db, collection, productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            category: data.category || '',
            description: data.description || '',
            price: data.price || '',
            renk: data.renk || '',
            gram: data.gram || '',
            ayar: data.ayar || '',
            sira: data.sira || '',
            productCode: data.productCode || '',
          });
          setImageUrl(data.image || '');
          setImageUrl2(data.image2 || '');
        } else {
          setMessage({ type: 'error', text: 'Ürün bulunamadı!' });
        }
      } catch (error) {
        console.error('Ürün yüklenirken hata:', error);
        setMessage({ type: 'error', text: 'Ürün yüklenirken bir hata oluştu!' });
      } finally {
        setFetchLoading(false);
      }
    };

    if (user) {
      fetchProduct();
    }
  }, [productId, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    // @ts-expect-error Cloudinary widget result types are partial; info.secure_url exists when success
    setImageUrl(result.info.secure_url as string);
    setMessage({ type: 'success', text: 'İlk görsel başarıyla yüklendi!' });
  };

  const handleImageUpload2 = (result: CloudinaryUploadWidgetResults) => {
    // @ts-expect-error Cloudinary widget result types are partial; info.secure_url exists when success
    setImageUrl2(result.info.secure_url as string);
    setMessage({ type: 'success', text: 'İkinci görsel başarıyla yüklendi!' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      setMessage({ type: 'error', text: 'Lütfen birinci ürün görselini yükleyin!' });
      return;
    }

    if (!imageUrl2) {
      setMessage({ type: 'error', text: 'Lütfen ikinci ürün görselini yükleyin!' });
      return;
    }

    if (!formData.name) {
      setMessage({ type: 'error', text: 'Ürün adı zorunludur!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Ürün verisini hazırla
      const productData: Record<string, unknown> = {
        name: formData.name,
        category: formData.category,
        image: imageUrl,
        image2: imageUrl2,
        price: formData.price || '',
        renk: formData.renk || '',
        gram: formData.gram || '',
        ayar: formData.ayar || '',
        sira: formData.sira || '',
        productCode: formData.productCode || '',
        updatedAt: Timestamp.now(),
      };

      // Açıklama varsa ekle
      if (formData.description && formData.description.trim() !== '') {
        productData.description = formData.description;
      }

      const docRef = doc(db, collectionName, productId);
      await updateDoc(docRef, productData);
      
      setMessage({ type: 'success', text: 'Ürün başarıyla güncellendi!' });
      
      // 2 saniye sonra admin sayfasına yönlendir
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      setMessage({ type: 'error', text: 'Ürün güncellenirken bir hata oluştu!' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || fetchLoading) {
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
      <div className="max-w-sm sm:max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Mesajlar */}
        {message && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 shadow-lg text-sm sm:text-base ${
              message.type === 'success'
                ? 'bg-green-900 text-green-300 border-2 border-green-600'
                : 'bg-red-900 text-red-300 border-2 border-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border-t-4 border-brand-gold shadow-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Başlık */}
          <div className="mb-3 sm:mb-4">
            <h1 className="text-md sm:text-lg lg:text-xl xl:text-2xl mb-3 sm:mb-4  font-bold text-brand-black">Ürün Düzenle</h1>
            <p className="text-brand-medium-gray mt-1 text-xs sm:text-sm lg:text-base">Ürün bilgilerini güncelleyin</p>
          </div>

          {/* Görseller - Yan Yana */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Görsel 1 */}
            <div>
              <label className="text-md sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-black mb-3 sm:mb-4 block">
                1. Ürün Görseli (Ana Görsel) *
              </label>
              <div className="flex flex-col items-start space-y-2 sm:space-y-3">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={handleImageUpload}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 btn-primary w-full text-xs sm:text-sm lg:text-base"
                    >
                      1. Görseli Değiştir
                    </button>
                  )}
                </CldUploadWidget>
                
                {imageUrl && (
                  <div className="relative w-full h-25 sm:h-30 lg:h-40 xl:h-48">
                    <Image
                      src={imageUrl}
                      alt="Preview 1"
                      fill
                      className="object-cover border-4 border-brand-gold shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-red-700 shadow-lg font-bold text-sm sm:text-base"
                    >
                      ×
                    </button>
                  </div>
                )}
                {imageUrl && (
                  <p className="text-sm lg:text-md xl:text-lg text-green-600 font-medium">✓ 1. Görsel yüklendi</p>
                )}
              </div>
            </div>

            {/* Görsel 2 */}
            <div>
              <label className="text-md sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-black mb-3 sm:mb-4 block">
                2. Ürün Görseli (Hover Görseli) *
              </label>
              <div className="flex flex-col items-start space-y-2 sm:space-y-3">
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={handleImageUpload2}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 btn-primary w-full text-xs sm:text-sm lg:text-base"
                    >
                      2. Görseli Değiştir
                    </button>
                  )}
                </CldUploadWidget>
                
                {imageUrl2 && (
                  <div className="relative w-full h-25 sm:h-30 lg:h-40 xl:h-48">
                    <Image
                      src={imageUrl2}
                      alt="Preview 2"
                      fill
                      className="object-cover border-4 border-brand-gold shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl2('')}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-red-700 shadow-lg font-bold text-sm sm:text-base"
                    >
                      ×
                    </button>
                  </div>
                )}
                {imageUrl2 && (
                  <p className="text-xs sm:text-sm lg:text-md xl:text-lg text-green-600 font-medium">✓ 2. Görsel yüklendi</p>
                )}
              </div>
            </div>
          </div>

          {/* Grid İki Sütun */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Ürün Adı */}
            <div className="md:col-span-2">
              <label className="text-md sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-black mb-3 sm:mb-4 block">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-black border-2 border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                placeholder="Örn: Altın Harf Yüzük"
                required
              />
            </div>

            {/* Ürün Kodu */}
            <div className="md:col-span-2">
              <label className="text-md sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-black mb-3 sm:mb-4 block">
                Ürün Kodu (Sertifika için)
              </label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode || ''}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-black border-2 border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold uppercase"
                placeholder="Örn: AK-12345"
              />
              <p className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2">
                Bu kod, sertifika sayfasında ürün doğrulaması için kullanılacaktır.
              </p>
            </div>

            {/* Kategori */}
            <div className="md:col-span-2">
              <label className="text-md sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-black mb-3 sm:mb-4 block">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-black border-2 border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
            {/* Açıklama */}
          <div>
            <label className="text-md sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-black mb-3 sm:mb-4 block">
              Ürün Açıklaması
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-black border-2 border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              placeholder="Ürün hakkında detaylı açıklama..."
            />
          </div>

          {/* Fiyat Tablosu Bilgileri */}
            <h3 className="text-md sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-black mb-3 sm:mb-4">Tablo Bilgileri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Renk */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-brand-black mb-2">
                  Renk
                </label>
                <select
                  name="renk"
                  value={formData.renk || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-black border-2 border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                >
                  <option value="">Renk Seçin</option>
                  {renkler.map((renk) => (
                    <option key={renk.value} value={renk.label}>
                      {renk.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gram */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-brand-black mb-2">
                  Gram (Sadece Sayı)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    name="gram"
                    value={formData.gram || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-12 text-sm sm:text-base text-black border-2 border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                    placeholder="Örn: 560"
                  />
                  <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-brand-medium-gray font-semibold text-xs sm:text-sm">
                    GR
                  </span>
                </div>
              </div>

              {/* Ayar */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-brand-black mb-2">
                  Ayar
                </label>
                <select
                  name="ayar"
                  value={formData.ayar || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-black border-2 border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                >
                  <option value="">Ayar Seçin</option>
                  {ayarlar.map((ayar) => (
                    <option key={ayar.value} value={ayar.label}>
                      {ayar.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sıra */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-brand-black mb-2">
                  Sıra
                </label>
                <input
                  type="text"
                  name="sira"
                  value={formData.sira || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-black border-2 border-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                  placeholder="Örn: 14K"
                />
              </div>
            </div>



          {/* Submit Butonu */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 lg:gap-4 pt-3 sm:pt-4">
            <Link
              href="/admin"
              className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 btn-warning text-sm sm:text-base lg:text-lg font-bold text-center"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 btn-primary text-sm sm:text-base lg:text-lg font-bold text-center"
            >
              {loading ? '⏳ Güncelleniyor...' : '✓ Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
