import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Bike, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      // Check user role from the state updated by login
      // We need to wait for state or just use the result if we returned it
      // Actually, let's just check the user state in a useEffect or just navigate based on common sense
      // For now, let's assume the login function updates the state and we can navigate
      navigate('/');
    } else {
      setError(result.error || 'Login gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center space-y-4">
          <div className="inline-flex p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Bike className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Selamat Datang</h2>
          <p className="text-blue-100 text-sm">Masuk ke akun UD. ADIPA Anda untuk mulai berbelanja.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email atau Username</label>
            <div className="relative">
              <input
                required
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Lupa Password?</a>
            </div>
            <div className="relative">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : 'Masuk Sekarang'} <LogIn className="h-5 w-5" />
          </button>

          <div className="text-center text-sm text-gray-500">
            Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar Gratis</Link>
          </div>

          <div className="pt-4 border-t text-[10px] text-center text-gray-400 uppercase tracking-widest">
            UD. ADIPA Bicycle Shop
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
