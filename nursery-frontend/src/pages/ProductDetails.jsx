import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Sun, Droplets, Flower2, Leaf, PawPrint, ChevronLeft, Zap, AlertTriangle } from 'lucide-react';
import API from '../services/api';
import { useCart, useAuth } from '../App';
import toast from 'react-hot-toast';

const StarPicker = ({ value, hover, onHover, onClick }) => (
  <div className="stars-input">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={28} onClick={() => onClick(s)}
        onMouseEnter={() => onHover(s)} onMouseLeave={() => onHover(0)}
        fill={s <= (hover || value) ? '#f4a261' : 'none'}
        stroke={s <= (hover || value) ? '#f4a261' : '#ccc'}
        style={{ cursor: 'pointer', transition: 'all 0.1s' }} />
    ))}
  </div>
);

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('care');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { user, wishlist, setWishlist } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchProduct(); fetchReviews(); window.scrollTo(0, 0); }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      try {
        const rel = await API.get(`/products/${id}/related`);
        setRelated(rel.data || []);
      } catch { setRelated([]); }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (status === 404 || msg === 'Product not found') {
        setError('This product does not exist or has been removed.');
      } else if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        setError(msg || 'Failed to load product. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const fetchReviews = async () => {
    try { const { data } = await API.get(`/reviews/${id}`); setReviews(data); } catch {}
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const toggleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await API.put(`/wishlist/${id}`);
      setWishlist(data.wishlist);
      toast.success(data.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const isWishlisted = wishlist?.some(w => (w._id || w) === id);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!rating) { toast.error('Please select a rating'); return; }
    try {
      setSubmitting(true);
      await API.post(`/reviews/${id}`, { rating, comment });
      toast.success('Review submitted!');
      setRating(0); setComment('');
      fetchReviews(); fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  // Loading
  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>Loading plant details...</p>
    </div>
  );

  // Error state
  if (error) return (
    <div className="page">
      <Link to="/" style={{ color: 'var(--green)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '2rem' }}>
        <ChevronLeft size={18} /> Back to Shop
      </Link>
      <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '3rem', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
        <AlertTriangle size={56} color="#f4a261" style={{ marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--dark)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>{error}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', padding: '0.7rem 2rem', borderRadius: 8, display: 'inline-block' }}>
            Browse Plants
          </Link>
          <button className="btn-outline" onClick={fetchProduct}>Try Again</button>
        </div>
        {error.includes('backend') && (
          <div style={{ marginTop: '1.5rem', background: '#fff3cd', padding: '1rem', borderRadius: 8, fontSize: '0.85rem', color: '#856404', textAlign: 'left', maxWidth: 400, margin: '1.5rem auto 0' }}>
            <strong>Fix:</strong> Open a terminal and run:<br />
            <code style={{ display: 'block', marginTop: '0.4rem', background: '#f8f3d4', padding: '0.4rem 0.6rem', borderRadius: 4 }}>
              cd nursery-backend && node server.js
            </code>
          </div>
        )}
      </div>
    </div>
  );

  if (!product) return null;

  const disc = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const avgStars = Math.round(product.rating || 0);

  return (
    <div className="page">
      <Link to="/" style={{ color: 'var(--green)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '1rem' }}>
        <ChevronLeft size={18} /> Back to Shop
      </Link>

      <div className="product-detail">
        <div>
          <img src={product.image} alt={product.name}
            style={{ width: '100%', borderRadius: 'var(--radius)', maxHeight: 450, objectFit: 'cover' }}
            onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80'; }} />
        </div>

        <div>
          <span className="category-tag">{product.category}</span>
          <h1 style={{ fontSize: '1.9rem', margin: '0.5rem 0', lineHeight: 1.2 }}>{product.name}</h1>

          <div className="rating" style={{ margin: '0.6rem 0' }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= avgStars ? '#f4a261' : 'none'} stroke={s <= avgStars ? '#f4a261' : '#ccc'} />)}
            <span style={{ color: '#777', fontSize: '0.9rem', marginLeft: 4 }}>{product.rating?.toFixed(1) || '0.0'} ({product.numReviews} reviews)</span>
          </div>

          <div className="price-row" style={{ margin: '1rem 0' }}>
            <span className="price" style={{ fontSize: '2rem' }}>₹{product.price}</span>
            {product.originalPrice && <span className="original-price" style={{ fontSize: '1.1rem' }}>₹{product.originalPrice}</span>}
            {disc > 0 && <span className="discount-badge" style={{ fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}>{disc}% OFF</span>}
          </div>

          <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '1.2rem' }}>{product.description}</p>

          <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0f4ff', padding: '0.3rem 0.8rem', borderRadius: 20, fontSize: '0.85rem' }}>
              <PawPrint size={14} /> {product.petFriendly ? 'Pet Friendly' : 'Not Pet Safe'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0f4ff', padding: '0.3rem 0.8rem', borderRadius: 20, fontSize: '0.85rem' }}>
              <Leaf size={14} /> {product.difficulty} Care
            </span>
          </div>

          {product.stock === 0 ? (
            <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} /> This item is currently out of stock
            </div>
          ) : product.stock <= 5 ? (
            <div className="alert alert-info">Only {product.stock} left in stock!</div>
          ) : null}

          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={handleAddToCart}>
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={toggleWishlist} style={{ padding: '0.5rem 0.8rem' }}>
                <Heart size={18} fill={isWishlisted ? '#e63946' : 'none'} stroke={isWishlisted ? '#e63946' : '#999'} />
              </button>
            </div>
          )}

          <button className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => { if (product.stock > 0) { handleAddToCart(); navigate('/cart'); } }}>
            <Zap size={16} /> Buy Now
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'care' ? 'active' : ''}`} onClick={() => setActiveTab('care')}>
          <Leaf size={15} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Plant Care
        </button>
        <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
          <Star size={15} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Reviews ({reviews.length})
        </button>
      </div>

      {activeTab === 'care' && (
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginBottom: '1.2rem', color: 'var(--green)' }}>Plant Care Guide</h3>
          <div className="plant-care-grid">
            {[
              { icon: <Sun size={22} color="#f4a261" />, label: 'Sunlight', value: product.sunlight },
              { icon: <Droplets size={22} color="#4ea8de" />, label: 'Watering', value: product.watering },
              { icon: <Flower2 size={22} color="#8b5cf6" />, label: 'Soil', value: product.soil },
              { icon: <Leaf size={22} color="#40916c" />, label: 'Difficulty', value: product.difficulty },
            ].map(item => (
              <div key={item.label} className="care-item">
                <div className="icon">{item.icon}</div>
                <div className="label">{item.label}</div>
                <div className="value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--green)' }}>Customer Reviews</h3>
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--gray)' }}>No reviews yet. Be the first to review!</p>
          ) : reviews.map(r => (
            <div key={r._id} className="review-card">
              <div className="review-header">
                <strong>{r.userName || r.user?.name || 'Customer'}</strong>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? '#f4a261' : 'none'} stroke={s <= r.rating ? '#f4a261' : '#ccc'} />)}
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginTop: '0.3rem' }}>{r.comment}</p>
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.3rem' }}>
                {new Date(r.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}

          {user && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Write a Review</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray)', marginBottom: '1rem' }}>Only verified buyers can review.</p>
              <form onSubmit={submitReview}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray)', display: 'block', marginBottom: '0.5rem' }}>Your Rating</label>
                  <StarPicker value={rating} hover={hoverStar} onHover={setHoverStar} onClick={setRating} />
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} required
                    style={{ width: '100%', padding: '0.7rem', border: '2px solid #e5e5e5', borderRadius: '8px', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                    placeholder="Share your experience with this plant..." />
                </div>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {related.length > 0 && (
        <div className="related-section">
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>You May Also Like</h2>
          <div className="related-grid">
            {related.map(p => (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`}>
                  <img src={p.image} alt={p.name}
                    style={{ width: '100%', height: 160, objectFit: 'cover' }}
                    onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80'; }} />
                </Link>
                <div className="product-card-body">
                  <h3 style={{ fontSize: '0.9rem' }}>{p.name}</h3>
                  <div className="price" style={{ fontSize: '1rem' }}>₹{p.price}</div>
                  <Link to={`/product/${p._id}`} className="btn-outline"
                    style={{ display: 'block', textAlign: 'center', marginTop: '0.5rem', textDecoration: 'none', fontSize: '0.85rem', padding: '0.4rem' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
