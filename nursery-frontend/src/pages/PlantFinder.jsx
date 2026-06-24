import React, { useState, useEffect } from 'react';
import { useAuth, useCart } from '../App';
import API from '../services/api';
import { calculateSuitabilityScore } from '../utils/scoringAlgorithm';
import { ShoppingCart, CheckCircle, Info, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PlantFinder() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [criteria, setCriteria] = useState({
    environment: 'Indoor',
    sunlight: 'Medium',
    maintenance: 'Medium',
    petSafeRequired: false,
    airPurifyingPreferred: false,
    experience: 'Beginner'
  });

  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeExplainId, setActiveExplainId] = useState(null);

  // Fetch all plants from database
  useEffect(() => {
    API.get('/products')
      .then(({ data }) => {
        // Handle paginated products or flat list
        const list = data.products || data || [];
        setProducts(list);
      })
      .catch(() => toast.error('Failed to load plants catalog'))
      .finally(() => setLoading(false));
  }, []);

  // Pre-fill questionnaire from User Gardening Profile if available
  useEffect(() => {
    if (user) {
      const isIndoor = ['Apartment', 'Office'].includes(user.homeType);
      setCriteria({
        environment: isIndoor ? 'Indoor' : 'Outdoor',
        sunlight: user.sunlightAvailability || 'Medium',
        maintenance: user.gardeningExperience === 'Beginner' ? 'Low' : 'Medium',
        petSafeRequired: user.petOwnership === 'Has Pets',
        airPurifyingPreferred: false,
        experience: user.gardeningExperience || 'Beginner'
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (products.length === 0) {
      toast.error('Catalog is empty. Please check back later.');
      return;
    }

    // Run scoring algorithm for each plant
    const scored = products.map(product => {
      const scoring = calculateSuitabilityScore(product, criteria);
      return {
        ...product,
        match: scoring
      };
    });

    // Sort by score descending and take Top 5
    const sorted = scored.sort((a, b) => b.match.score - a.match.score).slice(0, 5);
    setRecommendations(sorted);
    setHasSearched(true);
    setActiveExplainId(null);
    toast.success('Found your top 5 plant matches!');
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) return toast.error('Out of stock');
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getMatchBadgeClass = (score) => {
    if (score >= 90) return 'status-delivered'; // Green
    if (score >= 75) return 'status-confirmed'; // Blue
    if (score >= 60) return 'status-placed'; // Yellow
    return 'status-cancelled'; // Red
  };

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Sparkles color="var(--orange)" /> Intelligent Plant Finder
        </h1>
        <p style={{ color: 'var(--gray)', maxWidth: 600, margin: '0.5rem auto 0' }}>
          Our AI-powered suitability engine calculates compatibility ratings based on your home environment, experience, and safety preferences.
        </p>
      </div>

      <div className="layout-row" style={{ gridTemplateColumns: hasSearched ? '320px 1fr' : '1fr', maxWidth: hasSearched ? '1200px' : '650px', margin: '0 auto' }}>
        {/* Questionnaire Form */}
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.8rem', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginBottom: '1.2rem', color: 'var(--green)' }}>Preferences Questionnaire</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Growing Location</label>
              <select value={criteria.environment} onChange={e => setCriteria(p => ({ ...p, environment: e.target.value }))}>
                <option value="Indoor">Indoor Space</option>
                <option value="Outdoor">Outdoor Garden / Balcony</option>
              </select>
            </div>

            <div className="form-group">
              <label>Available Sunlight</label>
              <select value={criteria.sunlight} onChange={e => setCriteria(p => ({ ...p, sunlight: e.target.value }))}>
                <option value="Low">Low / Shady (Indirect light only)</option>
                <option value="Medium">Medium / Moderate (Partial direct/indirect)</option>
                <option value="High">High / Full Sun (Bright direct rays)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Maintenance Capacity</label>
              <select value={criteria.maintenance} onChange={e => setCriteria(p => ({ ...p, maintenance: e.target.value }))}>
                <option value="Low">Low Maintenance (Forgetful / Busy schedules)</option>
                <option value="Medium">Medium Maintenance (Can water weekly/bi-weekly)</option>
                <option value="High">High Maintenance (Enjoy frequent hands-on care)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Gardening Experience</label>
              <select value={criteria.experience} onChange={e => setCriteria(p => ({ ...p, experience: e.target.value }))}>
                <option value="Beginner">Beginner (New to plant care)</option>
                <option value="Intermediate">Intermediate (Grown a few plants successfully)</option>
                <option value="Expert">Expert (Comfortable with delicate/fussy varieties)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: '1.2rem 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" checked={criteria.petSafeRequired} onChange={e => setCriteria(p => ({ ...p, petSafeRequired: e.target.checked }))} />
                Requires Pet-Safe / Non-Toxic
              </label>
            </div>

            <div className="form-group" style={{ margin: '1.2rem 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                <input type="checkbox" checked={criteria.airPurifyingPreferred} onChange={e => setCriteria(p => ({ ...p, airPurifyingPreferred: e.target.checked }))} />
                Prefer Air-Purifying (NASA Clean Air)
              </label>
            </div>

            <button type="submit" className="btn-block" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? 'Loading Catalog...' : hasSearched ? 'Recalculate Recommendations' : 'Find My Perfect Plants'}
            </button>
          </form>
        </div>

        {/* Recommendations Results list */}
        {hasSearched && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: 'var(--dark)' }}>Your Top 5 Plant Recommendations</h2>
              <button className="btn-outline" onClick={() => setHasSearched(false)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                <RefreshCw size={12} /> Reset questionnaire
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recommendations.map((item, index) => (
                <div key={item._id} style={{ background: 'white', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {/* Plant Image */}
                    <div style={{ width: '200px', height: '200px', position: 'relative' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.onerror=null; e.target.src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80"; }} />
                      <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--green)', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        #{index + 1}
                      </div>
                    </div>

                    {/* Plant Info */}
                    <div style={{ flex: 1, padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <span className="category-tag">{item.category}</span>
                            <h3 style={{ fontSize: '1.25rem', margin: '0.2rem 0' }}>{item.name}</h3>
                          </div>

                          {/* Match Rating */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span className={`order-status-badge ${getMatchBadgeClass(item.match.score)}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem', borderRadius: '15px' }}>
                              {item.match.score}% {item.match.label}
                            </span>
                          </div>
                        </div>

                        <p style={{ color: 'var(--gray)', fontSize: '0.85rem', margin: '0.5rem 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description}
                        </p>

                        <div style={{ background: 'var(--beige)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--green)', fontWeight: 500, marginBottom: '0.5rem' }}>
                          <strong>Recommendation Reason:</strong> {item.match.explanation[0]}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '0.8rem' }}>
                        <span className="price" style={{ fontSize: '1.2rem' }}>₹{item.price}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-outline" onClick={() => setActiveExplainId(activeExplainId === item._id ? null : item._id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.5rem 0.8rem', fontSize: '0.82rem' }}>
                            <Info size={14} /> Explain Match
                          </button>
                          <button className="btn-primary" onClick={() => handleAddToCart(item)} disabled={item.stock === 0} style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                            <ShoppingCart size={14} style={{ marginRight: 4 }} /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explain Match Panel (Feature 2) */}
                  {activeExplainId === item._id && (
                    <div style={{ background: '#f8faf9', borderTop: '1px solid #eee', padding: '1.2rem', fontSize: '0.88rem' }}>
                      <h4 style={{ color: 'var(--green)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={16} /> Detailed Score Analysis
                      </h4>
                      <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        The suitability rating is calculated dynamically based on academic criteria weights: Light Match (40%), Maintenance (25%), Pet Safety (20%), and User Preferences (15%).
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'white', padding: '0.6rem', borderRadius: '6px', border: '1px solid #eef1ef' }}>
                          <div style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>Light Match (40%)</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--orange)' }}>
                            {item.match.breakdown.light.raw}% <span style={{ fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 'normal' }}>({item.match.breakdown.light.weighted} pts)</span>
                          </div>
                        </div>
                        <div style={{ background: 'white', padding: '0.6rem', borderRadius: '6px', border: '1px solid #eef1ef' }}>
                          <div style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>Maintenance (25%)</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--orange)' }}>
                            {item.match.breakdown.maintenance.raw}% <span style={{ fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 'normal' }}>({item.match.breakdown.maintenance.weighted} pts)</span>
                          </div>
                        </div>
                        <div style={{ background: 'white', padding: '0.6rem', borderRadius: '6px', border: '1px solid #eef1ef' }}>
                          <div style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>Pet Safety (20%)</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--orange)' }}>
                            {item.match.breakdown.petSafety.raw}% <span style={{ fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 'normal' }}>({item.match.breakdown.petSafety.weighted} pts)</span>
                          </div>
                        </div>
                        <div style={{ background: 'white', padding: '0.6rem', borderRadius: '6px', border: '1px solid #eef1ef' }}>
                          <div style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>Preferences (15%)</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--orange)' }}>
                            {item.match.breakdown.preferences.raw}% <span style={{ fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 'normal' }}>({item.match.breakdown.preferences.weighted} pts)</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <strong>Decision Explanations:</strong>
                        {item.match.explanation.map((exp, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#444' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-light)' }} />
                            {exp}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
