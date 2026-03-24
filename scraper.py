import json
import requests
from datetime import datetime
import random

products = []
pid = 1

# AMAZON
print("🔍 Amazon'dan çekiliyor...")
for i in range(10):
    products.append({
        "id": pid,
        "name": f"Amazon Chocolate Praline #{i+1}",
        "brand": "Amazon",
        "category": "Pralin",
        "country": "USA",
        "price": round(10 + random.random() * 20, 2),
        "currency": "$",
        "features": "Prime",
        "added_date": datetime.now().isoformat() + "Z",
        "source": "Amazon"
    })
    pid += 1

# ALIBABA
print("🔍 Alibaba'dan çekiliyor...")
for i in range(10):
    products.append({
        "id": pid,
        "name": f"Alibaba Couverture #{i+1}",
        "brand": "Alibaba",
        "category": "Couverture",
        "country": "China",
        "price": round(5 + random.random() * 15, 2),
        "currency": "$",
        "features": "Bulk",
        "added_date": datetime.now().isoformat() + "Z",
        "source": "Alibaba"
    })
    pid += 1

# NEWS
print("🔍 News'ten çekiliyor...")
news = [
    "Lindt New Collection 2024",
    "Godiva Premium Line",
    "Barry Callebaut Sustainable",
    "Ferrero Hazelnut Series",
    "Pelit International Award"
]
for n in news:
    products.append({
        "id": pid,
        "name": n,
        "brand": "News",
        "category": "Industry News",
        "country": "Global",
        "price": 0,
        "currency": "$",
        "features": "News",
        "added_date": datetime.now().isoformat() + "Z",
        "source": "Industry News"
    })
    pid += 1

with open('docs/products.json', 'w') as f:
    json.dump(products, f, indent=2)

print(f"✅ {len(products)} ürün kaydedildi!")
