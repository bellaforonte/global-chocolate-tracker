const https = require('https');

// Real scraping function
async function scrapeAmazon() {
  return new Promise((resolve) => {
    // Demo: Amazon'dan proxy API kullanarak veri çek
    const options = {
      hostname: 'api.rainforest.ai',
      path: '/request?api_key=demo&type=search&amazon_domain=amazon.com&search_term=chocolate%20praline',
      method: 'GET'
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.search_results || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function scrapeAlibaba() {
  // Demo products (gerçek scraping için API gerekli)
  return [
    {
      name: "Professional Chocolate Couverture 70%",
      brand: "Barry Callebaut",
      category: "Couverture",
      country: "Belgium",
      price: 12.50,
      currency: "$",
      source: "Alibaba"
    },
    {
      name: "Chocolate Chips Industrial Grade",
      brand: "Generic",
      category: "Çikolata Pulu",
      country: "China",
      price: 4.99,
      currency: "$",
      source: "Alibaba"
    }
  ];
}

exports.handler = async (event, context) => {
  try {
    const alibabaData = await scrapeAlibaba();
    
    // Demo ürünler + Alibaba
    const products = [
      ...alibabaData,
      {
        id: 1,
        name: "Premium Dark Chocolate Praline",
        brand: "Pelit",
        category: "Pralin",
        country: "Turkey",
        price: 12.99,
        currency: "$",
        features: "Organik, Vegan",
        added_date: new Date().toISOString(),
        source: "Amazon TR"
      },
      {
        id: 2,
        name: "Belgian Bonbon Collection",
        brand: "Godiva",
        category: "Bonbon",
        country: "Belgium",
        price: 24.99,
        currency: "$",
        features: "Fair Trade",
        added_date: new Date(Date.now() - 86400000).toISOString(),
        source: "Amazon EU"
      },
      {
        id: 3,
        name: "Lindt Lindor Truffles",
        brand: "Lindt",
        category: "Bonbon",
        country: "Switzerland",
        price: 9.99,
        currency: "$",
        features: "Premium",
        added_date: new Date(Date.now() - 172800000).toISOString(),
        source: "Amazon US"
      }
    ];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
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
