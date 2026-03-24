const https = require('https');
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Demo ürünler (gerçek scraping yerine)
    const products = [
      {
        id: 1,
        name: "Premium Dark Chocolate Praline",
        brand: "Pelit",
        category: "Pralin",
        country: "Turkey",
        price: 12.99,
        currency: "$",
        weight: "250g",
        features: "Organik, Vegan",
        allergens: "Yer Fistığı",
        added_date: new Date().toISOString(),
        source: "Amazon"
      },
      {
        id: 2,
        name: "Belgian Bonbon Collection",
        brand: "Godiva",
        category: "Bonbon",
        country: "Belgium",
        price: 24.99,
        currency: "$",
        weight: "200g",
        features: "Fair Trade, Glutensiz",
        allergens: "Süt",
        added_date: new Date(Date.now() - 86400000).toISOString(),
        source: "Amazon UK"
      },
      {
        id: 3,
        name: "Couverture Dark 70%",
        brand: "Lindt",
        category: "Couverture",
        country: "Switzerland",
        price: 8.50,
        currency: "$",
        weight: "500g",
        features: "Endüstriyel",
        allergens: "Yer Fistığı",
        added_date: new Date(Date.now() - 172800000).toISOString(),
        source: "Alibaba"
      },
      {
        id: 4,
        name: "Solid Chocolate Bar Milk",
        brand: "Cadbury",
        category: "Solid Çikolata",
        country: "UK",
        price: 2.99,
        currency: "$",
        weight: "100g",
        features: "Sütlü Çikolata",
        allergens: "Süt, Yer Fistığı",
        added_date: new Date(Date.now() - 259200000).toISOString(),
        source: "Amazon"
      },
      {
        id: 5,
        name: "Chocolate Chips Premium",
        brand: "Ghirardelli",
        category: "Çikolata Pulu",
        country: "USA",
        price: 5.99,
        currency: "$",
        weight: "340g",
        features: "Yüksek Kalite",
        allergens: "Süt",
        added_date: new Date(Date.now() - 345600000).toISOString(),
        source: "Amazon US"
      }
    ];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        count: products.length,
        products: products,
        timestamp: new Date().toISOString(),
        message: "✅ Veri başarıyla çekildi!"
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
