import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Building2, Wallet, CheckCircle, XCircle, Loader } from 'lucide-react';

// Simulated payment page - works without Razorpay API keys
// Perfect for college project demo

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'];

export default function PaymentSimulator({ amount, onSuccess, onFailure, onClose }) {
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [screen, setScreen] = useState('main'); // main | otp | processing | success | failed
  const [otp, setOtp] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [bank, setBank] = useState('');
  const [error, setError] = useState('');

  const simulateProcessing = (successCallback) => {
    setScreen('processing');
    setTimeout(() => {
      setScreen('success');
      setTimeout(() => { successCallback(); }, 1500);
    }, 2000);
  };

  const handleUpiPay = () => {
    setError('');
    if (!upiId.includes('@')) { setError('Enter a valid UPI ID (e.g. name@upi)'); return; }
    simulateProcessing(onSuccess);
  };

  const handleCardPay = () => {
    setError('');
    const num = card.number.replace(/\s/g, '');
    if (num.length < 16) { setError('Enter a valid 16-digit card number'); return; }
    if (!card.expiry) { setError('Enter card expiry date'); return; }
    if (card.cvv.length < 3) { setError('Enter a valid CVV'); return; }
    setScreen('otp');
  };

  const handleOtpSubmit = () => {
    setError('');
    if (otp.length < 4) { setError('Enter the OTP sent to your mobile'); return; }
    simulateProcessing(onSuccess);
  };

  const handleNetBanking = () => {
    setError('');
    if (!bank) { setError('Please select a bank'); return; }
    simulateProcessing(onSuccess);
  };

  const formatCard = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) return v.slice(0,2) + '/' + v.slice(2);
    return v;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: '#2d6a4f', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>FloraNursery</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Amount: ₹{amount}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <X size={16} />
          </button>
        </div>

        {/* Processing Screen */}
        {screen === 'processing' && (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginBottom: '1rem' }}>
              <Loader size={48} color="#2d6a4f" />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>Processing Payment...</div>
            <div style={{ color: '#888', marginTop: '0.5rem', fontSize: '0.9rem' }}>Please wait, do not close this window</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Success Screen */}
        {screen === 'success' && (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle size={64} color="#2d6a4f" style={{ marginBottom: '1rem' }} />
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2d6a4f' }}>Payment Successful!</div>
            <div style={{ color: '#666', marginTop: '0.5rem' }}>₹{amount} paid successfully</div>
          </div>
        )}

        {/* OTP Screen */}
        {screen === 'otp' && (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>Enter OTP</h3>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              OTP sent to your registered mobile number ending with ****537
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {[0,1,2,3,4,5].map(i => (
                <input key={i} type="text" maxLength={1}
                  value={otp[i] || ''}
                  onChange={e => {
                    const newOtp = otp.split('');
                    newOtp[i] = e.target.value;
                    setOtp(newOtp.join(''));
                    if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
                  }}
                  style={{ width: 44, height: 48, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, border: '2px solid #ddd', borderRadius: 8, outline: 'none' }}
                />
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem' }}>
              Didn't receive OTP? <span style={{ color: '#2d6a4f', cursor: 'pointer', fontWeight: 600 }}>Resend OTP</span>
            </div>
            {error && <div style={{ color: '#e63946', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
            <button onClick={handleOtpSubmit} style={{ width: '100%', padding: '0.9rem', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              Verify & Pay ₹{amount}
            </button>
            <button onClick={() => setScreen('main')} style={{ width: '100%', padding: '0.7rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              ← Back
            </button>
          </div>
        )}

        {/* Main Payment Screen */}
        {screen === 'main' && (
          <div style={{ display: 'flex', minHeight: 380 }}>
            {/* Left sidebar */}
            <div style={{ width: 160, background: '#f8f8f8', borderRight: '1px solid #eee', padding: '0.5rem 0' }}>
              {[
                { id: 'upi', label: 'UPI', icon: <Smartphone size={16} /> },
                { id: 'card', label: 'Cards', icon: <CreditCard size={16} /> },
                { id: 'netbanking', label: 'Netbanking', icon: <Building2 size={16} /> },
                { id: 'wallet', label: 'Wallet', icon: <Wallet size={16} /> },
              ].map(m => (
                <button key={m.id} onClick={() => { setMethod(m.id); setError(''); }}
                  style={{ width: '100%', padding: '0.9rem 1rem', textAlign: 'left', border: 'none', background: method === m.id ? 'white' : 'transparent', borderLeft: method === m.id ? '3px solid #2d6a4f' : '3px solid transparent', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: method === m.id ? 600 : 400, color: method === m.id ? '#2d6a4f' : '#555' }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Right content */}
            <div style={{ flex: 1, padding: '1.5rem' }}>

              {/* UPI */}
              {method === 'upi' && (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '1rem', color: '#333' }}>Pay using UPI</div>
                  <label style={{ fontSize: '0.83rem', color: '#888', display: 'block', marginBottom: '0.4rem' }}>Enter UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    style={{ width: '100%', padding: '0.7rem', border: '2px solid #ddd', borderRadius: 8, fontSize: '0.95rem', outline: 'none', marginBottom: '0.8rem', boxSizing: 'border-box' }} />
                  <div style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '1rem' }}>
                    Examples: name@okaxis, name@ybl, name@paytm
                  </div>
                  {error && <div style={{ color: '#e63946', fontSize: '0.83rem', marginBottom: '0.8rem' }}>{error}</div>}
                  <button onClick={handleUpiPay}
                    style={{ width: '100%', padding: '0.85rem', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                    Pay ₹{amount}
                  </button>
                  <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.78rem', marginTop: '1rem' }}>— or scan QR with any UPI app —</div>
                  <div style={{ textAlign: 'center', marginTop: '0.8rem', padding: '1rem', background: '#f8f8f8', borderRadius: 8, color: '#888', fontSize: '0.8rem' }}>
                    [QR Code would appear here in live mode]
                  </div>
                </div>
              )}

              {/* Card */}
              {method === 'card' && (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '1rem', color: '#333' }}>Pay using Card</div>
                  <label style={{ fontSize: '0.83rem', color: '#888', display: 'block', marginBottom: '0.3rem' }}>Card Number</label>
                  <input value={card.number} onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #ddd', borderRadius: 8, fontSize: '0.95rem', outline: 'none', marginBottom: '0.7rem', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '0.7rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.83rem', color: '#888', display: 'block', marginBottom: '0.3rem' }}>Expiry</label>
                      <input value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/YY" maxLength={5}
                        style={{ width: '100%', padding: '0.65rem', border: '2px solid #ddd', borderRadius: 8, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.83rem', color: '#888', display: 'block', marginBottom: '0.3rem' }}>CVV</label>
                      <input value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'').slice(0,3) }))}
                        placeholder="123" maxLength={3} type="password"
                        style={{ width: '100%', padding: '0.65rem', border: '2px solid #ddd', borderRadius: 8, fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <label style={{ fontSize: '0.83rem', color: '#888', display: 'block', marginBottom: '0.3rem' }}>Name on Card</label>
                  <input value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your Name"
                    style={{ width: '100%', padding: '0.65rem', border: '2px solid #ddd', borderRadius: 8, fontSize: '0.95rem', outline: 'none', marginBottom: '0.8rem', boxSizing: 'border-box' }} />
                  {error && <div style={{ color: '#e63946', fontSize: '0.83rem', marginBottom: '0.8rem' }}>{error}</div>}
                  <button onClick={handleCardPay}
                    style={{ width: '100%', padding: '0.85rem', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                    Pay ₹{amount}
                  </button>
                </div>
              )}

              {/* Net Banking */}
              {method === 'netbanking' && (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '1rem', color: '#333' }}>Select Bank</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {BANKS.map(b => (
                      <div key={b} onClick={() => setBank(b)}
                        style={{ padding: '0.65rem 0.8rem', border: `2px solid ${bank === b ? '#2d6a4f' : '#eee'}`, borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: bank === b ? 600 : 400, color: bank === b ? '#2d6a4f' : '#555', background: bank === b ? '#f0fdf4' : 'white' }}>
                        {b}
                      </div>
                    ))}
                  </div>
                  {error && <div style={{ color: '#e63946', fontSize: '0.83rem', marginBottom: '0.8rem' }}>{error}</div>}
                  <button onClick={handleNetBanking}
                    style={{ width: '100%', padding: '0.85rem', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                    Pay ₹{amount}
                  </button>
                </div>
              )}

              {/* Wallet */}
              {method === 'wallet' && (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '1rem', color: '#333' }}>Select Wallet</div>
                  {['Paytm', 'PhonePe', 'Amazon Pay', 'Freecharge'].map(w => (
                    <div key={w} onClick={() => simulateProcessing(onSuccess)}
                      style={{ padding: '0.85rem 1rem', border: '2px solid #eee', borderRadius: 8, cursor: 'pointer', marginBottom: '0.5rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {w} <span style={{ color: '#2d6a4f', fontWeight: 600 }}>Pay →</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer */}
        {screen === 'main' && (
          <div style={{ padding: '0.7rem 1.5rem', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Secured by</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2d6a4f' }}>FloraNursery Pay</span>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>• 256-bit SSL</span>
          </div>
        )}
      </div>
    </div>
  );
}
