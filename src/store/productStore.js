import { create } from 'zustand';

// 상품 목록 저장
export const useProductStore = create((set) => ({
  products: [],
  prodLoading: false,
  prodError: null,

  setProducts: (products) => set({ products }),
  setProdLoading: (prodLoading) => set({ prodLoading }),
  setProdError: (prodError) => set({ prodError }),
  clear: () => set({ products: [], prodLoading: false, prodError: null }),
}));
