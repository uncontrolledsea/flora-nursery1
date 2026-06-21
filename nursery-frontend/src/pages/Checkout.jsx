import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../App';
import toast from 'react-hot-toast';
import PaymentSimulator from './PaymentSimulator';

const STEPS = ['Address', 'Payment', 'Confirm'];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showAddForm, setShowAddForm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [showPaymentSim, setShowPaymentSim] = useState(false);
  const [nurseryOrderId, setNurseryOrderId] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = cartTotal >= 499 ? 0 : 49;
  const total = cartTotal + shipping;

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await API.get('/addresses');
      setAddresses(data);
      const def = data.find(a => a.isDefault);
      setSelectedAddr(def?._id || data[0]?._id || null);
    } catch (err) {
      if (err.response?.status === 401) toast.error('Session expired. Please logout and login again.');
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/addresses', form);
      setAddresses(prev => [...prev, data]);
      setSelectedAddr(data._id);
      setShowAddForm(false);
      setForm({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
      toast.success('Address saved!');
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Failed to save address';
      toast.error(status === 401 ? 'Session expired. Please logout and login again.' : msg);
    }
  };

  // Create order in DB
  const createOrder = async (payStatus = 'Pending') => {
    const addr = addresses.find(a => a._id === selectedAddr);
    const { data } = await API.post('/orders', {
      items: cart.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
      shippingAddress: addr,
      paymentMethod,
      totalAmount: total,
      paymentStatus: payStatus,
    });
    return data;
  };

  // COD order
  const placeCOD = async () => {
    try {
      setPlacing(true);
      const order = await createOrder('Pending');
      clearCart();
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setPlacing(false); }
  };

  // Online payment - open simulator
  const placeOnline = async () => {
    try {
      setPlacing(true);
      const order = await createOrder('Pending');
      setNurseryOrderId(order._id);
      setShowPaymentSim(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setPlacing(false); }
  };

  // Called when simulator payment succeeds
  const onPaymentSuccess = async () => {
    try {
      // Mark order as paid
      if (nurseryOrderId) {
        await API.put(`/orders/${nurseryOrderId}/status`, { status: 'Confirmed' });
      }
      setShowPaymentSim(false);
      clearCart();
      toast.success('Payment successful!');
      navigate(`/order-success/${nurseryOrderId}`);
    } catch {
      clearCart();
      navigate(`/order-success/${nurseryOrderId}`);
    }
  };

  // Called when simulator is closed
  const onPaymentClose = () => {
    setShowPaymentSim(false);
    toast('Payment cancelled. Your order is saved. You can pay later.', { icon: 'ℹ️' });
    navigate(`/orders`);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'COD') placeCOD();
    else placeOnline();
  };

  const selectedAddress = addresses.find(a => a._id === selectedAddr);

  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page" style={{ maxWidth: 750 }}>
      {/* Payment Simulator Modal */}
      {showPaymentSim && (
        <PaymentSimulator
          amount={total}
          onSuccess={onPaymentSuccess}
          onFailure={() => { setShowPaymentSim(false); toast.error('Payment failed. Try again.'); }}
          onClose={onPaymentClose}
        />
      )}

      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--green)' }}>Checkout</h2>

      {/* Steps */}
      <div className="checkout-steps" style={{ marginBottom: '2rem' }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="step-num">{i < step ? '✓' : i + 1}</div>
              <span className="step-label">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </React.Fragment>
        ))}
      </div>

      {/* Order Summary bar */}
      <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '0.9rem 1.5rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
          {cart.length} item(s) · Shipping: {shipping === 0 ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>FREE</span> : `₹${shipping}`}
        </div>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--green)' }}>₹{total}</div>
      </div>

      {/* STEP 0: Address */}
      {step === 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={18} /> Select Delivery Address</h3>
          {addresses.map(a => (
            <div key={a._id} className={`address-card ${selectedAddr === a._id ? 'selected' : ''}`} onClick={() => setSelectedAddr(a._id)}>
              {a.isDefault && <span className="default-badge">Default</span>}
              <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                <input type="radio" readOnly checked={selectedAddr === a._id} style={{ marginTop: 3, accentColor: 'var(--green)' }} />
                <div>
                  <strong>{a.name}</strong> · {a.phone}
                  <div style={{ color: 'var(--gray)', fontSize: '0.88rem', marginTop: '0.2rem' }}>{a.address}, {a.city}, {a.state} - {a.pincode}</div>
                </div>
              </div>
            </div>
          ))}

          {showAddForm ? (
            <form onSubmit={saveAddress} style={{ background: 'white', padding: '1.4rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--green)' }}>New Address</h4>
              <div className="form-grid">
                {[['name','Name'],['phone','Phone Number'],['city','City'],['state','State'],['pincode','Pincode']].map(([f,l]) => (
                  <div key={f} className="form-group">
                    <label>{l}</label>
                    <input value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} required placeholder={l} />
                  </div>
                ))}
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Full Address</label>
                  <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required placeholder="House No, Street, Landmark" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary">Save & Use</button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="btn-outline" style={{ marginTop: '0.7rem', width: '100%' }} onClick={() => setShowAddForm(true)}>+ Add New Address</button>
          )}

          <button className="btn-block" style={{ marginTop: '1.5rem' }} onClick={() => { if (!selectedAddr) { toast.error('Please select or add an address'); return; } setStep(1); }}>
            Continue to Payment <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
          </button>
        </div>
      )}

      {/* STEP 1: Payment */}
      {step === 1 && (
        <div>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}><CreditCard size={18} /> Payment Method</h3>

          {[
            { id: 'COD', icon: <Banknote size={22} color="#2d6a4f" />, label: 'Cash on Delivery', desc: 'Pay cash when your plants arrive' },
            { id: 'Online', icon: <CreditCard size={22} color="#1d4ed8" />, label: 'Online Payment', desc: 'UPI, Cards, Net Banking, Wallets' },
          ].map(opt => (
            <div key={opt.id} className={`payment-option ${paymentMethod === opt.id ? 'selected' : ''}`} onClick={() => setPaymentMethod(opt.id)}>
              <input type="radio" readOnly checked={paymentMethod === opt.id} style={{ accentColor: 'var(--green)' }} />
              <span className="payment-icon">{opt.icon}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{opt.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--gray)' }}>{opt.desc}</div>
              </div>
            </div>
          ))}

          {paymentMethod === 'Online' && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                <ShieldCheck size={15} /> Secure Payment Portal
              </div>
              <div style={{ fontSize: '0.83rem', color: 'var(--gray)' }}>
                Enter UPI ID, Card details, or choose Net Banking / Wallet on the next screen.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn-outline" onClick={() => setStep(0)}>← Back</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(2)}>Review Order →</button>
          </div>
        </div>
      )}

      {/* STEP 2: Confirm */}
      {step === 2 && (
        <div>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={18} /> Review & Confirm</h3>

          <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--green)', marginBottom: '1rem' }}>Items</h4>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem' }}>
                <span>{item.name} <span style={{ color: 'var(--gray)' }}>× {item.quantity}</span></span>
                <strong>₹{item.price * item.quantity}</strong>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--gray)', marginTop: '0.5rem' }}>
              <span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--green)', borderTop: '2px solid #eee', marginTop: '0.7rem', paddingTop: '0.7rem' }}>
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--green)', marginBottom: '0.7rem' }}>Delivering To</h4>
            {selectedAddress && (
              <div style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--dark)' }}>{selectedAddress.name}</strong> · {selectedAddress.phone}<br />
                {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
              </div>
            )}
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.2rem 1.5rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--green)', marginBottom: '0.3rem' }}>Payment</h4>
            <div>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (UPI / Card / Net Banking)'}</div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-primary" style={{ flex: 1, fontSize: '1rem', padding: '0.9rem' }} onClick={handlePlaceOrder} disabled={placing}>
              {placing ? 'Please wait...' : paymentMethod === 'COD' ? 'Place Order (COD)' : `Pay ₹${total} Now`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
