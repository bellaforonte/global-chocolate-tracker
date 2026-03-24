# ⚡ Hızlı Başlangıç (5 Adım)

## 1️⃣ GitHub Repository Oluştur

```bash
# GitHub.com'da yeni repository oluştur
# Adı: global-chocolate-tracker
# Visibility: Public (Vercel deploy'u için)
```

## 2️⃣ Dosyaları Repository'ye Yükle

```bash
git clone https://github.com/bellaforonte/global-chocolate-tracker
cd global-chocolate-tracker

# Şu dosyaları ekle:
# - scraper.py
# - dashboard.jsx
# - api-handlers.js
# - vercel.json
# - package.json
# - requirements.txt
# - README.md

git add .
git commit -m "Initial commit: Global Chocolate Tracker"
git push origin main
```

## 3️⃣ Vercel'de Deploy Et

1. **Vercel.com'a git** → Hesap oluştur (GitHub ile)
2. **"New Project"** tıkla
3. **GitHub repository'yi seç** (global-chocolate-tracker)
4. **"Import"** tıkla
5. **Deploy bitmesini bekle** (~2-3 dakika)

## 4️⃣ Lokal'de Test Et (Opsiyonel)

```bash
# Python dependencies
pip install requests beautifulsoup4

# Scraper çalıştır
python scraper.py

# Kontrol et
# chocolate_tracker.db dosyasının oluştuğunu gör
```

## 5️⃣ Vercel'de Kullan

```
https://your-app-name.vercel.app
```

Dashboard'u aç ve **"🔄 Verileri Güncelle"** butonunu tıkla!

---

## 🎯 Ne Çalışıyor?

✅ Database (SQLite) - Vercel temp storage'da  
✅ Web Scraping (Python) - Amazon, Alibaba  
✅ Dashboard (React) - Yeni ürünler, filtrer, grafikler  
✅ API (Node.js) - /api/products, /api/trends, /api/update  

## 🚨 Uyarılar

⚠️ **Temp Storage**: Vercel ücretsiz tier'de `/tmp/` dosyaları deploy başında silinir
- **Çözüm**: Vercel KV (Redis) ekle veya Supabase PostgreSQL kullan

⚠️ **Web Scraping**: Amazon/Alibaba yapısı sık değişir
- **Çözüm**: Scraper'ı düzenli güncelle

⚠️ **Rate Limiting**: Hızlı scraping site'leri bloke edebilir
- **Çözüm**: Request'ler arasında `time.sleep(2)` ekle

---

## 📞 Sonraki Adımlar

1. **Veritabanı Geliştir**: SQLite → Supabase PostgreSQL
2. **Scraper Genişlet**: Daha çok kaynağı ekle
3. **Notifications**: E-mail alerts (yeni ürünler)
4. **Advanced Analytics**: ML-based trend prediction

---

**Sorulu varsa?** GitHub Issues'da açabilirsin!
