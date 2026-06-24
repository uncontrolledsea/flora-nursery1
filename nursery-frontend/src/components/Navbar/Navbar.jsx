import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../../App';
import { Leaf, ShoppingCart, Package, Heart, User, Settings, LogOut, Search, Menu, X, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/?search=${encodeURIComponent(search.trim())}`); setMenuOpen(false); }
  };

  const handleLogout = () => { logout(); toast.success('Logged out successfully'); navigate('/'); setMenuOpen(false); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand"><Leaf size={24} strokeWidth={2.4} /> FloraNursery</Link>

      <div className="navbar-center">
        <form className="search-bar" onSubmit={handleSearch}>
          <input type="text" placeholder="Search plants..." value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit"><Search size={17} /></button>
        </form>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}><Leaf size={15} /> Home</Link>
        <Link to="/plant-finder" onClick={() => setMenuOpen(false)}><Sparkles size={15} /> Plant Finder</Link>
        <Link to="/sustainability" onClick={() => setMenuOpen(false)}><Leaf size={15} /> Eco Dashboard</Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>
          <ShoppingCart size={15} /> Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        {user ? (
          <>
            <Link to="/my-plant-care" onClick={() => setMenuOpen(false)}><Calendar size={15} /> My Plant Care</Link>
            <Link to="/orders" onClick={() => setMenuOpen(false)}><Package size={15} /> Orders</Link>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}><Heart size={15} /> Wishlist</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}><User size={15} /> {user.name.split(' ')[0]}</Link>
            {user.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)}><Settings size={15} /> Admin</Link>}
            <button onClick={handleLogout}><LogOut size={15} /> Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}><User size={15} /> Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
