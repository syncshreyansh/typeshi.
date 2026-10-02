import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products } from '../data/products'

const productById = (productId) => products.find((product) => product.id === productId)

export const selectCartCount = (state) => state.items.reduce((total, item) => total + item.qty, 0)

export const selectCartSubtotal = (state) => state.items.reduce((total, item) => {
  const product = productById(item.productId)
  return total + (product ? product.price * item.qty : 0)
}, 0)

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      addItem: (item) => set((state) => {
        const existing = state.items.find((entry) => entry.productId === item.productId
          && entry.size === item.size && entry.colorName === item.colorName)
        if (existing) {
          return { items: state.items.map((entry) => entry === existing ? { ...entry, qty: entry.qty + item.qty } : entry) }
        }
        return { items: [...state.items, { ...item, qty: Math.max(1, item.qty || 1) }] }
      }),
      removeItem: (productId, size, colorName) => set((state) => ({
        items: state.items.filter((item) => !(item.productId === productId && item.size === size && item.colorName === colorName)),
      })),
      updateQty: (productId, size, colorName, qty) => set((state) => ({
        items: state.items.map((item) => item.productId === productId && item.size === size && item.colorName === colorName
          ? { ...item, qty: Math.max(1, qty) }
          : item),
      })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    { name: 'typeshi-cart', partialize: (state) => ({ items: state.items }) },
  ),
)

export { productById }
