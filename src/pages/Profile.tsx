import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Package, History, MapPin, Phone, Mail, LogOut, ChevronRight, Clock, Truck, CheckCircle2, AlertCircle, Bike, X, CreditCard, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Order } from '../types';

const Profile = () => {
  const { user, orders, logout, payOrder, uploadPaymentProof } = useApp();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isPaying, setIsPaying] = React.useState<string | null>(null);
  const [proofUrl, setProofUrl] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);

  if (!user) return <Navigate to="/login" />;

  const userOrders = orders.filter(o => o.userId === user.id);

  const handlePay = async (orderId: string) => {
    setIsPaying(orderId);
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const success = await payOrder(orderId);
    if (success) {
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: 'Diproses' } : null);
      }
    }
    setIsPaying(null);
  };

  const handleUploadProof = async () => {
    if (!selectedOrder || !proofUrl) return;
    setIsUploading(true);
    const success = await uploadPaymentProof(selectedOrder.id, proofUrl);
    if (success) {
      setSelectedOrder({ ...selectedOrder, paymentProof: proofUrl });
      setProofUrl('');
    }
    setIsUploading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu Pembayaran': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Diproses': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Dikirim': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Selesai': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Menunggu Pembayaran': return <AlertCircle className="h-4 w-4" />;
      case 'Diproses': return <Clock className="h-4 w-4" />;
      case 'Dikirim': return <Truck className="h-4 w-4" />;
      case 'Selesai': return <CheckCircle2 className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-blue-200">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{user.username}</h2>
                <p className="text-sm text-gray-500 font-medium">{user.email}</p>
              </div>
              <div className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                {user.role === 'admin' ? 'Administrator' : 'Pelanggan Setia'}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{user.phone || 'Belum diatur'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-2">{user.address || 'Belum diatur'}</span>
              </div>
            </div>

            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
            >
              <LogOut className="h-5 w-5" /> Keluar Akun
            </button>
          </div>

          <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold">Butuh Bantuan?</h3>
              <p className="text-sm text-blue-100">Hubungi customer service kami untuk pertanyaan seputar produk dan pesanan.</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
                Hubungi Kami
              </button>
            </div>
            <Bike className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 rotate-12" />
          </div>
        </div>

        {/* Orders Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <Package className="h-7 w-7 text-blue-600" /> Riwayat Pesanan
            </h2>
            <span className="text-sm font-bold text-gray-400">{userOrders.length} Pesanan</span>
          </div>

          {userOrders.length > 0 ? (
            <div className="space-y-6">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="p-6 border-b bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID Pesanan</div>
                      <div className="font-black text-gray-900">{order.id}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal</div>
                      <div className="font-bold text-gray-700">{order.date}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bayar</div>
                      <div className="font-black text-blue-600">Rp {order.total.toLocaleString('id-ID')}</div>
                    </div>
                    <div className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2",
                      getStatusColor(order.status)
                    )}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl overflow-hidden border bg-gray-50 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow">
                          <div className="font-bold text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-gray-400 italic">Metode: {order.paymentMethod}</div>
                      {order.status === 'Menunggu Pembayaran' && (
                        <button 
                          onClick={() => handlePay(order.id)}
                          disabled={isPaying === order.id}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isPaying === order.id ? (
                            <>
                              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Memproses...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3 w-3" />
                              Bayar Sekarang
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Detail Pesanan <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-3xl border border-dashed text-center space-y-4">
              <div className="inline-flex p-4 bg-gray-50 rounded-full text-gray-300">
                <History className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Belum Ada Pesanan</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Anda belum pernah melakukan transaksi di UD. ADIPA.</p>
              <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all">
                Mulai Belanja
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Detail Pesanan</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
              {/* Status Section */}
              <div className="flex flex-wrap gap-4 justify-between items-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Status Pesanan</div>
                  <div className="flex items-center gap-2 text-blue-600 font-black">
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Tanggal Transaksi</div>
                  <div className="text-gray-700 font-bold">{selectedOrder.date}</div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Produk yang Dibeli</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border bg-white">
                      <div className="h-16 w-16 rounded-xl overflow-hidden border bg-gray-50 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">Rp {item.price.toLocaleString('id-ID')}</div>
                        <div className="text-xs text-gray-500">x {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Alamat Pengiriman</h4>
                  <div className="p-4 bg-gray-50 rounded-2xl border text-sm text-gray-600 leading-relaxed">
                    {selectedOrder.address}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Informasi Pembayaran</h4>
                  <div className="p-4 bg-gray-50 rounded-2xl border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Metode</span>
                      <span className="font-bold text-gray-900">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-base pt-2 border-t">
                      <span className="text-gray-500 font-bold">Total Bayar</span>
                      <span className="font-black text-blue-600">Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
              <div>
                {/* Payment Proof Section */}
                {selectedOrder.paymentMethod === 'Transfer Bank' && (
                  <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      <Camera className="h-5 w-5 text-blue-600" />
                      <span>Bukti Pembayaran</span>
                    </div>
                    
                    {selectedOrder.paymentProof ? (
                      <div className="space-y-2">
                        <div className="aspect-video rounded-xl overflow-hidden border bg-white">
                          <img src={selectedOrder.paymentProof} alt="Bukti Pembayaran" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <p className="text-xs text-center text-gray-400 italic">Bukti pembayaran telah diunggah</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500 italic">Belum ada bukti pembayaran. Silakan unggah URL gambar bukti transfer Anda.</p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="URL Gambar Bukti Transfer..." 
                            value={proofUrl}
                            onChange={(e) => setProofUrl(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <button 
                            onClick={handleUploadProof}
                            disabled={isUploading || !proofUrl}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold disabled:opacity-50"
                          >
                            {isUploading ? 'Mengunggah...' : 'Unggah'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedOrder.status === 'Menunggu Pembayaran' && (
                  <button 
                    onClick={() => handlePay(selectedOrder.id)}
                    disabled={isPaying === selectedOrder.id}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                  >
                    {isPaying === selectedOrder.id ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses Pembayaran...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Bayar Sekarang
                      </>
                    )}
                  </button>
                )}
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-white border text-gray-600 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-all"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
