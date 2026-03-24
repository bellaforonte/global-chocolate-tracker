# 🌍 Global Chocolate Tracker

Dünyasının dört bir yanından yeni çikolata ürünlerini otomatik olarak takip eden web uygulaması.

## 📋 Özellikler

- 🔄 **Otomatik Web Scraping** - Amazon, Alibaba, specialty sites'lerden ürün çekme
- 📊 **Trend Analizi** - Kategori, ülke, fiyat analizi
- 🗂️ **Gelişmiş Filtreler** - Arama, kategori, ülke, fiyat aralığı
- 📱 **Responsive Dashboard** - Tarayıcıda her yerden erişim
- 🇹🇷 **Türkçe UI** - Tamamen Türkçe arayüz
- 💾 **SQLite Database** - Tüm verileri güvenli şekilde sakla

## 🚀 Kurulum

### 1. GitHub'da Repository Oluştur

```bash
# GitHub'da yeni repository oluştur: global-chocolate-tracker
# Clone et
git clone https://github.com/bellaforonte/global-chocolate-tracker.git
cd global-chocolate-tracker
```

### 2. Klasör Yapısı

```
global-chocolate-tracker/
├── scraper.py                    # Web scraping script
├── api/
│   ├── products.js              # GET /api/products
│   ├── trends.js                # GET /api/trends
│   └── update.js                # POST /api/update
├── pages/
│   ├── api.js                   # Next.js API routes
│   └── index.js                 # Dashboard page
├── components/
│   └── ChocolateTracker.jsx      # React dashboard component
├── public/
│   └── products.json            # Cached products data
├── vercel.json                  # Vercel config
├── package.json                 # Node dependencies
├── requirements.txt             # Python dependencies
└── README.md                    # Bu dosya
```

### 3. package.json Oluştur

```json
{
  "name": "global-chocolate-tracker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "scrape": "python scraper.py"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0",
    "vercel": "^33.0.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.6"
  }
}
```

### 4. requirements.txt (Python)

```
requests==2.31.0
beautifulsoup4==4.12.2
sqlite3
```

### 5. Vercel Setup

1. **Vercel'e Git
   ```
   https://vercel.com
   ```

2. **GitHub ile bağlan**
   - "GitHub" seç
   - bellaforonte hesabını authorize et

3. **Repository import et**
   - global-chocolate-tracker'ı seç
   - "Import" tıkla

4. **Environment Variables Ekle**
   - Vercel Dashboard → Settings → Environment Variables
   - `DB_PATH`: `/tmp/chocolate_tracker.db`
   - `PYTHON_VERSION`: `3.11`

5. **Deploy et**
   - Otomatik deploy başlar
   - ~2 dakika içinde live olur

## 🔄 Veri Güncelleme

### Lokal'de Test Et

```bash
# Python dependencies yükle
pip install -r requirements.txt

# Scraper çalıştır
python scraper.py

# Tarayıcıda aç
open http://localhost:3000
```

### Vercel'de Otomatik Update

**Opsiyon 1: Manuel Buton (Tavsiye)**
- Dashboard'daki "🔄 Verileri Güncelle" butonunu tıkla
- API endpoint'i backend'i tetikler
- Veri otomatik güncellenir

**Opsiyon 2: Cron Job (İleri)**
- Vercel Cron Jobs kullan (Pro plan)
- Günde 1 kez otomatik çalıştır

**Opsiyon 3: GitHub Actions**
```yaml
# .github/workflows/scrape.yml
name: Daily Scrape
on:
  schedule:
    - cron: '0 12 * * *'  # Günde 12:00'de çalış

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - run: pip install -r requirements.txt
      - run: python scraper.py
      - run: git add .
      - run: git commit -m "Auto-scraped products" || true
      - run: git push
```

## 📊 Dashboard Özellikleri

### Yeni Ürünler Tablosu
- Ürün adı, marka, kategori, ülke, fiyat
- Özellikler (Organik, Vegan, Glutensiz vb.)
- Doğrudan kaynağa link

### Trend Grafikleri
- **Bar Chart**: Kategoriye göre dağılım
- **Pie Chart**: Ülkelere göre yüzdelik payı
- **Stats**: Toplam ürün, kategori, ülke sayısı

### Filtreler
- 🔍 Arama (ürün adı, marka)
- 📦 Kategori (Pralin, Bonbon, Couverture vb.)
- 🌍 Ülke (USA, Germany, France vb.)
- 💰 Fiyat Aralığı

## 🗄️ Database Schema

### products table
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- brand (TEXT)
- category (TEXT)
- country (TEXT)
- price (REAL)
- currency (TEXT)
- weight (TEXT)
- url (TEXT UNIQUE)
- image_url (TEXT)
- description (TEXT)
- features (TEXT)
- allergens (TEXT)
- added_date (TIMESTAMP)
- source (TEXT)
- last_seen (TIMESTAMP)
```

### categories table
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT UNIQUE)
- description (TEXT)
```

### countries table
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT UNIQUE)
- region (TEXT)
```

### trends table
```sql
- id (INTEGER PRIMARY KEY)
- date (DATE)
- category (TEXT)
- country (TEXT)
- product_count (INTEGER)
- avg_price (REAL)
- keyword (TEXT)
```

## 🛠️ Troubleshooting

### "Veri yüklenemedi" Hatası
1. Vercel Dashboard'da logs kontrol et
2. Python dependencies'i yükle: `pip install -r requirements.txt`
3. Lokal'de `python scraper.py` çalıştır

### Scraper Hıca Çalışmıyor
1. Website yapısı değişmiş olabilir → HTML parser'ı güncelle
2. Rate limiting: requests arasında `time.sleep(2)` ekle
3. User-Agent header'ı güncelledikten sonra dene

### Vercel Deploy Başarısız
1. `vercel.json` kontrol et
2. Python version compatibility: `PYTHON_VERSION` env var'ını kontrol et
3. `package.json` dependencies'i yükle: `npm install`

## 📝 API Endpoints

### GET /api/products
Tüm ürünleri döndür (JSON)
```bash
curl https://your-app.vercel.app/api/products
```

### GET /api/trends
Trend verisi (kategori, ülke, ortalama fiyat)
```bash
curl https://your-app.vercel.app/api/trends
```

### POST /api/update
Scraping işini tetikle
```bash
curl -X POST https://your-app.vercel.app/api/update
```

## 🔐 Güvenlik

- ⚠️ **API Rate Limiting**: Vercel'de rate limiting etkinleştir
- 🔒 **Database**: SQLite lokal → production'da PostgreSQL öner
- 🛡️ **CORS**: Güvenilir domain'lerden sadece request'e izin ver

## 📈 Gelecek Geliştirmeler

- [ ] Email notifications (yeni ürünler için)
- [ ] Price tracking (fiyat değişimini izle)
- [ ] Competitor alerts (rakip ürünleri izle)
- [ ] Export features (CSV, PDF)
- [ ] Mobile app
- [ ] PostgreSQL migration

## 👤 Geliştirici

**Bülent Baki** | Pelit Çikolata - Factory & Production Manager

## 📄 Lisans

MIT

---

**Son Güncelleme:** Mart 2026
