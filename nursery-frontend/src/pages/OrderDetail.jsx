import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Package, XCircle, CheckCircle, Loader } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ALL_STEPS = ['Placed','Confirmed','Packed','Shipped','Out for Delivery','Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => toast.error('Order not found')).finally(() => setLoading(false));
  }, [id]);

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try { setCancelling(true); const { data } = await API.put(`/orders/${id}/cancel`); setOrder(data); toast.success('Order cancelled'); }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
    finally { setCancelling(false); }
  };

  if (loading) return <div className="spinner" style={{ paddingTop: '4rem' }} />;
  if (!order) return null;

  const currentIdx = order.status === 'Cancelled' ? -1 : ALL_STEPS.indexOf(order.status);

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <Link to="/orders" style={{ color: 'var(--green)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}><ChevronLeft size={17} /> Back to Orders</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 1.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2>Order Details</h2>
        {!['Shipped','Out for Delivery','Delivered','Cancelled'].includes(order.status) && (
          <button className="btn-danger" onClick={cancelOrder} disabled={cancelling}>{cancelling ? 'Cancelling...' : 'Cancel Order'}</button>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.8rem', boxShadow: 'var(--shadow)', marginBottom: '1.4rem' }}>
        <h3 style={{ marginBottom: '1.4rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}><Package size={18} /> Order Tracking</h3>
        {order.status === 'Cancelled' ? (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><XCircle size={16} /> This order has been cancelled.</div>
        ) : (
          <div className="tracking-timeline">
            {ALL_STEPS.map((s, i) => {
              const isDone = i < currentIdx, isCurrent = i === currentIdx;
              return (
                <div key={s} className="tracking-step">
                  <div className={`track-dot ${isDone ? 'done' : isCurrent ? 'current' : ''}`} />
                  <div className="track-info">
                    <h4 style={{ color: isDone || isCurrent ? 'var(--dark)' : 'var(--gray)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      {isCurrent && <Loader size={14} />}{isDone && <CheckCircle size={14} color="var(--green)" />} {s}
                    </h4>
                    {(isDone || isCurrent) && order.trackingHistory?.find(t => t.status === s) && (
                      <div className="date">{new Date(order.trackingHistory.find(t => t.status === s).timestamp).toLocaleString('en-IN')}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.4rem', boxShadow: 'var(--shadow)', marginBottom: '1.4rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--green)' }}>Items Ordered</h3>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #f0f0f0' }}>
            <div><strong>{item.name}</strong> × {item.quantity}</div><div>₹{item.price * item.quantity}</div>
          </div>
        ))}
        <div style={{ marginTop: '0.65rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--green)' }}><span>Total</span><span>₹{order.totalAmount}</span></div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.4rem', boxShadow: 'var(--shadow)' }}>
        <h3 style={{ marginBottom: '0.7rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={17} /> Delivery Address</h3>
        <p style={{ color: 'var(--gray)', fontSize: '0.88rem', lineHeight: 1.7 }}>
          <strong>{order.shippingAddress?.name}</strong> · {order.shippingAddress?.phone}<br />
          {order.shippingAddress?.address}<br />{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
        </p>
        <p style={{ marginTop: '0.7rem', fontSize: '0.88rem' }}><strong>Payment:</strong> {order.paymentMethod} · <strong>Status:</strong> {order.paymentStatus}</p>
      </div>
    </div>
  );
}
