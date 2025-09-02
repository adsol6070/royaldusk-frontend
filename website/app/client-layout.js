"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/common/context/AuthContext";
import { CurrencyProvider } from "@/common/context/CurrencyContext";
import { WishlistProvider } from "@/common/context/WishlistContext";
import { CartProvider } from "@/common/context/CartContext";
import StyledComponentsRegistry from "@/lib/registry";

export default function ClientLayout({ children }) {
  return (
    <StyledComponentsRegistry>
      <AuthProvider>
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <Toaster position="top-right" />
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </AuthProvider>
    </StyledComponentsRegistry>
  );
}
