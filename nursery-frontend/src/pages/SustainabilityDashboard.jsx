import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import API from '../services/api';
import { getSustainabilityMetrics, getSustainabilityBadges } from '../utils/sustainabilityHelper';
import { Leaf, Droplets, Wind, Sparkles, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SustainabilityDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [myPlants, setMyPlants] = useState([]);

  useEffect(() => {
    // Load products
    API.get('/products')
      .then(({ data }) => {
        const list = data.products || data || [];
        setProducts(list);
        if (user) {
          fetchMyPlants(list);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error('Failed to load catalog');
        setLoading(false);
      });
  }, [user]);

  const fetchMyPlants = (catalog) => {
    API.get('/orders/my')
      .then(({ data }) => {
        const plantNames = new Set();
        data.forEach(order => {
          if (order.status !== 'Cancelled' && order.items) {
            order.items.forEach(item => plantNames.add(item.name));
          }
        });

        // Map purchased names to database product catalog objects
        const items = catalog.filter(p => plantNames.has(p.name));
        setMyPlants(items);
      })
      .catch(() => toast.error('Failed to load personal ecology stats'))
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="spinner" style={{ paddingTop: '4rem' }} />;

  // Calculate my garden environmental averages
  const myMetrics = myPlants.map(p => getSustainabilityMetrics(p));
  const avgWater = myMetrics.length > 0 ? Math.round(myMetrics.reduce((sum, m) => sum + m.waterEfficiency, 0) / myMetrics.length) : 0;
  const avgAir = myMetrics.length > 0 ? Math.round(myMetrics.reduce((sum, m) => sum + m.airPurification, 0) / myMetrics.length) : 0;
  const avgEco = myMetrics.length > 0 ? Math.round(myMetrics.reduce((sum, m) => sum + m.sustainabilityScore, 0) / myMetrics.length) : 0;

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Leaf /> Ecological Sustainability Dashboard
        </h1>
        <p style={{ color: 'var(--gray)', maxWidth: 650, margin: '0.5rem auto 0' }}>
          Evaluate plant choices based on water efficiency, NASA clean-air filtration indices, carbon sequestration rankings, and pet safety benchmarks.
        </p>
      </div>

      {/* User's Garden Impact Metrics (If they have purchases) */}
      {user && myPlants.length > 0 ? (
        <div style={{ background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)', color: 'white', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow)', marginBottom: '2.2rem' }}>
          <h2 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.5rem' }}>
            <Sparkles color="var(--orange)" /> Your Garden's Ecological Impact
          </h2>
          <p style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: '1.5rem', maxWidth: 680 }}>
            Congratulations! By purchasing and caring for these <strong>{myPlants.length} species</strong>, you are actively filtering air contaminants and supporting carbon offsets.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.4rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', opacity: 0.8 }}><Droplets size={14} /> Water Conservation Index</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.3rem 0' }}>{avgWater}%</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.78 }}>High efficiency translates to lower domestic tap-water demand.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', opacity: 0.8 }}><Wind size={14} /> Air Purification Rating</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.3rem 0' }}>{avgAir}%</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.78 }}>Based on particulate matter & VOC absorption ratios.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.2rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', opacity: 0.8 }}><Leaf size={14} /> Eco Sustainability Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.3rem 0' }}>{avgEco}%</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.78 }}>Calculated using local adaptability & carbon sequestration index.</div>
            </div>
          </div>

          <div style={{ marginTop: '1.4rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', fontSize: '0.82rem', opacity: 0.85 }}>
            <strong>Your Active Ecological Contributors:</strong> {myPlants.map(p => p.name).join(', ')}.
          </div>
        </div>
      ) : user ? (
        <div style={{ background: '#f8faf9', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px dashed #cbd5e0', color: 'var(--gray)', textAlign: 'center', marginBottom: '2.2rem', fontSize: '0.88rem' }}>
          No active plants found in your purchase history. Buy plants from the shop to view your personalized environmental footprint calculations!
        </div>
      ) : null}

      {/* Complete Species Directory with Ratings */}
      <h2 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>Species Ecological Index Directory</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.4rem' }}>
        {products.map(plant => {
          const metrics = getSustainabilityMetrics(plant);
          const badges = getSustainabilityBadges(plant, metrics);

          return (
            <div key={plant._id} style={{ background: 'white', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '0.8rem', padding: '1rem', flex: 1 }}>
                <img src={plant.image} alt={plant.name} style={{ width: '76px', height: '76px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={e => { e.target.onerror=null; e.target.src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80"; }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.98rem', color: 'var(--dark)', marginBottom: '0.2rem' }}>{plant.name}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>{plant.category}</span>
                  
                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {badges.map(b => (
                      <span key={b.label} style={{ fontSize: '0.62rem', fontWeight: 700, color: b.color, background: b.bg, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Graphical rating rows */}
              <div style={{ padding: '0.8rem 1rem', background: '#fcfdfc', borderTop: '1px solid #f3f4f3', fontSize: '0.76rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Droplets size={12} color="#1d4ed8" /> Water Efficiency:</span>
                  <strong>{metrics.waterEfficiency}%</strong>
                </div>
                <div style={{ width: '100%', height: 4, background: '#eef2f3', borderRadius: 2, overflow: 'hidden', marginBottom: '0.6rem' }}>
                  <div style={{ width: `${metrics.waterEfficiency}%`, height: '100%', background: '#1d4ed8' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Wind size={12} color="#10b981" /> Air Purification:</span>
                  <strong>{metrics.airPurification}%</strong>
                </div>
                <div style={{ width: '100%', height: 4, background: '#eef2f3', borderRadius: 2, overflow: 'hidden', marginBottom: '0.6rem' }}>
                  <div style={{ width: `${metrics.airPurification}%`, height: '100%', background: '#10b981' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Leaf size={12} color="#059669" /> Sustainability Rating:</span>
                  <strong>{metrics.sustainabilityScore}%</strong>
                </div>
                <div style={{ width: '100%', height: 4, background: '#eef2f3', borderRadius: 2, overflow: 'hidden', marginBottom: '0.6rem' }}>
                  <div style={{ width: `${metrics.sustainabilityScore}%`, height: '100%', background: '#059669' }} />
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--gray)', fontStyle: 'italic', marginTop: '0.5rem', borderTop: '1px dashed #eee', paddingTop: '0.4rem' }}>
                  <strong>Eco Benefit:</strong> {metrics.ecologicalBenefit}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
