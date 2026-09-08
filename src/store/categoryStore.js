import { create } from 'zustand';

// 카테고리 목록 저장
export const useCategoryStore = create((set) => ({
  categories: [],
  catLoading: false,
  catError: null,

  setCategories: (list) => set({ categories: list }),
  setCatLoading: (v) => set({ catLoading: v }),
  setCatError: (msg) => set({ catError: msg }),
}));
