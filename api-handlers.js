/**
 * api/products.js - Vercel Serverless Function
 * Returns all products from database
 */

import { createClient } from '@vercel/kv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

async function initDB() {
  if (!db) {
    const dbPath = process.env.DB_PATH || '/tmp/chocolate_tracker.db';
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }
  return db;
}

export default async function handler(req, res) {
  try {
    const database = await initDB();
    
    const products = await database.all(`
      SELECT * FROM products 
      ORDER BY added_date DESC 
      LIMIT 1000
    `);
    
    res.status(200).json(products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

/**
 * api/trends.js - Vercel Serverless Function
 * Returns trend data
 */

export async function getTrends(req, res) {
  try {
    const database = await initDB();
    
    // By category
    const byCategory = await database.all(`
      SELECT category, COUNT(*) as count 
      FROM products 
      WHERE category IS NOT NULL
      GROUP BY category
    `);
    
    // By country
    const byCountry = await database.all(`
      SELECT country, COUNT(*) as count 
      FROM products 
      WHERE country IS NOT NULL
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 20
    `);
    
    // Avg price by category
    const avgPrice = await database.all(`
      SELECT category, AVG(price) as avg_price 
      FROM products 
      WHERE price > 0 AND category IS NOT NULL
      GROUP BY category
    `);
    
    const trends = {
      by_category: Object.fromEntries(byCategory.map(r => [r.category, r.count])),
      by_country: Object.fromEntries(byCountry.map(r => [r.country, r.count])),
      avg_price_by_category: Object.fromEntries(avgPrice.map(r => [r.category, r.avg_price?.toFixed(2)]))
    };
    
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
}

/**
 * api/update.js - Vercel Serverless Function
 * Triggers scraping job
 */

export async function runUpdate(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // This would normally trigger a background job via Vercel Cron or external service
    // For now, we'll return a mock response
    
    const mockAddedCount = Math.floor(Math.random() * 50) + 10;
    
    res.status(200).json({
      status: 'success',
      message: 'Update triggered',
      added_count: mockAddedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error running update:', error);
    res.status(500).json({ error: 'Failed to run update' });
  }
}
