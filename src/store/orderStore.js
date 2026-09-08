import { create } from 'zustand';

/**
 * 결제 성공 후(=orderId 확정 후)부터
 * 발권 완료(지류/모바일) or 메인으로 복귀하기 전까지
 * 라우트 전환/모달 전환과 무관하게 주문정보를 유지하기 위한 전역 스토어
 *
 * 왜 필요한가?
 * - 현재 ProductListPage의 로컬 state에 두면
 *   '/phone-number-enter' 왕복 후 특정 케이스에서 state가 초기화되는 문제가 보고됨.
 * - store에 두면 라우터 이동과 무관하게 안전하게 보관 가능.
 */
export const useOrderStore = create((set, get) => ({
  currentOrder: null, // { orderId, finalAmount, items: [...] }

  setOrder: (order) => set({ currentOrder: order ?? null }),
  clearOrder: () => set({ currentOrder: null }),

  // 안전 가드: 반드시 orderId가 존재하는지 확인해서 반환
  requireOrder: () => {
    const o = get().currentOrder;
    if (!o?.orderId) return null;
    return o;
  },
}));
