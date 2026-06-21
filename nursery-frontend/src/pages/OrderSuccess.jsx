import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PartyPopper, Package, ShoppingBag } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="page">
      <div className="success-box">
        <PartyPopper size={56} style={{ color: 'var(--green)', margin: '0 auto 1rem' }} />
        <h2>Order Placed Successfully</h2>
        <p style={{ color: 'var(--gray)', margin: '0.5rem 0 1.4rem' }}>Your plants are on their way. We'll keep you updated.</p>
        <div style={{ background: 'var(--green-pale)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.4rem', fontSize: '0.88rem' }}>
          Order ID: <strong>{id.slice(-8).toUpperCase()}</strong>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn-primary" style={{ textDecoration: 'none', padding: '0.7rem 1.4rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Package size={16} /> Track Order
          </Link>
          <Link to="/" className="btn-outline" style={{ textDecoration: 'none', padding: '0.7rem 1.4rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
