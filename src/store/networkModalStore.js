import { create } from 'zustand';

const DEFAULTS = {
  type: 'warning',
  title: '네트워크 연결 끊김',
  subtitle: '인터넷 연결 상태를 확인해주세요.',
  buttonText: '닫기',
};

// 메인 페이지 여부
const isOnMain = () => {
  const p = window.location?.pathname || '/';
  return p === '/' || p === '';
};

// 전역 네트워크 모달 스토어
export const useNetworkModalStore = create((set, get) => ({
  open: false,
  // 표시 텍스트
  type: DEFAULTS.type,
  title: DEFAULTS.title,
  subtitle: DEFAULTS.subtitle,
  buttonText: DEFAULTS.buttonText,
  // 중복 오픈 방지 플래그 (짧은 시간 여러 API 에러가 한꺼번에 터지는 경우 방지)
  _lock: false,

  openModal: (payload = {}) => {
    // 메인에서는 열지 않음
    if (isOnMain()) return;

    if (get()._lock) return;
    set({ ...DEFAULTS, ...payload, open: true, _lock: true });
    // 1.5초 후 다시 열 수 있게 잠금 해제
    setTimeout(() => set({ _lock: false }), 1500);
  },

  closeModal: () => set({ open: false }),
}));
