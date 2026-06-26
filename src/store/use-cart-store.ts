import { create } from "zustand";

interface CartItem {
  id: number;
  name: string;
  price: number;
  img: string;
  qty: number;
}

interface CartStore {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  removeItem: (id: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  items: [],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  addItem: (newItem) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === newItem.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === newItem.id ? { ...i, qty: i.qty + 1 } : i,
          ),
          isOpen: true, // Auto-open cart when adding
        };
      }
      return { items: [...state.items, { ...newItem, qty: 1 }], isOpen: true };
    }),
  increaseQty: (id) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    })),
  decreaseQty: (id) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));
