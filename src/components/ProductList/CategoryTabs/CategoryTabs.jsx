import React, { useEffect, useMemo, useRef } from 'react';

import styles from './CategoryTabs.module.css';

/**
 * CategoryTabs
 * props
 * - items: Array<string | { key: string; label: string }>
 * - value: string (선택된 key/label)
 * - onChange: (key: string) => void
 * - className?: string
 * - scrollToActive?: boolean (기본 true)
 */
const CategoryTabs = ({
  items,
  value,
  onChange,
  className = '',
  scrollToActive = true,
  isDown = false, // ✅ 추가
}) => {
  // console.log('items', items);

  const trackRef = useRef(null);

  const normalized = useMemo(
    () =>
      items.map((it) => (typeof it === 'string' ? { key: it, label: it } : it)),
    [items]
  );

  useEffect(() => {
    if (!scrollToActive || !trackRef.current) return;
    const el = trackRef.current.querySelector(
      `[data-key="${CSS.escape(value)}"]`
    );
    if (el) {
      // 가로 스크롤 영역에서 선택 항목을 중앙으로
      el.scrollIntoView({ inline: 'center', block: 'nearest' });
    }
  }, [value, scrollToActive]);

  return (
    <div
      className={`${styles.wrapper} ${className} ${isDown ? styles.down : ''}`}
    >
      <div className={styles.track} ref={trackRef}>
        {normalized.map((it) => {
          const active = it.key === value;
          return (
            <button
              key={it.key}
              data-key={it.key}
              type="button"
              className={`${styles.tab} ${active ? styles.active : ''}`}
              aria-selected={active}
              onClick={() => onChange?.(it.key)}
            >
              <span className={styles.label}>{it.label}</span>
              <span className={styles.underline} aria-hidden />
            </button>
          );
        })}
      </div>
      {/* 좌/우 페이드 마스크 (오버플로우 시 끝단 처리) */}
      <span className={`${styles.fade} ${styles.leftFade}`} aria-hidden />
      <span className={`${styles.fade} ${styles.rightFade}`} aria-hidden />
    </div>
  );
};

export default CategoryTabs;
