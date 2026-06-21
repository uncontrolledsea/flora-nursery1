import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, AlertTriangle, SlidersHorizontal, Search } from 'lucide-react';
import API from '../services/api';
import { useCart, useAuth } from '../App';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Indoor Plants', 'Outdoor Plants', 'Medicinal Plants', 'Flowering Plants', 'Succulents', 'Air Purifying Plants'];

const StarRating = ({ rating, count }) => (
  <div className="rating">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={13} fill={s <= Math.round(rating) ? '#f4a261' : 'none'} stroke={s <= Math.round(rating) ? '#f4a261' : '#ccc'} />
    ))}
    <span style={{ color: '#888', fontSize: '0.78rem', marginLeft: 2 }}>({count || 0})</span>
  </div>
);

const ProductCard = React.memo(({ product, onAddToCart, onWishlist, wishlisted }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const disc = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="product-card">
      <div style={{ width: '100%', height: 190, background: '#eef5ef', position: 'relative', overflow: 'hidden' }}>
        {!imgLoaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="img-placeholder-icon" /></div>}
        <Link to={`/product/${product._id}`}>
          <img src={product.image} alt={product.name} onLoad={() => setImgLoaded(true)} onError={e => { e.target.onerror=null; e.target.src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80"; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s', display: 'block' }} />
        </Link>
        {disc > 0 && <span style={{ position: 'absolute', top: 10, left: 10, background: '#e63946', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 4 }}>{disc}% OFF</span>}
      </div>
      <div className="product-card-body">
        <span className="category-tag">{product.category}</span>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}><h3>{product.name}</h3></Link>
        <StarRating rating={product.rating || 0} count={product.numReviews} />
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
        </div>
        {product.stock === 0 && <div className="stock-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} /> Out of Stock</div>}
        {product.stock > 0 && product.stock <= 5 && <div className="stock-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} /> Only {product.stock} left</div>}
        <div className="card-actions">
          <button className="btn-primary" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>
            <ShoppingCart size={14} style={{ marginRight: 5 }} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button className={`wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={() => onWishlist(product._id)}>
            <Heart size={16} fill={wishlisted ? '#e63946' : 'none'} stroke={wishlisted ? '#e63946' : '#999'} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [seasonal, setSeasonal] = useState(null);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const { addToCart } = useCart();
  const { user, wishlist, setWishlist } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, [category, sort, minPrice, maxPrice, search]);
  useEffect(() => { fetchSeasonal(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { category, sort, search };
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await API.get('/products', { params });
      setProducts(data.products || data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };
  const fetchSeasonal = async () => { try { const { data } = await API.get('/products/seasonal'); setSeasonal(data); } catch {} };

  const handleAddToCart = useCallback((product) => {
    if (product.stock === 0) return toast.error('Out of stock');
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  }, [addToCart]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await API.put(`/wishlist/${productId}`);
      setWishlist(data.wishlist);
      toast.success(data.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  }, [user, navigate, setWishlist]);

  const isWishlisted = useCallback((id) => wishlist?.some(w => (w._id || w) === id), [wishlist]);

  return (
    <div>
      {!search && (
        <div className="hero">
          <h1>Bring Nature Home</h1>
          <p>Discover plants for every space — indoors, outdoors, medicinal and more</p>
          <Link to="/" className="hero-btn">Shop Plants</Link>
        </div>
      )}

      {seasonal && !search && (
        <div style={{ background: 'linear-gradient(135deg,#40916c,#52b788)', padding: '1.1rem 2rem', color: 'white', textAlign: 'center' }}>
          <strong>Best Plants for {seasonal.season}</strong> — Curated picks perfect for this season
        </div>
      )}

      <div className="page">
        {search && <h2 style={{ marginBottom: '1rem' }}>Search results for: "<strong>{search}</strong>"</h2>}

        <div className="layout-row">
          <div className="filters-sidebar">
            <h3><SlidersHorizontal size={15} /> Filters</h3>
            <div className="filter-group">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <div className="filter-group">
              <label>Sort By</label>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Price Range (₹)</label>
              <div className="price-range">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <span>–</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>
            <button className="btn-block" onClick={() => { setMinPrice(''); setMaxPrice(''); setCategory('All'); setSort('newest'); }}>Reset Filters</button>
          </div>

          <div>
            <div className="categories-row">
              {CATEGORIES.map(c => <button key={c} className={`cat-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}
            </div>

            {loading ? (
              <div className="spinner" />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <Search size={40} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--gray)' }} />
                <p>No plants found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} onWishlist={toggleWishlist} wishlisted={isWishlisted(product._id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
