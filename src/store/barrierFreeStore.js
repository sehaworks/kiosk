import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 배리어프리 모드 타입
export const BARRIER_FREE_MODE = {
  NORMAL: "normal", // 일반 모드 (이어폰 미연결)
  VISUALLY_IMPAIRED: "visually_impaired", // 시각장애인 모드 (이어폰 연결)
  LOW_VISION: "low_vision", // 저시력 모드
  LOW_POSTURE: "low_posture", // 저자세 모드 (휠체어)
};

// 음성 속도 단계 (숫자가 낮을수록 빠름)
export const SPEECH_RATE_LEVELS = [
  { label: "매우 빠름", value: 1.5, wpm: 120 },
  { label: "빠름", value: 1.2, wpm: 100 },
  { label: "보통", value: 1.0, wpm: 80 },
  { label: "느림", value: 0.8, wpm: 60 },
  { label: "매우 느림", value: 0.6, wpm: 40 },
];

// 음량 단계 (1~4)
export const VOLUME_LEVELS = [
  { label: "1단계", value: 0.25 },
  { label: "2단계", value: 0.5 },
  { label: "3단계", value: 0.75 },
  { label: "4단계", value: 1.0 },
];

export const useBarrierFreeStore = create(
  persist(
    (set, get) => ({
      // ─────────────────────────────────────
      // 현재 활성화된 모드
      // ─────────────────────────────────────
      currentMode: BARRIER_FREE_MODE.NORMAL,
      setCurrentMode: (mode) => set({ currentMode: mode }),

      // ─────────────────────────────────────
      // 저자세 모드 (낮은 화면)
      // ─────────────────────────────────────
      isLowScreenOn: false,
      setLowScreenOn: (v) => set({ isLowScreenOn: v }),
      toggleLowScreen: () => set((s) => ({ isLowScreenOn: !s.isLowScreenOn })),

      // ─────────────────────────────────────
      // 음성 안내 (시각장애인 모드 - 이어폰 연결 시 활성화)
      // ─────────────────────────────────────
      isVoiceGuideOn: false,
      setVoiceGuideOn: (v) => set({ isVoiceGuideOn: v }),
      toggleVoiceGuide: () => set((s) => ({ isVoiceGuideOn: !s.isVoiceGuideOn })),

      // 일반 모드 음성 안내 (이어폰 미연결 상태에서의 스피커 출력)
      isNormalVoiceOn: true,
      setNormalVoiceOn: (v) => set({ isNormalVoiceOn: v }),
      toggleNormalVoice: () => set((s) => ({ isNormalVoiceOn: !s.isNormalVoiceOn })),

      // ─────────────────────────────────────
      // 이어폰 연결 상태
      // ─────────────────────────────────────
      isEarphoneConnected: false,
      setEarphoneConnected: (v) =>
        set({
          isEarphoneConnected: v,
          // 이어폰 연결 시 자동으로 시각장애인 모드 전환
          currentMode: v
            ? BARRIER_FREE_MODE.VISUALLY_IMPAIRED
            : BARRIER_FREE_MODE.NORMAL,
          isVoiceGuideOn: v,
        }),

      // ─────────────────────────────────────
      // 음성 속도 (시각장애인 모드용)
      // ─────────────────────────────────────
      speechRateIndex: 2, // 기본: 보통 (index 2)
      setSpeechRateIndex: (index) =>
        set({
          speechRateIndex: Math.max(0, Math.min(index, SPEECH_RATE_LEVELS.length - 1)),
        }),
      getSpeechRate: () => SPEECH_RATE_LEVELS[get().speechRateIndex].value,
      getSpeechRateLabel: () => SPEECH_RATE_LEVELS[get().speechRateIndex].label,
      // 음성 속도 증가 (빠르게)
      increaseSpeechRate: () =>
        set((s) => ({
          speechRateIndex: Math.max(0, s.speechRateIndex - 1),
        })),
      // 음성 속도 감소 (느리게)
      decreaseSpeechRate: () =>
        set((s) => ({
          speechRateIndex: Math.min(SPEECH_RATE_LEVELS.length - 1, s.speechRateIndex + 1),
        })),

      // ─────────────────────────────────────
      // 음량 (일반 모드용)
      // ─────────────────────────────────────
      volumeIndex: 3, // 기본: 4단계 (index 3)
      setVolumeIndex: (index) =>
        set({
          volumeIndex: Math.max(0, Math.min(index, VOLUME_LEVELS.length - 1)),
        }),
      getVolume: () => VOLUME_LEVELS[get().volumeIndex].value,
      getVolumeLabel: () => VOLUME_LEVELS[get().volumeIndex].label,
      increaseVolume: () =>
        set((s) => ({
          volumeIndex: Math.min(VOLUME_LEVELS.length - 1, s.volumeIndex + 1),
        })),
      decreaseVolume: () =>
        set((s) => ({
          volumeIndex: Math.max(0, s.volumeIndex - 1),
        })),

      // ─────────────────────────────────────
      // 저시력 모드 (고대비, 확대)
      // ─────────────────────────────────────
      isHighContrastOn: false,
      setHighContrastOn: (v) => set({ isHighContrastOn: v }),
      toggleHighContrast: () => set((s) => ({ isHighContrastOn: !s.isHighContrastOn })),

      isMagnifyOn: false,
      setMagnifyOn: (v) => set({ isMagnifyOn: v }),
      toggleMagnify: () => set((s) => ({ isMagnifyOn: !s.isMagnifyOn })),

      magnifyLevel: 1.0, // 1.0 = 100%, 1.5 = 150%, 2.0 = 200%
      setMagnifyLevel: (level) =>
        set({ magnifyLevel: Math.max(1.0, Math.min(level, 2.0)) }),

      // ─────────────────────────────────────
      // 시각장애인 모드 - 화면 터치 차단
      // ─────────────────────────────────────
      isTouchBlocked: false,
      setTouchBlocked: (v) => set({ isTouchBlocked: v }),

      // ─────────────────────────────────────
      // 시각장애인 모드 - 현재 포커스 인덱스
      // ─────────────────────────────────────
      focusIndex: 0,
      setFocusIndex: (index) => set({ focusIndex: index }),
      focusableItems: [], // 현재 화면의 포커스 가능한 항목들
      setFocusableItems: (items) => set({ focusableItems: items, focusIndex: 0 }),

      // 포커스 이동
      moveFocusNext: () =>
        set((s) => ({
          focusIndex:
            s.focusableItems.length > 0
              ? (s.focusIndex + 1) % s.focusableItems.length
              : 0,
        })),
      moveFocusPrev: () =>
        set((s) => ({
          focusIndex:
            s.focusableItems.length > 0
              ? (s.focusIndex - 1 + s.focusableItems.length) % s.focusableItems.length
              : 0,
        })),

      // ─────────────────────────────────────
      // 시각장애인 모드 - 초기 안내 완료 여부
      // ─────────────────────────────────────
      isInitialGuideCompleted: false,
      setInitialGuideCompleted: (v) => set({ isInitialGuideCompleted: v }),

      // ─────────────────────────────────────
      // 오디오 언락 (브라우저 autoplay 정책 우회)
      // ─────────────────────────────────────
      isAudioUnlocked: false,
      setAudioUnlocked: (v) => set({ isAudioUnlocked: v }),

      // ─────────────────────────────────────
      // 전체 리셋
      // ─────────────────────────────────────
      resetBarrierFree: () =>
        set({
          currentMode: BARRIER_FREE_MODE.NORMAL,
          isLowScreenOn: false,
          isVoiceGuideOn: false,
          isNormalVoiceOn: true,
          isEarphoneConnected: false,
          speechRateIndex: 2,
          volumeIndex: 3,
          isHighContrastOn: false,
          isMagnifyOn: false,
          magnifyLevel: 1.0,
          isTouchBlocked: false,
          focusIndex: 0,
          focusableItems: [],
          isInitialGuideCompleted: false,
          isAudioUnlocked: false,
        }),
    }),
    {
      name: "barrier-free-storage", // localStorage 저장 영역 이름
      storage: createJSONStorage(() => localStorage),
      // 일시적인 상태(포커스, 돔 요소 등) 제외하고 영구 유지할 항목 선택
      partialize: (state) => ({
        currentMode: state.currentMode,
        isLowScreenOn: state.isLowScreenOn,
        isHighContrastOn: state.isHighContrastOn,
        isMagnifyOn: state.isMagnifyOn,
        magnifyLevel: state.magnifyLevel,
        speechRateIndex: state.speechRateIndex,
        volumeIndex: state.volumeIndex,
        isVoiceGuideOn: state.isVoiceGuideOn,
        isNormalVoiceOn: state.isNormalVoiceOn,
      }),
    }
  )
);