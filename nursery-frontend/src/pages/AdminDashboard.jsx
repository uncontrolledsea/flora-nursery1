import React, { useEffect, useState, useRef } from 'react';
import {
  LayoutDashboard, Package, Leaf, Search, X, Upload, Image as ImageIcon,
  Pencil, Trash2, Plus, IndianRupee, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Placed','Confirmed','Packed','Shipped','Out for Delivery','Delivered','Cancelled'];
const CATEGORIES = ['Indoor Plants','Outdoor Plants','Medicinal Plants','Flowering Plants','Succulents','Air Purifying Plants'];
const EMPTY_PRODUCT = {
  name:'', description:'', price:'', originalPrice:'', image:'',
  category:'Indoor Plants', stock:10, sunlight:'Medium',
  watering:'Twice per week', soil:'Well drained', difficulty:'Easy', petFriendly:true,
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // START as false — no dimming on load
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [searchOrder, setSearchOrder] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const fileRef = useRef();

  useEffect(() => { loadTab(); }, [tab]);

  const loadTab = () => {
    setError('');
    if (tab === 'dashboard') fetchStats();
    else if (tab === 'orders') fetchOrders();
    else fetchProducts();
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats. Make sure backend is running.');
    } finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders/admin/all');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders.');
    } finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/products?limit=200');
      setProducts(data.products || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status'); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      setUploading(true);
      const { data } = await API.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const base = import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000';
      const fullUrl = `${base}${data.imageUrl}`;
      setForm(p => ({ ...p, image: fullUrl }));
      setPreview(fullUrl);
      toast.success('Image uploaded!');
    } catch { toast.error('Image upload failed'); }
    finally { setUploading(false); }
  };

  const resetForm = () => {
    setForm(EMPTY_PRODUCT);
    setEditId(null);
    setPreview('');
    setShowForm(false);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description || !form.image) {
      toast.error('Name, price, description and image are required');
      return;
    }
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
      };
      if (editId) {
        const { data } = await API.put(`/products/${editId}`, payload);
        setProducts(prev => prev.map(p => p._id === editId ? data : p));
        toast.success('Product updated!');
      } else {
        const { data } = await API.post('/products', payload);
        setProducts(prev => [data, ...prev]);
        toast.success('Product added!');
      }
      resetForm();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const startEdit = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price,
      originalPrice: p.originalPrice || '', image: p.image || '',
      category: p.category, stock: p.stock, sunlight: p.sunlight,
      watering: p.watering, soil: p.soil, difficulty: p.difficulty,
      petFriendly: p.petFriendly,
    });
    setEditId(p._id);
    setPreview(p.image || '');
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Delete failed'); }
  };

  const filteredOrders = orders.filter(o =>
    o._id.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(searchOrder.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    // NO overlay, NO pointer-events blocking, NO opacity dimming
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <h2 style={{ display:'flex', alignItems:'center', gap:8 }}>
          <LayoutDashboard size={24} /> Admin Panel
        </h2>
        <span style={{ background:'var(--green-pale)', color:'var(--green)', padding:'0.4rem 1rem', borderRadius:20, fontSize:'0.85rem', fontWeight:600 }}>
          Admin Mode
        </span>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[['dashboard','Dashboard',<LayoutDashboard size={15}/>],['orders','Orders',<Package size={15}/>],['products','Products',<Leaf size={15}/>]].map(([t,l,icon]) => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}
            style={{ display:'flex', alignItems:'center', gap:5 }}>
            {icon} {l}
          </button>
        ))}
      </div>

      {/* Loading spinner — does NOT block the page */}
      {loading && (
        <div style={{ textAlign:'center', padding:'2rem', color:'var(--gray)' }}>
          <div className="spinner" style={{ margin:'0 auto' }} />
          <p style={{ marginTop:'1rem', fontSize:'0.9rem' }}>Loading...</p>
        </div>
      )}

      {/* Error state with retry */}
      {!loading && error && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:'var(--radius)', padding:'1.5rem', margin:'1rem 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'#991b1b' }}>
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
          <button className="btn-outline" onClick={loadTab} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.85rem' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {!loading && !error && tab === 'dashboard' && stats && (
        <>
          <div className="stats-grid">
            {[
              { icon:<Package size={22} color="#2d6a4f"/>, label:'Total Orders', value:stats.totalOrders, color:'green' },
              { icon:<IndianRupee size={22} color="#1d4ed8"/>, label:'Total Revenue', value:`₹${(stats.totalRevenue||0).toLocaleString('en-IN')}`, color:'blue' },
              { icon:<Leaf size={22} color="#c2410c"/>, label:'Products', value:stats.totalProducts, color:'orange' },
              { icon:<Clock size={22} color="#b91c1c"/>, label:'Pending Orders', value:stats.ordersByStatus?.find(s=>s._id==='Placed')?.count||0, color:'red' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                <div className="stat-info"><h3>{s.value}</h3><p>{s.label}</p></div>
              </div>
            ))}
          </div>

          <div style={{ background:'white', borderRadius:'var(--radius)', padding:'1.5rem', boxShadow:'var(--shadow)', marginBottom:'2rem' }}>
            <h3 style={{ marginBottom:'1rem', color:'var(--green)' }}>Orders by Status</h3>
            <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap' }}>
              {stats.ordersByStatus?.map(s => (
                <div key={s._id} style={{ background:'var(--beige)', padding:'0.5rem 1rem', borderRadius:20, fontSize:'0.85rem' }}>
                  <strong>{s._id}</strong>: {s.count}
                </div>
              ))}
            </div>
          </div>

          <h3 style={{ marginBottom:'1rem', color:'var(--green)' }}>Recent Orders</h3>
          <div style={{ overflowX:'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {stats.recentOrders?.map(o => (
                  <tr key={o._id}>
                    <td><code style={{ fontSize:'0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                    <td>{o.user?.name}</td>
                    <td>{o.items?.length} item(s)</td>
                    <td><strong>₹{o.totalAmount}</strong></td>
                    <td style={{ fontWeight:600, color:'var(--green)' }}>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── ORDERS ── */}
      {!loading && !error && tab === 'orders' && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:'1rem' }}>
            <h3>All Orders ({filteredOrders.length})</h3>
            <div style={{ position:'relative' }}>
              <Search size={16} style={{ position:'absolute', left:10, top:10, color:'#999' }} />
              <input placeholder="Search by name, email, order ID..." value={searchOrder}
                onChange={e => setSearchOrder(e.target.value)}
                style={{ padding:'0.5rem 1rem 0.5rem 2.2rem', border:'2px solid #e5e5e5', borderRadius:8, fontSize:'0.9rem', width:280, outline:'none' }} />
            </div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Update Status</th></tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o._id}>
                    <td><code style={{ fontSize:'0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                    <td style={{ fontSize:'0.8rem', color:'var(--gray)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div style={{ fontWeight:600 }}>{o.user?.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--gray)' }}>{o.user?.email}</div>
                    </td>
                    <td>
                      {o.items?.slice(0,2).map((i,idx) => <div key={idx} style={{ fontSize:'0.8rem' }}>{i.name} ×{i.quantity}</div>)}
                      {o.items?.length > 2 && <div style={{ fontSize:'0.75rem', color:'var(--gray)' }}>+{o.items.length-2} more</div>}
                    </td>
                    <td><strong>₹{o.totalAmount}</strong></td>
                    <td>
                      <div style={{ fontSize:'0.85rem' }}>{o.paymentMethod}</div>
                      <div style={{ fontSize:'0.75rem', color:o.paymentStatus==='Paid'?'var(--green)':'var(--orange)', fontWeight:600 }}>{o.paymentStatus}</div>
                    </td>
                    <td>
                      <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                        style={{ padding:'0.35rem 0.5rem', borderRadius:6, border:'2px solid #e5e5e5', fontSize:'0.82rem', cursor:'pointer', outline:'none' }}>
                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length===0 && (
                  <tr><td colSpan={7} style={{ textAlign:'center', padding:'2rem', color:'var(--gray)' }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── PRODUCTS ── */}
      {!loading && !error && tab === 'products' && (
        <>
          {/* Add/Edit Form */}
          {showForm && (
            <div style={{ background:'white', borderRadius:'var(--radius)', padding:'2rem', boxShadow:'var(--shadow)', marginBottom:'2rem', border:'2px solid var(--green-pale)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <h3 style={{ color:'var(--green)', display:'flex', alignItems:'center', gap:8 }}>
                  {editId ? <><Pencil size={18}/> Edit Product</> : <><Plus size={18}/> Add New Plant</>}
                </h3>
                <button onClick={resetForm} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gray)', display:'flex' }}>
                  <X size={22}/>
                </button>
              </div>

              <form onSubmit={saveProduct}>
                {/* Image upload */}
                <div style={{ marginBottom:'1.5rem', padding:'1.2rem', background:'var(--beige)', borderRadius:'var(--radius)' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:6, fontWeight:600, marginBottom:'0.8rem', color:'var(--green)' }}>
                    <ImageIcon size={16}/> Plant Image *
                  </label>
                  <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-start', flexWrap:'wrap' }}>
                    <div style={{ width:120, height:120, border:'2px dashed #ccc', borderRadius:'var(--radius)', overflow:'hidden', flexShrink:0, background:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {preview
                        ? <img src={preview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={() => setPreview('')} />
                        : <ImageIcon size={32} color="#ccc"/>}
                    </div>
                    <div style={{ flex:1, minWidth:200 }}>
                      <button type="button" className="btn-outline"
                        onClick={() => fileRef.current.click()} disabled={uploading}
                        style={{ marginBottom:'0.8rem', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                        <Upload size={15}/> {uploading ? 'Uploading...' : 'Upload from Computer'}
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleUpload}/>
                      <div style={{ textAlign:'center', color:'var(--gray)', fontSize:'0.8rem', margin:'0.5rem 0' }}>— or paste image URL —</div>
                      <input placeholder="https://example.com/plant.jpg" value={form.image}
                        onChange={e => { setForm(p => ({...p, image:e.target.value})); setPreview(e.target.value); }}
                        style={{ width:'100%', padding:'0.6rem', border:'1px solid #ddd', borderRadius:6, fontSize:'0.85rem', boxSizing:'border-box' }}/>
                    </div>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label>Plant Name *</label>
                    <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} required placeholder="e.g. Money Plant"/>
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select value={form.difficulty} onChange={e => setForm(p=>({...p,difficulty:e.target.value}))}>
                      {['Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Selling Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} required min="0" placeholder="249"/>
                  </div>
                  <div className="form-group">
                    <label>Original Price (₹) <span style={{ color:'var(--gray)', fontWeight:400 }}>(optional, for discount)</span></label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm(p=>({...p,originalPrice:e.target.value}))} min="0" placeholder="349"/>
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input type="number" value={form.stock} onChange={e => setForm(p=>({...p,stock:e.target.value}))} required min="0"/>
                  </div>
                  <div className="form-group" style={{ display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'1.5rem' }}>
                    <input type="checkbox" id="pf" checked={form.petFriendly}
                      onChange={e => setForm(p=>({...p,petFriendly:e.target.checked}))}
                      style={{ width:18, height:18, accentColor:'var(--green)', cursor:'pointer' }}/>
                    <label htmlFor="pf" style={{ margin:0, cursor:'pointer' }}>Pet Friendly</label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom:'1rem' }}>
                  <label>Description *</label>
                  <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} required rows={3}
                    style={{ width:'100%', padding:'0.7rem', border:'2px solid #e5e5e5', borderRadius:8, resize:'vertical', fontFamily:'inherit', outline:'none', fontSize:'0.9rem' }}
                    placeholder="Describe the plant — its benefits, appearance, where it grows best..."/>
                </div>

                <div style={{ padding:'1.2rem', background:'var(--green-pale)', borderRadius:'var(--radius)', marginBottom:'1.5rem' }}>
                  <label style={{ display:'block', fontWeight:600, marginBottom:'1rem', color:'var(--green)' }}>Plant Care Guide</label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                    <div className="form-group"><label>Sunlight</label><input value={form.sunlight} onChange={e => setForm(p=>({...p,sunlight:e.target.value}))} placeholder="e.g. Bright Indirect"/></div>
                    <div className="form-group"><label>Watering</label><input value={form.watering} onChange={e => setForm(p=>({...p,watering:e.target.value}))} placeholder="e.g. Twice per week"/></div>
                    <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Soil Type</label><input value={form.soil} onChange={e => setForm(p=>({...p,soil:e.target.value}))} placeholder="e.g. Well drained potting mix"/></div>
                  </div>
                </div>

                <div style={{ display:'flex', gap:'1rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex:1, padding:'0.9rem', fontSize:'1rem' }}>
                    {editId ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm} style={{ padding:'0.9rem 1.5rem' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products list header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:'1rem' }}>
            <h3>All Plants ({filteredProducts.length})</h3>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative' }}>
                <Search size={16} style={{ position:'absolute', left:10, top:10, color:'#999' }}/>
                <input placeholder="Search plants..." value={searchProduct}
                  onChange={e => setSearchProduct(e.target.value)}
                  style={{ padding:'0.5rem 1rem 0.5rem 2.2rem', border:'2px solid #e5e5e5', borderRadius:8, fontSize:'0.9rem', outline:'none' }}/>
              </div>
              {!showForm && (
                <button className="btn-primary"
                  onClick={() => { resetForm(); setShowForm(true); window.scrollTo(0,0); }}
                  style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Plus size={16}/> Add New Plant
                </button>
              )}
            </div>
          </div>

          <div style={{ overflowX:'auto' }}>
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Plant</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.image} alt={p.name}
                        style={{ width:48, height:48, objectFit:'cover', borderRadius:8 }}
                        onError={e => { e.target.style.display='none'; }}/>
                    </td>
                    <td>
                      <div style={{ fontWeight:600 }}>{p.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--gray)' }}>{p.difficulty} · {p.petFriendly?'Pet Friendly':'Not Pet Safe'}</div>
                    </td>
                    <td><span className="category-tag" style={{ fontSize:'0.75rem' }}>{p.category}</span></td>
                    <td>
                      <strong style={{ color:'var(--green)' }}>₹{p.price}</strong>
                      {p.originalPrice && <div style={{ fontSize:'0.75rem', color:'var(--gray)', textDecoration:'line-through' }}>₹{p.originalPrice}</div>}
                    </td>
                    <td>
                      <span style={{ color:p.stock===0?'var(--red)':p.stock<=5?'var(--orange)':'var(--green)', fontWeight:600 }}>
                        {p.stock===0 ? 'Out of Stock' : p.stock}
                      </span>
                    </td>
                    <td>{p.rating?.toFixed(1)||'0.0'} <span style={{ color:'var(--gray)', fontSize:'0.8rem' }}>({p.numReviews})</span></td>
                    <td>
                      <div style={{ display:'flex', gap:'0.4rem' }}>
                        <button className="btn-outline" style={{ padding:'0.3rem 0.7rem', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:4 }}
                          onClick={() => startEdit(p)}>
                          <Pencil size={13}/> Edit
                        </button>
                        <button className="btn-danger" style={{ padding:'0.3rem 0.7rem', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:4 }}
                          onClick={() => deleteProduct(p._id)}>
                          <Trash2 size={13}/> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length===0 && (
                  <tr><td colSpan={7} style={{ textAlign:'center', padding:'2rem', color:'var(--gray)' }}>
                    No plants found. Click "Add New Plant" to get started.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
