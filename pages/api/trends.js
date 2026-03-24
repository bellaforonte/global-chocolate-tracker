export default async function handler(req, res) {
  try {
    const products = require('../../public/products.json');
    
    const trends = {
      by_category: {},
      by_country: {},
    };
    
    products.forEach(p => {
      if (p.category) {
        trends.by_category[p.category] = (trends.by_category[p.category] || 0) + 1;
      }
      if (p.country) {
        trends.by_country[p.country] = (trends.by_country[p.country] || 0) + 1;
      }
    });
    
    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load trends' });
  }
}
