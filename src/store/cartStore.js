import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      cart: null,
      setCart: (data) => {
        set((state) => ({
          cart: data,
        }));
      },
      clearStore: () => {
        set(() => ({
          cart,
        }));
      },
    }),
    {
      name: "cartStore",
      getStorage: () => localStorage, // specify localStorage as the storage backend
    }
  )
);
