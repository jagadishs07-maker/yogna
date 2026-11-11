'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PRODUCTS } from '@/data/products';

export interface CartProduct {
  id: string;
  name: string;
  category: string;
  image?: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Toast
  toast: { visible: boolean; message: string };
}

const STORAGE_KEY = 'yogna_enquiry_cart_v1';

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toast: { visible: false, message: '' },
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Enrich items with image/category if missing from older sessions
          const enriched: CartItem[] = parsed.map(item => {
            const prod = PRODUCTS.find(p => p.id === item.id);
            return {
              ...item,
              image: item.image || prod?.image || '',
              category: item.category || prod?.category || '',
            };
          });
          setItems(enriched);
        }
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when items change (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [items, isLoaded]);

  const showToast = useCallback((message: string) => {
    // clear any existing timer
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2800);
  }, []);

  const addToCart = useCallback((product: CartProduct) => {
    const resolvedImage = product.image || PRODUCTS.find(p => p.id === product.id)?.image || '';
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1, image: i.image || resolvedImage }
            : i
        );
      }
      return [...prev, { ...product, image: resolvedImage, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to enquiry`);
  }, [showToast]);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart  = useCallback(() => setItems([]), []);
  const openCart   = useCallback(() => setIsCartOpen(true), []);
  const closeCart  = useCallback(() => setIsCartOpen(false), []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, count, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, openCart, closeCart, toast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
