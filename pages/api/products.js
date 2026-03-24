export default async function handler(req, res) {
  try {
    const products = require('../../public/products.json');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load products' });
  }
}
