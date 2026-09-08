import React, { useEffect } from 'react';
import clsx from 'clsx';
import LanguageBtn from '@/components/Main/LanguageBtn/LanguageBtn';
import styles from './LanguagePanel.module.css';

const LANGS = [
  { code: 'ko', label: '한국어', badge: 'ko' },
  { code: 'en', label: 'English', badge: 'en' },
  { code: 'zh', label: '中文', badge: 'zh' },
  { code: 'ja', label: '日本語', badge: 'ja' },
];

const LABEL_MAP = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
};

const LanguagePanel = ({
  open,
  current,
  onSelect,
  onClose,
  langs = ['ko', 'en', 'ja', 'zh'], // ['ko', 'en', 'ja', 'zh']
}) => {
  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      // 패널 바깥 (backdrop)만 닫기
      if (e.target.classList.contains(styles.backdrop)) onClose?.();
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open, onClose]);

  return (
    <div className={clsx(styles.backdrop, open && styles.open)} inert={!open}>
      <div className={clsx(styles.panel, open ? styles.show : styles.hide)}>
        {/* 25.11.10 이전: 고정 언어 목록 사용 */}
        {/* {LANGS.map((l) => (
          <LanguageBtn
            key={l.code}
            iconText={l.badge}
            lang={l.label}
            selected={current?.startsWith(l.code)}
            onClick={() => onSelect?.(l.code)}
          />
        ))} */}

        {/* 25.11.10 서버에서 주는 지원 언어 목록 사용 */}
        {langs.map((code) => (
          <LanguageBtn
            key={code}
            iconText={code}
            lang={LABEL_MAP[code] ?? code}
            selected={current?.startsWith(code)}
            onClick={() => onSelect?.(code)}
          />
        ))}
      </div>
    </div>
  );
};

export default LanguagePanel;
