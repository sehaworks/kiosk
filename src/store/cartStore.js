import { create } from 'zustand';

/**
 * 결제를 취소 / 결제 후 발권 완료하기 전까지
 * 장바구니는 라우트 전환에도 유지
 */
export const useCartStore = create((set, get) => ({
  cart: [],

  // 장바구니 합계 수량 (선택적으로 selector에서 써도 됨)
  totalQty: () => get().cart.reduce((s, l) => s + l.qty, 0),

  // 라인 찾기 유틸
  _findIndexByProductId: (id) =>
    get().cart.findIndex((l) => l.productId === id),

  // 장바구니 추가
  add: (line) =>
    set((state) => {
      const i = state.cart.findIndex((l) => l.productId === line.productId);
      if (i > -1) {
        const next = [...state.cart];
        next[i] = { ...next[i], qty: next[i].qty + (line.qty ?? 1) };
        return { cart: next };
      }
      return { cart: [...state.cart, { ...line, qty: line.qty ?? 1 }] };
    }),

  // 장바구니 수량 증가
  inc: (id) =>
    set((state) => {
      const next = state.cart.map((l) =>
        l.productId === id ? { ...l, qty: l.qty + 1 } : l
      );
      return { cart: next };
    }),

  // 장바구니 수량 감소
  dec: (id) =>
    set((state) => {
      const next = state.cart.map((l) =>
        l.productId === id ? { ...l, qty: Math.max(1, l.qty - 1) } : l
      );
      return { cart: next };
    }),

  // 장바구니 항목 삭제
  remove: (id) =>
    set((state) => ({ cart: state.cart.filter((l) => l.productId !== id) })),

  // 장바구니 비우기
  clear: () => set({ cart: [] }),

  // 필요 시 외부에서 통으로 갈아끼우고 싶을 때
  setCart: (next) => set({ cart: Array.isArray(next) ? next : [] }),
}));
