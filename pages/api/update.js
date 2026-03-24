export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Update triggered',
    added_count: Math.floor(Math.random() * 50) + 10,
    timestamp: new Date().toISOString()
  });
}
