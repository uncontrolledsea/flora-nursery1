import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Shield } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', adminCode: '' });
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (role === 'admin' && !form.adminCode) { toast.error('Admin secret code is required'); return; }

    try {
      setLoading(true);
      const { data } = await API.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
        role, adminCode: form.adminCode,
      });
      login(data);
      toast.success(`Welcome to FloraNursery, ${data.name}`);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="form-box">
        <h2><Leaf size={20} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Join FloraNursery</h2>

        {/* Role Selector */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.83rem', color: 'var(--gray)', marginBottom: '0.5rem', fontWeight: 600 }}>Register as</label>
          <div className="role-selector">
            <div className={`role-option ${role === 'user' ? 'selected' : ''}`} onClick={() => setRole('user')}>
              <User size={22} color={role === 'user' ? '#2d6a4f' : '#888'} />
              <span className="role-label">Customer</span>
            </div>
            <div className={`role-option ${role === 'admin' ? 'selected' : ''}`} onClick={() => setRole('admin')}>
              <Shield size={22} color={role === 'admin' ? '#2d6a4f' : '#888'} />
              <span className="role-label">Admin</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { field: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
            { field: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
            { field: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
            { field: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field} className="form-group">
              <label>{label}</label>
              <input type={type} placeholder={placeholder} value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} required />
            </div>
          ))}

          {role === 'admin' && (
            <div className="form-group">
              <label>Admin Secret Code</label>
              <input type="password" placeholder="Enter the admin secret code" value={form.adminCode} onChange={e => setForm(p => ({ ...p, adminCode: e.target.value }))} required />
              <p style={{ fontSize: '0.76rem', color: 'var(--gray)', marginTop: '0.3rem' }}>
                This code is set by the project owner in the backend .env file (ADMIN_SECRET_CODE).
              </p>
            </div>
          )}

          <button type="submit" className="btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : `Create ${role === 'admin' ? 'Admin' : 'Customer'} Account`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--gray)', fontSize: '0.88rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--green)', fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
