"use client";

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/common/context/AuthContext';
import { CartProvider } from '@/common/context/CartContext';
import StyledComponentsRegistry from '@/lib/registry';

export default function ClientLayout({ children }) {
  return (
    <StyledComponentsRegistry>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </StyledComponentsRegistry>
  );
} 