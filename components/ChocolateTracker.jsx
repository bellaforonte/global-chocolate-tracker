import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ChocolateTracker() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  
  const [trends, setTrends] = useState({});
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products when inputs change
  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedCountry, priceRange, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      
      // Extract unique categories and countries
      const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
      const ctrs = [...new Set(data.map(p => p.country).filter(Boolean))];
      setCategories(cats);
      setCountries(ctrs);
      
      // Load trends
      const trendsResponse = await fetch('/api/trends');
      const trendsData = await trendsResponse.json();
      setTrends(trendsData);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Ürünler yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesCountry = !selectedCountry || product.country === selectedCountry;
      const matchesPrice = (product.price || 0) >= priceRange[0] && (product.price || 999999) <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesCountry && matchesPrice;
    });
    
    setFilteredProducts(filtered);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/update', { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        alert(`✅ Güncelleme tamamlandı! ${result.added_count} yeni ürün eklendi.`);
        loadProducts();
      }
    } catch (error) {
      console.error('Error updating:', error);
      alert('❌ Güncelleme başarısız oldu.');
    } finally {
      setUpdating(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCountry('');
    setPriceRange([0, 1000]);
  };

  // Prepare data for charts
  const categoryData = categories.map(cat => ({
    name: cat,
    count: products.filter(p => p.category === cat).length,
    avgPrice: (products.filter(p => p.category === cat).reduce((sum, p) => sum + (p.price || 0), 0) / products.filter(p => p.category === cat).length).toFixed(2)
  }));

  const countryData = countries.slice(0, 10).map(ctry => ({
    name: ctry,
    count: products.filter(p => p.country === ctry).length
  }));

  const COLORS = ['#8B7355', '#A0826D', '#B5A084', '#C9B8A0', '#D4C5B9', '#B8860B', '#DAA520', '#CD853F', '#DEB887', '#D2B48C'];

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#faf8f5', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#3D3D3A' }}>🌍 Global Çikolata Tracker</h1>
        <p style={{ margin: '0', color: '#888', fontSize: '14px' }}>Dünyasının dört bir yanından yeni çikolata ürünleri takip edin</p>
      </div>

      {/* Control Panel */}
      <div style={{ marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
        {/* Update Button */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={handleUpdate} 
            disabled={updating}
            style={{
              padding: '12px 24px',
              backgroundColor: updating ? '#ccc' : '#8B7355',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: updating ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            {updating ? '⏳ Güncelleniyor...' : '🔄 Verileri Güncelle'}
          </button>
          <span style={{ color: '#666', fontSize: '14px' }}>
            Toplam: <strong>{products.length}</strong> ürün
          </span>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Ürün adı, marka ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">📦 Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">🌍 Tüm Ülkeler</option>
            {countries.map(ctry => (
              <option key={ctry} value={ctry}>{ctry}</option>
            ))}
          </select>

          {/* Price Range */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Max: ${priceRange[1]}</span>
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          ✕ Filtreleri Temizle
        </button>
      </div>

      {/* Tabs: Ürünler vs Grafikler */}
      <div style={{ marginBottom: '30px' }}>
        
        {/* New Products Table */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#3D3D3A' }}>📋 Yeni Ürünler ({filteredProducts.length})</h2>
          
          {filteredProducts.length === 0 ? (
            <p style={{ color: '#999' }}>Sonuç bulunamadı.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Ürün Adı</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Marka</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Kategori</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Ülke</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Fiyat</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Özellikler</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Tarih</th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '10px' }}>{product.name?.substring(0, 40)}</td>
                      <td style={{ padding: '10px' }}>{product.brand || '-'}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ backgroundColor: '#E8D5C4', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {product.category || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>{product.country || '-'}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#8B7355' }}>
                        {product.price ? `${product.currency || '$'}${product.price.toFixed(2)}` : '-'}
                      </td>
                      <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>{product.features || '-'}</td>
                      <td style={{ padding: '10px', fontSize: '12px', color: '#999' }}>
                        {product.added_date ? new Date(product.added_date).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        {product.url && (
                          <a href={product.url} target="_blank" rel="noopener noreferrer" style={{ color: '#8B7355', textDecoration: 'none', fontWeight: 'bold' }}>
                            🔗
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          
          {/* Category Chart */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#3D3D3A' }}>📊 Kategoriye Göre Dağılım</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B7355" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#999' }}>Veri yok</p>
            )}
          </div>

          {/* Country Pie Chart */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#3D3D3A' }}>🌍 Ülkelere Göre Dağılım</h3>
            {countryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={countryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#999' }}>Veri yok</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {[
          { label: 'Toplam Ürün', value: products.length, icon: '📦' },
          { label: 'Kategori Sayısı', value: categories.length, icon: '📊' },
          { label: 'Ülke Sayısı', value: countries.length, icon: '🌍' },
          { label: 'Filtreli Sonuç', value: filteredProducts.length, icon: '🔍' }
        ].map((stat, idx) => (
          <div key={idx} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8B7355' }}>{stat.value}</div>
            <div style={{ color: '#999', fontSize: '13px', marginTop: '5px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <p>Global Çikolata Tracker v1.0 | Son güncelleme: {products.length > 0 ? '✓' : '❌'}</p>
      </div>
    </div>
  );
}
