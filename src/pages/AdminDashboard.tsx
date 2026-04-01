import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Plus, Edit, Trash2, CheckCircle2, Truck, Clock, AlertCircle, Search, Filter, ArrowUpRight, ArrowDownRight, Home, LogOut, Bike, Menu, X, Mail, Phone, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Produk', icon: Package },
    { path: '/admin/orders', label: 'Pesanan', icon: ShoppingBag },
    { path: '/admin/users', label: 'Pelanggan', icon: Users },
    { path: '/admin/reports', label: 'Laporan', icon: BarChart3 },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-8 flex items-center gap-3">
        <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
          <Bike className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-gray-900 leading-none">UD. ADIPA</span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Admin Central</span>
        </div>
      </div>

      <nav className="px-4 space-y-1.5 flex-grow">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
              location.pathname === item.path 
                ? "bg-gray-900 text-white shadow-xl shadow-gray-200 translate-x-1" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className={cn("h-5 w-5", location.pathname === item.path ? "text-blue-400" : "text-gray-400")} />
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div className="p-6 border-t border-gray-100 space-y-3">
        <div className="bg-blue-50 p-4 rounded-2xl mb-4">
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Logged in as</div>
          <div className="text-sm font-black text-gray-900 truncate">{user.username}</div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all"
        >
          <Home className="h-5 w-5" />
          Toko Utama
        </Link>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:block sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={cn(
        "fixed top-0 bottom-0 left-0 w-72 bg-white z-50 transition-transform duration-500 ease-in-out lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-blue-600" />
            <span className="font-black text-gray-900">UD. ADIPA</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-gray-50 rounded-xl text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <main className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          <React.Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/products" element={<ProductsManager />} />
              <Route path="/orders" element={<OrdersManager />} />
              <Route path="/users" element={<UsersManager />} />
              <Route path="/reports" element={<ReportsManager />} />
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </div>
  );
};

const Overview = () => {
  const { products, orders } = useApp();
  
  const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock), 0);

  const stats = [
    { 
      label: 'Total Penjualan', 
      value: `Rp ${totalSales.toLocaleString('id-ID')}`, 
      icon: BarChart3, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      trend: '+12.5%', 
      isUp: true,
      description: 'Pendapatan kotor bulan ini'
    },
    { 
      label: 'Total Pesanan', 
      value: totalOrders, 
      icon: ShoppingBag, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      trend: '+8.2%', 
      isUp: true,
      description: 'Pesanan masuk hari ini'
    },
    { 
      label: 'Total Produk', 
      value: totalProducts, 
      icon: Package, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      trend: '0%', 
      isUp: true,
      description: 'Varian produk aktif'
    },
    { 
      label: 'Total Stok', 
      value: totalStock, 
      icon: Users, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      trend: '-2.4%', 
      isUp: false,
      description: 'Total unit tersedia'
    },
  ];

  const chartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'Mei', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Selamat datang kembali, Admin. Berikut ringkasan toko Anda.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-2 bg-gray-50 rounded-xl">
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-xs font-bold text-gray-500 pr-4">
            Update: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
              <div className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</div>
              <p className="text-[11px] text-gray-400 font-medium">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Performa Penjualan</h3>
            <select className="text-xs font-bold bg-gray-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fontWeight: 700, fill: '#94a3b8'}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fontWeight: 700, fill: '#94a3b8'}} 
                />
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px'}}
                  itemStyle={{fontSize: '12px', fontWeight: 900, color: '#1e293b'}}
                  labelStyle={{fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Pesanan Baru</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</Link>
          </div>
          <div className="space-y-5">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">Rp {Number(order.total).toLocaleString('id-ID')}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                  </div>
                </div>
                <div className={cn(
                  "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                  order.status === 'Selesai' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  {order.status}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400 font-bold italic">Belum ada pesanan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsManager = () => {
  const { products, deleteProduct, addProduct, updateProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    image: ''
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: 0, stock: 0, description: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData });
    } else {
      addProduct(formData as any);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Katalog Produk</h1>
          <p className="text-gray-500 font-medium mt-1">Kelola inventaris dan detail produk sepeda Anda.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-[20px] font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-gray-200"
        >
          <Plus className="h-5 w-5" /> Tambah Produk
        </button>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden p-10 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">{editingProduct ? 'Edit Produk' : 'Produk Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Produk</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900" placeholder="Contoh: Polygon Xtrada" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900">
                    <option value="">Pilih Kategori</option>
                    <option value="Mountain Bike">Mountain Bike</option>
                    <option value="Folding Bike">Folding Bike</option>
                    <option value="Road Bike">Road Bike</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Harga (Rp)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stok Unit</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Gambar</label>
                <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deskripsi Produk</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 h-32 resize-none" placeholder="Jelaskan detail produk..." />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-sm text-gray-400 hover:bg-gray-50 transition-all">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              placeholder="Cari nama atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="absolute left-5 top-4 h-6 w-6 text-gray-300" />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            Menampilkan <span className="text-gray-900">{filteredProducts.length}</span> Produk
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Produk</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kategori</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Harga</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stok</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(product => (
                <tr key={product.id} className="group hover:bg-gray-50/30 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-[20px] overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-base tracking-tight">{product.name}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-lg font-black text-xs",
                      product.stock < 5 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      <div className={cn("h-1.5 w-1.5 rounded-full", product.stock < 5 ? "bg-rose-600" : "bg-emerald-600")} />
                      {product.stock} Unit
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm('Hapus produk ini?')) deleteProduct(product.id); }}
                        className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OrdersManager = () => {
  const { orders, updateOrderStatus } = useApp();
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu Pembayaran': return 'bg-amber-50 text-amber-600';
      case 'Diproses': return 'bg-blue-50 text-blue-600';
      case 'Dikirim': return 'bg-indigo-50 text-indigo-600';
      case 'Selesai': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manajemen Pesanan</h1>
          <p className="text-gray-500 font-medium mt-1">Pantau status transaksi dan validasi bukti pembayaran.</p>
        </div>
      </div>

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md" onClick={() => setSelectedProof(null)}>
          <div className="bg-white p-4 rounded-[32px] shadow-2xl max-w-2xl w-full animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 px-4">
              <h3 className="font-black text-gray-900">Bukti Pembayaran</h3>
              <button onClick={() => setSelectedProof(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden border bg-gray-50">
              <img src={selectedProof} alt="Bukti Transfer" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID Pesanan</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pelanggan</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Bayar</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="group hover:bg-gray-50/30 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="font-black text-gray-900 text-sm">#{order.id.slice(-6).toUpperCase()}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{new Date(order.date).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-black text-gray-400">
                        {order.userId.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-bold text-gray-600">{order.userId}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-blue-600 text-sm">Rp {Number(order.total).toLocaleString('id-ID')}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{order.paymentMethod}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", getStatusColor(order.status))}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      {order.paymentProof && (
                        <button 
                          onClick={() => setSelectedProof(order.paymentProof!)}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                          title="Lihat Bukti"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="text-[10px] font-black uppercase tracking-widest bg-gray-50 border-none rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                      >
                        <option value="Menunggu Pembayaran">Menunggu</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Dikirim">Dikirim</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-10 w-10 text-gray-200" />
                    </div>
                    <p className="text-sm text-gray-400 font-bold italic">Belum ada pesanan masuk.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UsersManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('adipa_token');
      try {
        const res = await fetch("/api/admin/users", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Database Pelanggan</h1>
        <p className="text-gray-500 font-medium mt-1">Daftar seluruh pengguna yang terdaftar di sistem.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pelanggan</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kontak</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tanggal Gabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold italic">Memuat data...</td>
                </tr>
              ) : users.map(u => (
                <tr key={u.id} className="group hover:bg-gray-50/30 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-sm">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-sm">{u.username}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">UID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {u.email}
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                          <Phone className="h-3 w-3" />
                          {u.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                      u.role === 'admin' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-gray-600">{new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ReportsManager = () => {
  const [data, setData] = useState<any>(null);

  React.useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('adipa_token');
      try {
        const res = await fetch("/api/admin/reports", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const reportData = await res.json();
          // Ensure numeric values are numbers
          const processedData = {
            salesByDate: reportData.salesByDate.map((item: any) => ({
              ...item,
              total_sales: Number(item.total_sales),
              order_count: Number(item.order_count)
            })),
            topProducts: reportData.topProducts.map((item: any) => ({
              ...item,
              total_sold: Number(item.total_sold)
            }))
          };
          setData(processedData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Menganalisis Data...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Laporan Analitik</h1>
        <p className="text-gray-500 font-medium mt-1">Data statistik penjualan dan performa produk.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Tren Penjualan (30 Hari)</h3>
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="total_sales" stroke="#2563eb" strokeWidth={4} fill="url(#reportSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Produk Terlaris</h3>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="total_sold" fill="#2563eb" radius={[0, 10, 10, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
