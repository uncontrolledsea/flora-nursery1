import React, { useEffect, useState } from 'react';
import { Shield, Leaf, Mail, Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [tab, setTab] = useState('profile');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '', isDefault: false });
  
  const [gardeningForm, setGardeningForm] = useState({
    gardeningExperience: user?.gardeningExperience || 'Beginner',
    homeType: user?.homeType || 'Apartment',
    sunlightAvailability: user?.sunlightAvailability || 'Medium',
    petOwnership: user?.petOwnership || 'No Pets'
  });
  const [savingGardening, setSavingGardening] = useState(false);

  useEffect(() => {
    if (user) {
      setGardeningForm({
        gardeningExperience: user.gardeningExperience || 'Beginner',
        homeType: user.homeType || 'Apartment',
        sunlightAvailability: user.sunlightAvailability || 'Medium',
        petOwnership: user.petOwnership || 'No Pets'
      });
    }
  }, [user]);

  useEffect(() => { if (tab === 'addresses') fetchAddresses(); }, [tab]);
  const fetchAddresses = async () => { try { const { data } = await API.get('/addresses'); setAddresses(data); } catch {} };

  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await API.put(`/addresses/${editId}`, form);
        setAddresses(prev => prev.map(a => a._id === editId ? data : a));
        toast.success('Address updated');
      } else {
        const { data } = await API.post('/addresses', form);
        setAddresses(prev => [...prev, data]);
        toast.success('Address added');
      }
      setShowForm(false); setEditId(null);
      setForm({ name: '', phone: '', address: '', city: '', state: '', pincode: '', isDefault: false });
    } catch { toast.error('Failed to save address'); }
  };

  const saveGardeningProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingGardening(true);
      const { data } = await API.put('/auth/profile', gardeningForm);
      login({ ...data, token: user.token });
      toast.success('Gardening profile updated!');
    } catch (err) {
      toast.error('Failed to update gardening profile');
    } finally {
      setSavingGardening(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try { await API.delete(`/addresses/${id}`); setAddresses(prev => prev.filter(a => a._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (addr) => {
    setForm({ name: addr.name, phone: addr.phone, address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    setEditId(addr._id); setShowForm(true);
  };

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: '1.4rem' }}>My Account</h2>

      <div className="tabs">
        <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
        <button className={`tab ${tab === 'gardening' ? 'active' : ''}`} onClick={() => setTab('gardening')}>Gardening Profile</button>
        <button className={`tab ${tab === 'addresses' ? 'active' : ''}`} onClick={() => setTab('addresses')}>My Addresses</button>
      </div>

      {tab === 'gardening' && (
        <form onSubmit={saveGardeningProfile} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.2rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Leaf size={18} /> Gardening Profile
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1.5rem' }}>
            Configure your personal settings for plant recommendations, chatbot help, and personalized care scheduling.
          </p>

          <div className="form-group">
            <label>Gardening Experience</label>
            <select value={gardeningForm.gardeningExperience} onChange={e => setGardeningForm(p => ({ ...p, gardeningExperience: e.target.value }))}>
              <option value="Beginner">Beginner (New to plant care, prefers easy plants)</option>
              <option value="Intermediate">Intermediate (Has some experience, can handle average care)</option>
              <option value="Expert">Expert (Highly skilled, can handle demanding/delicate plants)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Home Type</label>
            <select value={gardeningForm.homeType} onChange={e => setGardeningForm(p => ({ ...p, homeType: e.target.value }))}>
              <option value="Apartment">Apartment (Limited indoor space or balcony)</option>
              <option value="House">House (Spacious indoor area and outdoor yard)</option>
              <option value="Office">Office (Desk-friendly, low water setups)</option>
              <option value="Balcony">Balcony (Pots, window boxes, vertical space)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sunlight Availability</label>
            <select value={gardeningForm.sunlightAvailability} onChange={e => setGardeningForm(p => ({ ...p, sunlightAvailability: e.target.value }))}>
              <option value="Low">Low Light (Shaded window, minimal direct sun)</option>
              <option value="Medium">Medium Light (Bright indirect sun, east/west window)</option>
              <option value="High">High Light (Full direct sun, south window/outdoor garden)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pet Ownership</label>
            <select value={gardeningForm.petOwnership} onChange={e => setGardeningForm(p => ({ ...p, petOwnership: e.target.value }))}>
              <option value="No Pets">No Pets (Can choose any plants including toxic ones)</option>
              <option value="Has Pets">Has Pets (Requires 100% pet-safe, non-toxic plants)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={savingGardening} style={{ marginTop: '1rem', padding: '0.65rem 2rem' }}>
            {savingGardening ? 'Saving...' : 'Save Gardening Profile'}
          </button>
        </form>
      )}

      {tab === 'profile' && (
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', marginBottom: '1.4rem' }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', fontWeight: 700, color: 'var(--green)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>{user?.name}</h3>
              <p style={{ color: 'var(--gray)' }}>{user?.email}</p>
              <span style={{ background: user?.role === 'admin' ? '#fef3c7' : 'var(--green-pale)', color: user?.role === 'admin' ? '#92400e' : 'var(--green)', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: '0.3rem' }}>
                {user?.role === 'admin' ? <><Shield size={12} /> Admin</> : <><Leaf size={12} /> Member</>}
              </span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', color: 'var(--gray)', fontSize: '0.88rem' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> {user?.email}</p>
            <p style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}><Tag size={14} /> Role: {user?.role}</p>
          </div>
        </div>
      )}

      {tab === 'addresses' && (
        <div>
          {addresses.map(a => (
            <div key={a._id} className="address-card" style={{ cursor: 'default' }}>
              {a.isDefault && <span className="default-badge">Default</span>}
              <strong>{a.name}</strong> · {a.phone}
              <div style={{ color: 'var(--gray)', fontSize: '0.88rem', marginTop: '0.3rem' }}>{a.address}, {a.city}, {a.state} - {a.pincode}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                <button className="btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }} onClick={() => startEdit(a)}><Edit2 size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Edit</button>
                <button className="btn-danger" style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }} onClick={() => deleteAddress(a._id)}><Trash2 size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Delete</button>
              </div>
            </div>
          ))}

          {showForm ? (
            <form onSubmit={saveAddress} style={{ background: 'white', padding: '1.4rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>{editId ? 'Edit Address' : 'New Address'}</h4>
              <div className="form-grid">
                {[['name','Name'],['phone','Phone'],['city','City'],['state','State'],['pincode','Pincode']].map(([field, label]) => (
                  <div key={field} className="form-group"><label>{label}</label>
                    <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} required />
                  </div>
                ))}
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Address</label>
                  <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', marginBottom: '1rem' }}>
                <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} />
                Set as default address
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 'none', padding: '0.6rem 1.4rem' }}>Save</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={() => { setForm({ name: '', phone: '', address: '', city: '', state: '', pincode: '', isDefault: false }); setEditId(null); setShowForm(true); }}>
              <Plus size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Add New Address
            </button>
          )}
        </div>
      )}
    </div>
  );
}
