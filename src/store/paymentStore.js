import { create } from 'zustand';

// 결제 결과 저장
export const usePaymentStore = create((set) => ({
  paymentResult: null, // { cashId, cardId, orderId, ... }

  setPaymentResult: (result) => set({ paymentResult: result }),
  clearPaymentResult: () => set({ paymentResult: null }),
}));
