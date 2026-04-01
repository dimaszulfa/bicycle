import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu, X, Bike, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { cn } from './lib/utils';

// Pages (to be created)
const Home = React.lazy(() => import('./pages/Home'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Profile = React.lazy(() => import('./pages/Profile'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

const Header = () => {
  const { user, cart, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Bike className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-gray-900">UD. ADIPA</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/#products" className="text-sm font-medium text-gray-700 hover:text-blue-600">Produk</Link>
            <Link to="/#about" className="text-sm font-medium text-gray-700 hover:text-blue-600">Tentang</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari sepeda..."
                className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  <User className="h-5 w-5" />
                  {user.username}
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-gray-600 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2">Login</Link>
                <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
          <Link to="/" className="block text-base font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/#products" className="block text-base font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Produk</Link>
          <Link to="/#about" className="block text-base font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Tentang</Link>
          <div className="pt-4 border-t">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="block text-base font-medium text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>Profil ({user.username})</Link>
                <button onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }} className="block w-full text-left text-base font-medium text-red-600 py-2">Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="block text-center py-2 border rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block text-center py-2 bg-blue-600 text-white rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-white mb-4">
              <Bike className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">UD. ADIPA</span>
            </div>
            <p className="text-sm leading-relaxed">
              Toko sepeda terpercaya yang menyediakan berbagai jenis sepeda berkualitas untuk kebutuhan hobi dan mobilitas Anda.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-500">Beranda</Link></li>
              <li><Link to="/#products" className="hover:text-blue-500">Produk</Link></li>
              <li><Link to="/#about" className="hover:text-blue-500">Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0812-3456-7890</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@adipa-bike.com</li>
              <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> @ud.adipa_bike</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} UD. ADIPA Bicycle Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <React.Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
