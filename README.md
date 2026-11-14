# Aktürk Kuyumculuk | Jewelry E-Commerce Platform

## English

Akturk Kuyumculuk is a modern jewelry web application. The project focuses on core needs such as a product showcase, category-based product listing, product detail pages, an admin panel, and live gold price integration.

### Project Overview
- Responsive experience across mobile, tablet, and desktop
- Category-based product browsing (bracelets, necklaces, sets, rings and earrings)
- Secure admin login with Firebase Authentication
- Product data management with Firebase Firestore
- Image upload and media management via Cloudinary
- Live gold prices through Gold API integration

### Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Firebase (Auth + Firestore)
- Cloudinary

## Türkçe

Aktürk Kuyumculuk, modern bir kuyumculuk web uygulamasıdır. Proje; ürün vitrini, kategori bazlı ürün listeleme, ürün detay sayfaları, admin paneli ve anlık altın fiyatı entegrasyonu gibi temel ihtiyaçlara odaklanır.

### Proje Özeti
- Mobil, tablet ve masaüstü cihazlarla uyumlu responsive yapı
- Kategori bazlı ürün gezintisi (bileklik, kolye, set, yüzük ve küpe)
- Firebase Authentication ile korunan admin girişi
- Firebase Firestore üzerinden ürün verisi yönetimi
- Cloudinary ile görsel yükleme ve medya yönetimi
- Gold API entegrasyonu ile güncel altın fiyatları

### Teknolojiler
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Firebase (Auth + Firestore)
- Cloudinary

### Windows'ta Kurulum

Gereksinim: Node.js 22.

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Ardından `http://localhost:3000` adresini açın. Üretim kontrolü için:

```powershell
npm run check
```

Bu komut adımları sırayla çalıştırır: özel anahtar taraması, Firestore yetki regresyon kontrolü, lint denetimi, tek işçili testler ve üretim derlemesi. Aynı kalite kapısı her pull request ve `main` güncellemesinde GitHub Actions üzerinde otomatik uygulanır.

### Güvenlik

- `.env.local` ve özel anahtarlar GitHub'a yüklenmez.
- `.env.example` yalnızca tarayıcı uygulamasında zaten kullanılan herkese açık Firebase kimliklerini ve Cloudinary yükleme ayarını içerir.
- `CLOUDINARY_API_SECRET`, özel API anahtarları ve parolalar kaynak koduna veya `NEXT_PUBLIC_*` değişkenlerine eklenmemelidir.
- Firestore yazma işlemleri yalnızca `kuyumculukakturk@gmail.com` yönetici hesabına açıktır.
- Çevrimiçi sertifika kayıtlarında müşteri, iletişim, ödeme ve satış tutarı bilgileri tutulmaz.

### Sertifika Doğrulama

`/sertifika` sayfası ürün kodu, sertifika numarası, alt ürün kodu veya kazıma koduyla sorgulama yapar. Doğrulanmış kayıtlarda teknik ürün bilgileri, ürün görseli, QR doğrulama bağlantısı ve indirilebilir PDF sertifika sunulur. Set ve toptan satış belgelerinde her fiziksel ürün kendi takip ve kazıma koduyla listelenir.

### Renk Paledi | Color Palette
<img width="1918" height="518" alt="image" src="https://github.com/user-attachments/assets/119a93b3-1da7-49da-85b8-05e556666f68" />

### Ekran Görüntüleri | Screenshots
<img width="1900" height="856" alt="image" src="https://github.com/user-attachments/assets/28c95689-d71e-4024-a94f-a0c1905e7347" />
<img width="1893" height="846" alt="image" src="https://github.com/user-attachments/assets/a89da378-60b6-43ca-9513-24d1af32c5ab" />
<img width="1898" height="865" alt="image" src="https://github.com/user-attachments/assets/dfc17aae-fd6c-4a3f-874d-5d16bd438f57" />
<img width="1881" height="816" alt="image" src="https://github.com/user-attachments/assets/e4800591-9ab1-4019-9b2b-39a8ed281ae4" />






 
