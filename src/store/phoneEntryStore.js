import { create } from 'zustand';
import { digitsOnly } from '@/utils/phone';

// 숫자패드로 번호 입력 처리하는 스토어

// 휴대폰 번호 유효성
// 11자리 숫자, 01으로 시작
const is11Mobile = (d) => /^01\d{9}$/.test(d);

export const usePhoneEntryStore = create((set, get) => ({
  recipients: [], // [{ id, label, value }]
  focusedIndex: 0, // 현재 포커스된 행
  errors: [], // [{ duplicate?: true, invalid?: true } | null] (검증 후 채움)

  reset: () => set({ recipients: [], focusedIndex: 0, errors: [] }),

  // 페이지 진입 시 라벨로 초기화
  init: (labels = []) =>
    set({
      recipients: labels.map((label, i) => ({ id: i, label, value: '' })),
      focusedIndex: 0,
      errors: labels.map(() => null), // 에러 초기화
    }),

  focus: (idx) => set({ focusedIndex: idx }), // 포커스
  blur: () => set({ focusedIndex: null }), // 포커스 해제(바깥 클릭 시)

  /** 내부: 특정 인덱스 에러 제거 */
  _clearErrorAt: (idx) =>
    set((s) => {
      if (!s.errors?.length) return {};
      const next = s.errors.slice();
      next[idx] = null;
      return { errors: next };
    }),

  // 숫자 추가(최대 11자리)
  appendDigit: (d) => {
    const { recipients, focusedIndex } = get();
    if (focusedIndex == null) return;
    const next = recipients.map((r, i) => {
      if (i !== focusedIndex) return r;
      const raw = (r.value || '') + String(d).replace(/\D/g, '');
      return { ...r, value: raw.slice(0, 11) };
    });
    set({ recipients: next });
    get()._clearErrorAt(focusedIndex); // 입력 시 해당 행 에러 해제
  },

  // 010 입력
  insert010: () => {
    const { recipients, focusedIndex } = get();
    if (focusedIndex == null) return;
    const next = recipients.map((r, i) => {
      if (i !== focusedIndex) return r;
      const raw = digitsOnly((r.value || '') + '010').slice(0, 11);
      return { ...r, value: raw };
    });
    set({ recipients: next });
    get()._clearErrorAt(focusedIndex); // 입력 시 해당 행 에러 해제
  },

  // 한 글자 삭제
  backspace: () => {
    const { recipients, focusedIndex } = get();
    if (focusedIndex == null) return;
    const next = recipients.map((r, i) => {
      if (i !== focusedIndex) return r;
      return { ...r, value: (r.value || '').slice(0, -1) };
    });
    set({ recipients: next });
    get()._clearErrorAt(focusedIndex); // 입력 시 해당 행 에러 해제
  },

  clear: (idx) => {
    set((s) => {
      const next = s.recipients.map((r, i) =>
        i === idx ? { ...r, value: '' } : r
      );
      const errs = s.errors.slice();
      errs[idx] = null;
      return { recipients: next, errors: errs };
    });
  },

  // 입력 완료 클릭 시 전체 검증 수행 & 에러 저장
  //  에러 있으면 true 반환
  validateAll: () => {
    const { recipients } = get();
    const errors = recipients.map(() => null);

    // 1. 11자리 01로 시작이 아니면 invalid
    recipients.forEach((r, i) => {
      const d = digitsOnly(r.value);
      if (d.length > 0 && !is11Mobile(d)) {
        errors[i] = { ...(errors[i] || {}), invalid: true };
      }
    });

    // 2. 유효한 번호끼리만 중복 체크
    const map = new Map(); // num -> [indexes]
    recipients.forEach((r, i) => {
      const d = digitsOnly(r.value);
      if (is11Mobile(d)) {
        if (!map.has(d)) map.set(d, []);
        map.get(d).push(i);
      }
    });
    map.forEach((idxs) => {
      if (idxs.length > 1)
        idxs.forEach(
          (i) => (errors[i] = { ...(errors[i] || {}), duplicate: true })
        );
    });

    set({ errors });
    const hasError = errors.some((e) => e && (e.invalid || e.duplicate));
    return hasError;
  },
}));
