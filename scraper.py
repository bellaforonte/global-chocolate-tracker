#!/usr/bin/env python3
"""
Global Chocolate Tracker - Web Scraper & Database Manager
Collects chocolate products from multiple sources and stores in SQLite
"""

import sqlite3
import json
import requests
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import re
import os
from typing import List, Dict, Optional

# Initialize database path
DB_PATH = os.environ.get('DB_PATH', './chocolate_tracker.db')

class ChocolateTracker:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Products table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                brand TEXT,
                category TEXT,
                country TEXT,
                price REAL,
                currency TEXT,
                weight TEXT,
                url TEXT UNIQUE,
                image_url TEXT,
                description TEXT,
                features TEXT,
                allergens TEXT,
                added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                source TEXT,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Categories table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT
            )
        ''')
        
        # Countries table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS countries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                region TEXT
            )
        ''')
        
        # Trends table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trends (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE,
                category TEXT,
                country TEXT,
                product_count INTEGER,
                avg_price REAL,
                keyword TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_product(self, product: Dict) -> bool:
        """Add or update a product in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO products 
                (name, brand, category, country, price, currency, weight, url, 
                 image_url, description, features, allergens, source, last_seen)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                product.get('name'),
                product.get('brand'),
                product.get('category'),
                product.get('country'),
                product.get('price'),
                product.get('currency'),
                product.get('weight'),
                product.get('url'),
                product.get('image_url'),
                product.get('description'),
                product.get('features'),
                product.get('allergens'),
                product.get('source'),
                datetime.now().isoformat()
            ))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error adding product: {e}")
            return False
    
    def scrape_amazon(self, country: str = 'US') -> List[Dict]:
        """Scrape chocolate products from Amazon"""
        products = []
        
        # Amazon URLs by country
        amazon_urls = {
            'US': 'https://www.amazon.com/s?k=praline+chocolate',
            'UK': 'https://www.amazon.co.uk/s?k=praline+chocolate',
            'DE': 'https://www.amazon.de/s?k=praline+schokolade',
            'FR': 'https://www.amazon.fr/s?k=praline+chocolat',
        }
        
        url = amazon_urls.get(country, amazon_urls['US'])
        
        try:
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract products (note: Amazon structure changes, this is a template)
            items = soup.find_all('div', {'data-component-type': 's-search-result'})
            
            for item in items[:5]:  # Limit to 5 per request
                try:
                    name_elem = item.find('h2', {'class': 'a-size-mini'})
                    price_elem = item.find('span', {'class': 'a-price-whole'})
                    link_elem = item.find('a', {'class': 'a-link-normal'})
                    
                    if name_elem and link_elem:
                        product = {
                            'name': name_elem.text.strip(),
                            'brand': 'Amazon',
                            'category': self._categorize_product(name_elem.text),
                            'country': country,
                            'price': float(price_elem.text.replace('$', '').replace(',', '')) if price_elem else None,
                            'currency': '$',
                            'url': 'https://amazon.com' + link_elem.get('href', ''),
                            'source': 'Amazon',
                            'features': self._extract_features(name_elem.text)
                        }
                        products.append(product)
                except Exception as e:
                    print(f"Error parsing Amazon item: {e}")
        
        except Exception as e:
            print(f"Error scraping Amazon {country}: {e}")
        
        return products
    
    def scrape_alibaba(self) -> List[Dict]:
        """Scrape chocolate products from Alibaba"""
        products = []
        
        url = 'https://www.alibaba.com/trade/search?searchText=chocolate+couverture&pageSize=100'
        
        try:
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract products (Alibaba structure)
            items = soup.find_all('a', {'class': 'organic-list-offer'})
            
            for item in items[:3]:  # Limit
                try:
                    title = item.get_text(strip=True)
                    link = item.get('href')
                    
                    if title and 'chocolate' in title.lower():
                        product = {
                            'name': title[:100],
                            'brand': 'Industrial',
                            'category': 'Couverture',
                            'country': 'China',
                            'url': link,
                            'source': 'Alibaba',
                            'features': 'Industrial Grade'
                        }
                        products.append(product)
                except:
                    pass
        
        except Exception as e:
            print(f"Error scraping Alibaba: {e}")
        
        return products
    
    def _categorize_product(self, product_name: str) -> str:
        """Categorize product based on name"""
        name_lower = product_name.lower()
        
        if 'pralin' in name_lower:
            return 'Pralin'
        elif 'bonbon' in name_lower or 'truffle' in name_lower:
            return 'Bonbon'
        elif 'couverture' in name_lower or 'couvertur' in name_lower:
            return 'Couverture'
        elif 'draje' in name_lower or 'dragee' in name_lower:
            return 'Draje'
        elif 'solid' in name_lower or 'tablet' in name_lower:
            return 'Solid Çikolata'
        elif 'pul' in name_lower or 'wafer' in name_lower:
            return 'Çikolata Pulu'
        else:
            return 'Diğer'
    
    def _extract_features(self, product_name: str) -> str:
        """Extract features from product name"""
        features = []
        name_lower = product_name.lower()
        
        if 'organic' in name_lower or 'bio' in name_lower:
            features.append('Organik')
        if 'vegan' in name_lower:
            features.append('Vegan')
        if 'gluten' in name_lower:
            features.append('Glutensiz')
        if 'fair trade' in name_lower:
            features.append('Fair Trade')
        if 'dark' in name_lower or 'bitter' in name_lower:
            features.append('Koyu Çikolata')
        if 'milk' in name_lower or 'sütlü' in name_lower:
            features.append('Sütlü Çikolata')
        
        return ', '.join(features) if features else 'Standart'
    
    def get_new_products(self, days: int = 7) -> List[Dict]:
        """Get products added in last N days"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        cursor.execute('''
            SELECT * FROM products 
            WHERE added_date > ?
            ORDER BY added_date DESC
        ''', (cutoff_date.isoformat(),))
        
        products = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return products
    
    def get_trends(self) -> Dict:
        """Calculate and return trend data"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        trends = {}
        
        # Count by category
        cursor.execute('SELECT category, COUNT(*) as count FROM products GROUP BY category')
        trends['by_category'] = {row['category']: row['count'] for row in cursor.fetchall()}
        
        # Count by country
        cursor.execute('SELECT country, COUNT(*) as count FROM products GROUP BY country ORDER BY count DESC')
        trends['by_country'] = {row['country']: row['count'] for row in cursor.fetchall()}
        
        # Average price by category
        cursor.execute('SELECT category, AVG(price) as avg_price FROM products WHERE price > 0 GROUP BY category')
        trends['avg_price_by_category'] = {row['category']: round(row['avg_price'], 2) for row in cursor.fetchall()}
        
        conn.close()
        return trends
    
    def run_full_update(self):
        """Run complete scraping and update cycle"""
        print(f"[{datetime.now()}] Starting full update...")
        
        all_products = []
        
        # Scrape from different sources
        print("Scraping Amazon (US)...")
        all_products.extend(self.scrape_amazon('US'))
        
        print("Scraping Amazon (UK)...")
        all_products.extend(self.scrape_amazon('UK'))
        
        print("Scraping Amazon (DE)...")
        all_products.extend(self.scrape_amazon('DE'))
        
        print("Scraping Alibaba...")
        all_products.extend(self.scrape_alibaba())
        
        # Add to database
        added_count = 0
        for product in all_products:
            if self.add_product(product):
                added_count += 1
        
        print(f"Added {added_count} products to database")
        print(f"[{datetime.now()}] Update complete!")
        
        return added_count
    
    def export_json(self, output_path: str = './products.json'):
        """Export all products to JSON (for frontend)"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM products ORDER BY added_date DESC')
        products = [dict(row) for row in cursor.fetchall()]
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2, default=str)
        
        conn.close()
        print(f"Exported {len(products)} products to {output_path}")

if __name__ == '__main__':
    tracker = ChocolateTracker()
    tracker.run_full_update()
    tracker.export_json()
    
    # Print trends
    trends = tracker.get_trends()
    print("\n=== TRENDS ===")
    print(f"By Category: {trends['by_category']}")
    print(f"By Country: {trends['by_country']}")
    print(f"Avg Price by Category: {trends['avg_price_by_category']}")
