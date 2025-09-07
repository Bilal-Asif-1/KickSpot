import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
}

interface CartActions {
  addItem: (product: Product, quantity?: number, options?: { size?: string; color?: string; variant?: string }) => void;
  removeItem: (productId: number, options?: { size?: string; color?: string; variant?: string }) => void;
  updateQuantity: (productId: number, quantity: number, options?: { size?: string; color?: string; variant?: string }) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  calculateTotals: () => void;
}

type CartStore = CartState & CartActions;

// Helper function to create a unique key for cart items
const getItemKey = (productId: number, options?: { size?: string; color?: string; variant?: string }) => {
  const { size = '', color = '', variant = '' } = options || {};
  return `${productId}-${size}-${color}-${variant}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      // Actions
      addItem: (product: Product, quantity = 1, options = {}) => {
        const state = get();
        const itemKey = getItemKey(product.id, options);
        const existingItemIndex = state.items.findIndex(
          (item) => getItemKey(item.product.id, { size: item.size, color: item.color, variant: item.variant }) === itemKey
        );

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Update existing item
          newItems = state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            product,
            quantity,
            size: options.size,
            color: options.color,
            variant: options.variant,
          };
          newItems = [...state.items, newItem];
        }

        set({ items: newItems });
        get().calculateTotals();
      },

      removeItem: (productId: number, options = {}) => {
        const state = get();
        const itemKey = getItemKey(productId, options);
        const newItems = state.items.filter(
          (item) => getItemKey(item.product.id, { size: item.size, color: item.color, variant: item.variant }) !== itemKey
        );

        set({ items: newItems });
        get().calculateTotals();
      },

      updateQuantity: (productId: number, quantity: number, options = {}) => {
        if (quantity <= 0) {
          get().removeItem(productId, options);
          return;
        }

        const state = get();
        const itemKey = getItemKey(productId, options);
        const newItems = state.items.map((item) =>
          getItemKey(item.product.id, { size: item.size, color: item.color, variant: item.variant }) === itemKey
            ? { ...item, quantity }
            : item
        );

        set({ items: newItems });
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      calculateTotals: () => {
        const state = get();
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = state.items.reduce(
          (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
          0
        );

        set({
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
        });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
      onRehydrateStorage: () => (state) => {
        // Recalculate totals after hydration
        state?.calculateTotals();
      },
    }
  )
);

// Selectors
export const useCart = () => useCartStore((state) => ({
  items: state.items,
  isOpen: state.isOpen,
  totalItems: state.totalItems,
  totalPrice: state.totalPrice,
}));

export const useCartActions = () => useCartStore((state) => ({
  addItem: state.addItem,
  removeItem: state.removeItem,
  updateQuantity: state.updateQuantity,
  clearCart: state.clearCart,
  toggleCart: state.toggleCart,
  setCartOpen: state.setCartOpen,
}));
