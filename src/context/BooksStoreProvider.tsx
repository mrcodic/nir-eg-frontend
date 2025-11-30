"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useStore } from "zustand";
import { type CartState, createCartStore } from "./booksCartStore";

export type CartStoreApi = ReturnType<typeof createCartStore>;

export const CartStoreContext = createContext<CartStoreApi | undefined>(
  undefined
);

export interface CartStoreProviderProps {
  children: ReactNode;
}

export const BooksStoreProvider = ({ children }: CartStoreProviderProps) => {
  const storeRef = useRef<CartStoreApi | null>(null);
  const isInitializedRef = useRef(false);

  if (!storeRef.current) {
    storeRef.current = createCartStore();
  }

  // Initialize cart only on client-side, after mount
  useEffect(() => {
    if (!isInitializedRef.current && storeRef.current) {
      isInitializedRef.current = true;
      const store = storeRef.current.getState();
      store.initializeCart();
    }
  }, []);

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  );
};

export function useCartStore(): CartState;
export function useCartStore<T>(selector: (store: CartState) => T): T;
export function useCartStore<T>(selector?: (store: CartState) => T) {
  const cartStoreContext = useContext(CartStoreContext);

  if (!cartStoreContext) {
    throw new Error("useCartStore must be used within BooksStoreProvider");
  }

  return useStore(cartStoreContext, selector || ((state) => state as T));
}
