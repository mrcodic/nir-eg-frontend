import { getClientData } from "@/helpers/client-fetch";
import { toast } from "@/hooks/use-toast";
import cartServices from "@/services/cart.service";
import { Book, BookLinksSettings } from "@/types/books.types";

import Cookies from "js-cookie";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

// Types
export interface CartItem extends Book {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isCartHydrated: boolean;
  cartId: number | null;
  error: string | null;

  // Actions
  addToCart: (book: Book) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  decrementQuantity: (id: string) => Promise<void>;
  incrementQuantity: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Sync actions
  initializeCart: () => Promise<void>;
  resetCartState: () => void;

  // Getters
  getTotalPrice: () => number;
  getTotalItems: () => number;
  checkIfItemExists: (id: string) => CartItem | undefined;
  getItemQuantity: (id: string) => number;
}

export const createCartStore = (initState?: Partial<CartState>) => {
  return createStore<CartState>()(
    persist(
      immer((set, get) => ({
        items: initState?.items || [],
        cartId: null,
        isLoading: false,
        isCartHydrated: false,
        error: null,

        // Initialize cart: fetch from server, fallback to localStorage
        initializeCart: async () => {
          // Prevent multiple initializations

          if (typeof window === "undefined") {
            console.warn("initializeCart called on server, skipping");
            return;
          }

          if (get().isCartHydrated) return;

          console.log("🛒 ~ initializeCart");

          const booksSettings = await getClientData<{
            data: BookLinksSettings;
          }>({
            queryKey: ["settings/books"],
            optionalAuth: true,
          });

          if (booksSettings?.data?.hide_books === 1) {
            console.log("cart settings is disabled");
            set((state) => {
              state.items = [];
              state.cartId = null;
              state.isLoading = false;
              state.isCartHydrated = true;
              state.error = null;
            });

            return;
          }

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            // Try to fetch cart from server
            const serverCart = await cartServices.fetchCart();

            console.log(
              "🛒 ~ initializeCart response ~ serverCart:",
              serverCart,
            );

            set((state) => {
              // If server has items, use them
              if (serverCart?.data?.items?.length > 0) {
                state.items =
                  serverCart?.data?.items?.map((item) => ({
                    ...item?.book,
                    quantity: item?.quantity,
                  })) || [];
              } else {
                state.items = [];
              }

              state.cartId = serverCart?.data?.id;
              state.isLoading = false;
              state.isCartHydrated = true;

              // remove presisted cart from localStorage
              if (
                serverCart?.data?.owner?.guest_token &&
                serverCart?.data?.owner?.type === "guest"
              ) {
                Cookies.set(
                  "guest_token",
                  serverCart?.data?.owner?.guest_token,
                );
              }
              localStorage.removeItem("cart-storage");
            });
          } catch (error) {
            // On error, keep localStorage data
            // localStorage items (from persist) are already loaded

            console.error("Failed to fetch cart from server:", error);
            set((state) => {
              state.isLoading = false;
              state.isCartHydrated = true;
              state.error =
                error instanceof Error ? error.message : "Failed to load cart";
            });
          }
        },

        addToCart: async (book) => {
          // Optimistic update
          set((state) => {
            const existingItem = state.items.find(
              (item) => item.id === book.id,
            );
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              state.items.push({ ...book, quantity: 1 });
            }
          });

          try {
            const item = get().items.find((i) => i.id === book.id);
            if (item) {
              await cartServices.addItem(item);
            }
          } catch (error) {
            // Rollback on error
            set((state) => {
              const existingItem = state.items.find(
                (item) => item.id === book.id,
              );
              if (existingItem) {
                if (existingItem.quantity > 1) {
                  existingItem.quantity -= 1;
                } else {
                  state.items = state.items.filter(
                    (item) => item.id !== book.id,
                  );
                }
              }
              state.error =
                error instanceof Error
                  ? error.message
                  : "Failed to add to cart";
            });

            toast({
              icon: "error",
              description: "حدث خطأ اثناء اضافة الكتاب",
            });
          }
        },

        removeFromCart: async (id) => {
          // Store previous state for rollback
          const previousItems = [...get().items];

          // Optimistic update
          set((state) => {
            state.items = state.items.filter((item) => item.id !== id);
          });

          try {
            await cartServices.removeItem(id);
          } catch (error) {
            console.log("🚀 ~ removeFromCart ~ error:", error);
            // Rollback on error
            set((state) => {
              state.items = previousItems;
              state.error =
                error instanceof Error
                  ? error.message
                  : "Failed to remove from cart";
            });

            toast({
              icon: "error",
              description: "حدث خطأ اثناء حذف الكتاب",
            });
          }
        },

        decrementQuantity: async (id) => {
          const item = get().items.find((item) => item.id === id);
          const previousQuantity = item?.quantity || 0;

          // Optimistic update
          set((state) => {
            const item = state.items.find((item) => item.id === id);
            if (item) {
              if (item.quantity > 1) {
                item.quantity -= 1;
              } else {
                state.items = state.items.filter((item) => item.id !== id);
              }
            }
          });

          try {
            await cartServices.updateItem(id, -1);
          } catch (error) {
            // Rollback on error
            set((state) => {
              const item = state.items.find((item) => item.id === id);
              if (item) {
                item.quantity = previousQuantity;
              } else if (previousQuantity === 1) {
                // Item was removed, add it back
                const originalItem = get().items.find((i) => i.id === id);
                if (originalItem) {
                  state.items.push({ ...originalItem, quantity: 1 });
                }
              }
              state.error =
                error instanceof Error
                  ? error.message
                  : "Failed to update quantity";
            });

            toast({
              icon: "error",
              description: "حدث خطأ اثناء تحديث الكمية",
            });
          }
        },

        incrementQuantity: async (id) => {
          const item = get().items.find((item) => item.id === id);
          const previousQuantity = item?.quantity || 0;

          // Optimistic update
          set((state) => {
            const item = state.items.find((item) => item.id === id);
            if (item) {
              item.quantity += 1;
            }
          });

          try {
            await cartServices.updateItem(id, 1);
          } catch (error) {
            // Rollback on error
            set((state) => {
              const item = state.items.find((item) => item.id === id);
              if (item) {
                item.quantity = previousQuantity;
              }
              state.error =
                error instanceof Error
                  ? error.message
                  : "Failed to increment quantity";
            });

            toast({
              icon: "error",
              description: "حدث خطأ اثناء تحديث الكمية",
            });
          }
        },

        resetCartState: () =>
          set((state) => {
            state.items = [];
            state.cartId = null;
            state.isCartHydrated = false;
            state.isLoading = false;
            state.error = null;
          }),

        clearCart: async () => {
          const previousItems = [...get().items];

          // Optimistic update
          set((state) => {
            state.items = [];
          });

          try {
            await cartServices.clearAll();
          } catch (error) {
            // Rollback on error
            set((state) => {
              state.items = previousItems;
              state.error =
                error instanceof Error ? error.message : "Failed to clear cart";
            });

            toast({
              icon: "error",
              description: "حدث خطأ اثناء حذف السلة",
            });
          }
        },

        getTotalPrice: () =>
          get()?.items?.reduce(
            (total, item) => total + Number(item.price) * (item.quantity || 1),
            0,
          ) || 0,

        getTotalItems: () =>
          get()?.items?.reduce(
            (total, item) => total + (item.quantity || 1),
            0,
          ) || 0,

        checkIfItemExists: (id) => get().items.find((item) => item.id === id),

        getItemQuantity: (id) =>
          get()?.items.find((item) => item.id === id)?.quantity || 0,
      })),
      {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ items: state.items }),
      },
    ),
  );
};
