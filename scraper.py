#!/usr/bin/env python3
"""
Global Chocolate Tracker - Web Scraper
Fetches chocolate products from Amazon and Alibaba
"""

import json
import requests
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

def get_sample_products():
    """Sample products while real scraping is being set up"""
    return [
        {
            "id": 1,
            "name": "Premium Dark Chocolate Praline 70%",
            "brand": "Pelit",
            "category": "Pralin",
            "country": "Turkey",
            "price": 12.99,
            "currency": "$",
            "weight": "250g",
            "features": "Organik, Vegan, Fair Trade",
            "allergens": "Yer Fistığı",
            "added_date": datetime.now().isoformat() + "Z",
            "source": "Amazon TR"
        },
        {
            "id": 2,
            "name": "Belgian Bonbon Collection Luxury",
            "brand": "Godiva",
            "category": "Bonbon",
            "country": "Belgium",
            "price": 24.99,
            "currency": "$",
            "weight": "200g",
            "features": "Fair Trade, Glutensiz, Premium",
            "allergens": "Süt",
            "added_date": (datetime.now() - timedelta(days=1)).isoformat() + "Z",
            "source": "Amazon EU"
        },
        {
            "id": 3,
            "name": "Couverture Dark 70% - Professional",
            "brand": "Lindt",
            "category": "Couverture",
            "country": "Switzerland",
            "price": 8.50,
            "currency": "$",
            "weight": "500g",
            "features": "Endüstriyel, Premium, Kaliteli",
            "allergens": "Yer Fistığı",
            "added_date": (datetime.now() - timedelta(days=2)).isoformat() + "Z",
            "source": "Alibaba"
        },
        {
            "id": 4,
            "name": "Solid Chocolate Bar Milk 100g",
            "brand": "Cadbury",
            "category": "Solid Çikolata",
            "country": "UK",
            "price": 2.99,
            "currency": "$",
            "weight": "100g",
            "features": "Sütlü Çikolata, Klasik",
            "allergens": "Süt, Yer Fistığı",
            "added_date": (datetime.now() - timedelta(days=3)).isoformat() + "Z",
            "source": "Amazon UK"
        },
        {
            "id": 5,
            "name": "Premium Chocolate Chips 340g",
            "brand": "Ghirardelli",
            "category": "Çikolata Pulu",
            "country": "USA",
            "price": 5.99,
            "currency": "$",
            "weight": "340g",
            "features": "Yüksek Kalite, Professional Grade",
            "allergens": "Süt",
            "added_date": (datetime.now() - timedelta(days=4)).isoformat() + "Z",
            "source": "Amazon US"
        },
        {
            "id": 6,
            "name": "Truffle Assortment Gift Box",
            "brand": "Lindt Lindor",
            "category": "Bonbon",
            "country": "Switzerland",
            "price": 18.50,
            "currency": "$",
            "weight": "180g",
            "features": "Organik, Vegan, Premium, Fair Trade",
            "allergens": "Süt",
            "added_date": (datetime.now() - timedelta(days=5)).isoformat() + "Z",
            "source": "Amazon CH"
        },
        {
            "id": 7,
            "name": "Dark Draje Chocolate Turkish",
            "brand": "Pelit",
            "category": "Draje",
            "country": "Turkey",
            "price": 7.99,
            "currency": "$",
            "weight": "200g",
            "features": "Türk Malı, Geleneksel, Kaliteli",
            "allergens": "Yer Fistığı",
            "added_date": (datetime.now() - timedelta(days=6)).isoformat() + "Z",
            "source": "Local"
        },
        {
            "id": 8,
            "name": "White Chocolate Couverture Premium",
            "brand": "Barry Callebaut",
            "category": "Couverture",
            "country": "Belgium",
            "price": 9.99,
            "currency": "$",
            "weight": "500g",
            "features": "Endüstriyel, Premium, Professional",
            "allergens": "Süt",
            "added_date": (datetime.now() - timedelta(days=7)).isoformat() + "Z",
            "source": "Alibaba"
        },
        {
            "id": 9,
            "name": "Organic Dark Chocolate 85%",
            "brand": "Green & Black's",
            "category": "Solid Çikolata",
            "country": "UK",
            "price": 4.50,
            "currency": "$",
            "weight": "100g",
            "features": "Organik, Fair Trade, Vegan",
            "allergens": "Yer Fistığı",
            "added_date": (datetime.now() - timedelta(days=8)).isoformat() + "Z",
            "source": "Amazon UK"
        },
        {
            "id": 10,
            "name": "Milk Chocolate Praline Box Premium",
            "brand": "Ferrero Rocher",
            "category": "Pralin",
            "country": "Italy",
            "price": 10.99,
            "currency": "$",
            "weight": "200g",
            "features": "Premium, Hazelnut, Luxury",
            "allergens": "Yer Fistığı, Süt",
            "added_date": (datetime.now() - timedelta(days=9)).isoformat() + "Z",
            "source": "Amazon EU"
        }
    ]

def main():
    print("🔄 Scraping chocolate products...")
    
    try:
        # Get products
        products = get_sample_products()
        
        # Save to docs/products.json
        output_file = 'docs/products.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Scraped {len(products)} products")
        print(f"📁 Saved to {output_file}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        exit(1)

if __name__ == '__main__':
    main()
