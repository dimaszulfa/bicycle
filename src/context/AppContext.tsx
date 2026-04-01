import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, CartItem, Order, Review } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface AppContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderData: Partial<Order>) => void;
  payOrder: (orderId: string) => Promise<boolean>;
  uploadPaymentProof: (orderId: string, proofUrl: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addReview: (productId: string, review: Review) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const apiUrl = (path: string) => {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path}`;
};

const getApiErrorMessage = async (res: Response) => {
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const payload = await res.json().catch(() => null);
    if (payload?.error) return payload.error;
  }

  if (res.status === 404) {
    return 'Server API tidak ditemukan. Periksa URL backend (VITE_API_BASE_URL).';
  }

  return `Request gagal (${res.status})`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('adipa_token');
    try {
      const res = await fetch(apiUrl('/api/orders'), {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        const formattedData = data.map((o: any) => ({ 
          ...o, 
          id: o.id.toString(),
          userId: (o.userid || o.userId || '').toString(),
          paymentMethod: o.paymentmethod || o.paymentMethod || ''
        }));
        setOrders(formattedData);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  // Load from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl('/api/products'));
        if (res.ok) {
          const data = await res.json();
          const formattedData = data.map((p: any) => ({ ...p, id: p.id.toString() }));
          setProducts(formattedData);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    const checkAuth = async () => {
      const token = localStorage.getItem('adipa_token');
      if (!token) return;

      try {
        const res = await fetch(apiUrl('/api/auth/me'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser({ ...userData, id: userData.id.toString() });
          fetchOrders(); // Fetch orders after auth check
        } else {
          localStorage.removeItem('adipa_token');
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };

    checkAuth();
    fetchProducts();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { user: userData, token } = await res.json();
        setUser({ ...userData, id: userData.id.toString() });
        localStorage.setItem('adipa_token', token);
        fetchOrders(); // Fetch orders after login
        return { success: true };
      } else {
        const errorMessage = await getApiErrorMessage(res);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("Login failed", err);
      const detail = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: `Tidak bisa terhubung ke server API. (${detail})` };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adipa_token');
  };

  const register = async (userData: any) => {
    try {
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const { user: userDataResult, token } = await res.json();
        setUser({ ...userDataResult, id: userDataResult.id.toString() });
        localStorage.setItem('adipa_token', token);
        fetchOrders(); // Fetch orders after registration
        return { success: true };
      } else {
        const errorMessage = await getApiErrorMessage(res);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("Registration failed", err);
      const detail = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: `Tidak bisa terhubung ke server API. (${detail})` };
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (orderData: Partial<Order>) => {
    const token = localStorage.getItem('adipa_token');
    const orderPayload = {
      userId: user?.id || 'guest',
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      address: orderData.address || user?.address || '',
      paymentMethod: orderData.paymentMethod || 'Transfer Bank',
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const newOrder = await res.json();
        const formattedOrder = { 
          ...newOrder, 
          id: newOrder.id.toString(),
          userId: (newOrder.userid || newOrder.userId || '').toString(),
          paymentMethod: newOrder.paymentmethod || newOrder.paymentMethod || ''
        };
        setOrders(prev => [formattedOrder, ...prev]);
        
        // Update stock locally (or re-fetch)
        setProducts(prev => prev.map(p => {
          const cartItem = cart.find(item => item.id.toString() === p.id.toString());
          if (cartItem) {
            return { ...p, stock: p.stock - cartItem.quantity };
          }
          return p;
        }));

        clearCart();
      }
    } catch (err) {
      console.error("Failed to place order", err);
    }
  };

  const payOrder = async (orderId: string) => {
    const token = localStorage.getItem('adipa_token');
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: "PATCH",
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Diproses' } : o));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to pay order", err);
      return false;
    }
  };

  const uploadPaymentProof = async (orderId: string, proofUrl: string) => {
    const token = localStorage.getItem('adipa_token');
    try {
      const res = await fetch(`/api/orders/${orderId}/payment-proof`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ paymentProof: proofUrl }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentProof: proofUrl } : o));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to upload payment proof", err);
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const token = localStorage.getItem('adipa_token');
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const addProduct = async (product: Product) => {
    const token = localStorage.getItem('adipa_token');
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const savedProduct = await res.json();
        const formattedProduct = { ...savedProduct, id: savedProduct.id.toString() };
        setProducts(prev => [formattedProduct, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const updateProduct = async (product: Product) => {
    const token = localStorage.getItem('adipa_token');
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(prev => prev.map(p => p.id === product.id ? { ...updatedProduct, id: updatedProduct.id.toString() } : p));
      }
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  const deleteProduct = async (productId: string) => {
    const token = localStorage.getItem('adipa_token');
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReviews = [...(p.reviews || []), review];
        const newRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return { ...p, reviews: newReviews, rating: newRating };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      user, products, cart, orders,
      login, logout, register,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, payOrder, uploadPaymentProof, updateOrderStatus,
      addProduct, updateProduct, deleteProduct, addReview
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
