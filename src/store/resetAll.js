import { useCartStore } from '../store/cartStore';
// import { usePhoneEntryStore } from '../store/phoneEntryStore';
import { useBarrierFreeStore } from '../store/barrierFreeStore';

// 한 번에 초기화
export const resetKioskSession = () => {
  // 장바구니 비우기
  useCartStore.getState().clear();

  // 휴대폰 번호 입력 스토어 초기화
  usePhoneEntryStore.getState().reset();

  // 배리어프리 상태 초기화 (이어폰 연결 상태는 유지)
  const bfStore = useBarrierFreeStore.getState();
  bfStore.setFocusableItems([]);
  bfStore.setInitialGuideCompleted(false);

  // TODO: 결제 단계, 가이드 모달, 선택된 결제수단 등
  // 결제 관련 별도 zustand가 있다면 여기서 함께 초기화
};
