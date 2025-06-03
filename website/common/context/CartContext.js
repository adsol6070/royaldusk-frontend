"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Helper function to parse price
const parsePriceToNumber = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    // Remove currency symbol and any non-numeric characters except decimal point
    return parseFloat(price.replace(/[^0-9.-]+/g, "")) || 0;
  }
  return 0;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load cart items from localStorage on mount
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // Save cart items to localStorage whenever they change
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const addToCart = (packageItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === packageItem.id);
      if (existingItem) {
        return prevItems;
      }
      return [...prevItems, {
        ...packageItem,
        price: parsePriceToNumber(packageItem.price), // Convert price to number when adding to cart
        startDate: null,
        travelers: 1,
      }];
    });
  };

  const removeFromCart = (packageId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== packageId));
  };

  const updateCartItem = (packageId, updates) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === packageId ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  if (!mounted) {
    return null;
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 