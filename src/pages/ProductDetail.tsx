import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, user, addReview } = useApp();
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'ulasan'>('deskripsi');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const product = products.find(p => p.id.toString() === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Produk tidak ditemukan</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold flex items-center gap-2 justify-center">
          <ArrowLeft className="h-5 w-5" /> Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) return;

    addReview(product.id, {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.username,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    });

    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
        <ArrowLeft className="h-5 w-5" /> Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border bg-white">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider">
              {product.category}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star className="h-5 w-5 fill-current" />
                {Number(product.rating || 0).toFixed(1)}
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 text-sm font-medium">{product.reviews?.length || 0} Ulasan</span>
              <span className="text-gray-400">|</span>
              <span className="text-green-600 text-sm font-bold">{product.stock} Stok Tersedia</span>
            </div>
            <div className="text-3xl font-black text-blue-600">
              Rp {product.price.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShieldCheck className="h-5 w-5" /></div>
              <span className="text-xs font-medium text-gray-600">Garansi Resmi 1 Tahun</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Truck className="h-5 w-5" /></div>
              <span className="text-xs font-medium text-gray-600">Pengiriman Aman</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><RotateCcw className="h-5 w-5" /></div>
              <span className="text-xs font-medium text-gray-600">7 Hari Pengembalian</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-6 w-6" /> Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('deskripsi')}
            className={cn(
              "px-8 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'deskripsi' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Deskripsi Produk
          </button>
          <button 
            onClick={() => setActiveTab('ulasan')}
            className={cn(
              "px-8 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'ulasan' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            Ulasan Pelanggan ({product.reviews?.length || 0})
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'deskripsi' ? (
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl border">
                  <h4 className="font-bold text-gray-900 mb-2">Spesifikasi Utama</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Rangka: Alloy Aluminum</li>
                    <li>• Ukuran Ban: 27.5 Inch</li>
                    <li>• Kecepatan: 21 Speed</li>
                    <li>• Rem: Mechanical Disc Brake</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border">
                  <h4 className="font-bold text-gray-900 mb-2">Kelengkapan</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Buku Manual</li>
                    <li>• Kartu Garansi</li>
                    <li>• Toolkit Standar</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Review Form */}
              <div className="bg-gray-50 p-6 rounded-2xl border">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" /> Tulis Ulasan
                </h3>
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={cn(
                            "p-1 transition-all",
                            star <= reviewRating ? "text-yellow-500" : "text-gray-300"
                          )}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Bagikan pengalaman Anda menggunakan sepeda ini..."
                    className="w-full p-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                  <button 
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Kirim Ulasan
                  </button>
                </form>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map(review => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{review.userName}</div>
                            <div className="text-xs text-gray-400">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed pl-13">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 italic">
                    Belum ada ulasan untuk produk ini.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
