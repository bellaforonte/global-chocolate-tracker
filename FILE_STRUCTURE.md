# 📦 Global Chocolate Tracker - Dosya Yapısı

## 🎯 Proje Özeti
Dünyadaki yeni çikolata ürünlerini otomatik olarak takip eden, web tabanında çalışan tam entegre sistem.

---

## 📂 Dosya Listesi ve Açıklamaları

### 🔧 Backend (Python)

#### `scraper.py`
- **Amaç**: Web scraping + SQLite database yönetimi
- **İşlevi**: 
  - Amazon, Alibaba'dan ürün çekme
  - Ürünleri kategorize etme
  - SQLite veritabanına kaydetme
  - Trend analizi
- **Çalıştırma**: `python scraper.py`
- **Çıktı**: `chocolate_tracker.db` (SQLite database)

### 🎨 Frontend (React/Next.js)

#### `dashboard.jsx`
- **Amaç**: Tarayıcı dashboard arayüzü
- **Özellikleri**:
  - 📋 Yeni ürünler tablosu (sortable)
  - 📊 Kategori ve ülke grafikleri
  - 🔍 Gelişmiş filtreler (arama, kategori, ülke, fiyat)
  - 🔄 "Güncelle" butonu
  - 🇹🇷 Türkçe UI
- **Bağımlılıklar**: React, Recharts
- **Port**: 3000 (lokal), Vercel URL'si (production)

### 🌐 API Handlers (Node.js)

#### `api-handlers.js`
- **Amaç**: Vercel serverless functions
- **Endpoint'ler**:
  - `GET /api/products` → Tüm ürünleri döndür
  - `GET /api/trends` → Trend verisi (kategori, ülke, fiyat)
  - `POST /api/update` → Scraping işini tetikle
- **Çalıştırma**: Vercel'de otomatik

### ⚙️ Konfigürasyon

#### `vercel.json`
- **Amaç**: Vercel deployment ayarları
- **İçeriği**:
  - Build command
  - Environment variables
  - Cron jobs (otomatik güncelleme)
  - API rate limiting
  - Redirect rules

#### `package.json`
- **Amaç**: Node.js bağımlılıkları
- **Bağımlılıklar**: next, react, recharts, sqlite3
- **Scripts**:
  - `npm run dev` → Lokal geliştirme
  - `npm run build` → Production build
  - `npm run scrape` → Python scraper çalıştır

#### `requirements.txt`
- **Amaç**: Python bağımlılıkları
- **Paketler**: requests, beautifulsoup4, lxml

### 📚 Dokümantasyon

#### `README.md`
- **Amaç**: Detaylı proje dokümantasyonu
- **İçeriği**:
  - Proje özeti
  - Kurulum adımları
  - Veri güncelleme yöntemleri
  - API dokümantasyonu
  - Troubleshooting
  - Database schema

#### `QUICKSTART.md`
- **Amaç**: Hızlı başlangıç rehberi
- **İçeriği**:
  - 5 adımda kurulum
  - GitHub + Vercel setup
  - Lokal test
  - Uyarılar ve sorun giderme

#### `github-setup.sh`
- **Amaç**: GitHub repository otomatik setup
- **İşlevi**:
  - Klasör yapısı oluşturma
  - .gitignore oluşturma
  - GitHub Actions workflow oluşturma
  - Git initialize ve initial commit

### 📊 Database

#### `chocolate_tracker.db` (Otomatik oluşturulur)
- **Amaç**: SQLite veritabanı
- **Tablolar**:
  - `products`: Tüm ürün verileri
  - `categories`: Ürün kategorileri
  - `countries`: Ülke listesi
  - `trends`: Trend verisi (tarih bazında)
- **Oluşturucu**: `scraper.py`

#### `products.json` (Otomatik oluşturulur)
- **Amaç**: Frontend'de dashboard'a veriye erişim
- **Format**: JSON array (tüm ürünler)
- **Oluşturucu**: `scraper.py` (export_json method)

---

## 🔄 Veri Akışı

```
1. scraper.py çalışır
   ↓
2. Amazon, Alibaba'dan veri çeker
   ↓
3. Verileri işler ve kategorize eder
   ↓
4. SQLite database'e kaydeder (chocolate_tracker.db)
   ↓
5. JSON export eder (products.json)
   ↓
6. Dashboard (dashboard.jsx) API'den veri çeker
   ↓
7. Tarayıcıda gösterir
   ↓
8. Kullanıcı filtre + arama yapabilir
```

---

## 🚀 Deployment Akışı

```
GitHub Repository (bellaforonte/global-chocolate-tracker)
   ↓
git push origin main
   ↓
GitHub Actions Triggered
   ↓
- Node dependencies yükle
- Python dependencies yükle
- Scraper çalıştır
   ↓
Vercel Deploy
   ↓
- Build: next build
- API handlers deploy (serverless)
- Static files deploy (public/)
   ↓
Live URL: https://global-chocolate-tracker.vercel.app
```

---

## 📋 Dosya Boyutları (Tahmini)

| Dosya | Boyut | Açıklama |
|-------|-------|----------|
| scraper.py | ~8 KB | Backend script |
| dashboard.jsx | ~12 KB | React component |
| api-handlers.js | ~4 KB | API routes |
| vercel.json | ~1 KB | Deployment config |
| package.json | ~2 KB | Node dependencies |
| requirements.txt | ~0.5 KB | Python dependencies |
| README.md | ~5 KB | Dokümantasyon |
| **chocolate_tracker.db** | **~500 KB** | Database (binari) |
| **products.json** | **~200 KB** | Export data |

---

## 🔐 Güvenlik Düşünceleri

### ✅ Yapılan
- .gitignore ile hassas dosyaları hariç tutma
- Environment variables için Vercel secrets
- Database dosyası .gitignore'da

### ⚠️ Yapılacak
- API rate limiting
- CORS policy setup
- Input validation (scraper)
- Database şifreleme (production)

---

## 🛠️ Teknik Stack

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React 18, Next.js 14 |
| **Visualisasi** | Recharts (Bar, Pie, Line charts) |
| **Backend** | Node.js 18, Python 3.11 |
| **Scraping** | BeautifulSoup4, Requests |
| **Database** | SQLite (lokal), PostgreSQL (production) |
| **Hosting** | Vercel (Serverless) |
| **VCS** | GitHub |
| **CI/CD** | GitHub Actions |

---

## 📞 Dosya Yönetimi

### Eklemeler
Yeni özellik eklemek için:
1. `scraper.py`'ye yeni scraping source
2. `dashboard.jsx`'e yeni UI component
3. `api-handlers.js`'e yeni endpoint
4. `README.md`'ye dokümantasyon

### Güncellemeler
Her değişiklik:
1. Git commit
2. GitHub push
3. GitHub Actions otomatik çalışır
4. Vercel otomatik deploy

### Silmeler
⚠️ **Sakın silme:**
- `scraper.py` (ana backend)
- `dashboard.jsx` (ana UI)
- `vercel.json` (deployment config)
- `package.json` (dependencies)

---

## ✅ Checklist

- [x] Python scraper yazıldı
- [x] React dashboard yazıldı
- [x] API handlers yazıldı
- [x] Vercel config yazıldı
- [x] Package dependencies hazır
- [x] Dokümantasyon tamamlandı
- [ ] GitHub'da repository oluştur
- [ ] Vercel'de deploy et
- [ ] Lokal'de test et
- [ ] İlk veri çekişini çalıştır

---

**Hazır mısın? Başlayabiliriz!** 🚀
