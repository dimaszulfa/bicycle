import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Wallet, Building, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, placeOrder, user } = useApp();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50000 : 0;
  const total = subtotal + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    placeOrder({ address, paymentMethod });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      navigate('/profile');
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-6 bg-green-100 rounded-full text-green-600 animate-bounce">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Pesanan Berhasil!</h2>
        <p className="text-gray-500 max-w-md">
          Terima kasih telah berbelanja di UD. ADIPA. Pesanan Anda sedang kami proses. Silakan cek riwayat transaksi untuk status pengiriman.
        </p>
        <Link to="/profile" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">
          Lihat Pesanan Saya
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-6 bg-blue-50 rounded-full text-blue-600">
          <ShoppingBag className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Keranjang Anda Kosong</h2>
        <p className="text-gray-500">Sepertinya Anda belum menambahkan sepeda apapun ke keranjang.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Keranjang Belanja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row gap-6 items-center">
              <div className="h-32 w-32 rounded-2xl overflow-hidden border bg-gray-50 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-grow space-y-2 text-center sm:text-left">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.category}</div>
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <div className="text-lg font-black text-blue-600">Rp {item.price.toLocaleString('id-ID')}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-xl p-1 bg-gray-50">
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Checkout */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border shadow-sm sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Biaya Pengiriman</span>
                <span className="text-gray-900 font-bold">Rp {shipping.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-black text-gray-900">
                <span>Total</span>
                <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {!isCheckingOut ? (
              <button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Lanjut ke Pembayaran <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-6 pt-4 border-t">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat Pengiriman</label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap pengiriman..."
                    className="w-full p-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Metode Pembayaran</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'Transfer Bank', icon: Building, label: 'Transfer Bank (Manual)' },
                      { id: 'E-Wallet', icon: Wallet, label: 'E-Wallet (OVO/Dana/Gopay)' },
                      { id: 'Kartu Kredit', icon: CreditCard, label: 'Kartu Kredit/Debit' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          "flex items-center gap-3 p-4 border rounded-xl text-sm font-bold transition-all",
                          paymentMethod === method.id ? "border-blue-600 bg-blue-50 text-blue-600" : "hover:border-gray-300 text-gray-600"
                        )}
                      >
                        <method.icon className="h-5 w-5" />
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="flex-1 border py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    Bayar Sekarang
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
