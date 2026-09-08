import { create } from 'zustand';

// 각 키오스크 단말 식별값(deviceId)을 보관하는 전역 스토어
// URL ?deviceId=... 로 들어오면 그 값을 저장하고 localStorage에도 캐시
// 새로고침/재접속 시 URL에 없으면 localStorage 값으로 복원
const STORAGE_KEY = 'kiosk.deviceId';

export const useKioskStore = create((set, get) => ({
  deviceId: null,
  hydrated: false, // 초기화 완료 여부

  // deviceId를 설정하면서 로컬에도 캐시
  setDeviceId: (id) => {
    set({ deviceId: id ?? null });
    try {
      if (id == null || id === '') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, String(id));
    } catch (_) {
      // 에러 대비
    }
  },

  // URL → localStorage 순서로 초기화
  initFromLocation: () => {
    let id = null;
    try {
      const sp = new URLSearchParams(window.location.search);
      // deviceId, kioskId 둘 다 지원(운영 중 파라미터 명 변경 여지를 고려)
      id = sp.get('deviceId') || sp.get('kioskId');
    } catch (_) {
      // 에러 대비
    }

    if (id && id.trim() !== '') {
      get().setDeviceId(id.trim());
      set({ hydrated: true });
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim() !== '') {
        set({ deviceId: saved.trim() });
      }
    } catch (_) {
      // 에러 대비
    }
    set({ hydrated: true });
  },

  // 호출 시점에 가장 안전하게 얻는 보조 함수
  getEffectiveDeviceId: () => {
    const s = get().deviceId;
    if (s) return s;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim() !== '') return saved.trim();

      const sp = new URLSearchParams(window.location.search);
      const fromUrl = (sp.get('deviceId') || sp.get('kioskId'))?.trim();
      if (fromUrl) return fromUrl;
    } catch (e) {
      console.error('getEffectiveDeviceId error', e);
    }

    return null;
  },
}));
