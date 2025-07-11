"use client";

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/common/context/AuthContext';
import { CurrencyProvider } from '@/common/context/CurrencyContext';
import StyledComponentsRegistry from '@/lib/registry';

export default function ClientLayout({ children }) {
  return (
    <StyledComponentsRegistry>
      <AuthProvider>
          <CurrencyProvider>
          {children}
          <Toaster position="top-right" />
          </CurrencyProvider>
      </AuthProvider>
    </StyledComponentsRegistry>
  );
} 