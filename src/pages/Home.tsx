import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight, Bike, ShieldCheck, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const Home = () => {
  const { products, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'Semua' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center overflow-hidden bg-blue-900">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1507035895480-2b544cb897ad?auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Temukan Sepeda Impian Anda di <span className="text-blue-400">UD. ADIPA</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-lg">
              Koleksi sepeda terbaik dari berbagai merek ternama. Kualitas terjamin, harga bersaing, dan pelayanan prima untuk setiap pelanggan.
            </p>
            <div className="flex gap-4">
              <a href="#products" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
                Belanja Sekarang
              </a>
              <a href="#about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-bold transition-all">
                Tentang Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Bike className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Koleksi Lengkap</h3>
              <p className="text-sm text-gray-500">Berbagai jenis sepeda mulai dari MTB, Road Bike, hingga Sepeda Lipat.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-xl text-green-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Garansi Resmi</h3>
              <p className="text-sm text-gray-500">Semua produk kami memiliki garansi resmi dari produsen.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Pengiriman Cepat</h3>
              <p className="text-sm text-gray-500">Layanan pengiriman aman dan cepat ke seluruh wilayah Indonesia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Katalog Sepeda</h2>
            <p className="text-gray-500">Pilih sepeda yang sesuai dengan gaya hidup Anda.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedCategory === cat 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-white text-gray-600 border hover:border-blue-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300">
              <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {product.category}
                </div>
              </Link>
              
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <Link to={`/product/${product.id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    {Number(product.rating || 0).toFixed(1)}
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-extrabold text-blue-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                  Stok: {product.stock} unit tersedia
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=800&q=80" 
                  alt="UD. ADIPA Store" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-8 rounded-3xl shadow-xl hidden lg:block">
                <div className="text-4xl font-bold mb-1">10+</div>
                <div className="text-sm font-medium opacity-80">Tahun Pengalaman</div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Tentang UD. ADIPA</h2>
              <p className="text-gray-600 leading-relaxed">
                UD. ADIPA adalah toko sepeda yang telah berdiri sejak lama, melayani kebutuhan komunitas pesepeda di wilayah kami. Kami percaya bahwa bersepeda bukan hanya sekadar hobi, melainkan gaya hidup sehat dan ramah lingkungan.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Visi kami adalah menjadi pusat penyedia sepeda dan perlengkapannya yang terlengkap dan terpercaya, dengan mengutamakan kepuasan pelanggan melalui produk berkualitas dan layanan purna jual yang handal.
              </p>
              <div className="pt-4">
                <button className="flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
                  Pelajari Lebih Lanjut <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
