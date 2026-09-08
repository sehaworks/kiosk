import React from 'react';
import styles from './LanguageBtn.module.css';
import clsx from 'clsx';

import koIcon from '@/assets/imgs/icons/ko-lang.png';
import enIcon from '@/assets/imgs/icons/en-lang.png';
import zhIcon from '@/assets/imgs/icons/zh-lang.png';
import jaIcon from '@/assets/imgs/icons/ja-lang.png';
import checkIcon from '@/assets/imgs/icons/check-lang.png';

const ICON_MAP = {
  ko: koIcon,
  en: enIcon,
  zh: zhIcon,
  ja: jaIcon,
};

const LanguageBtn = ({ iconText, lang, selected, onClick }) => {
  return (
    <button
      type="button"
      className={clsx(styles.languageBtn, selected && styles.selected)}
      onClick={onClick}
    >
      <div className={styles.left}>
        <div className={styles.icon}>
          {selected ? (
            <img
              src={checkIcon}
              alt="check"
              style={{ width: '36px', height: '36px' }}
            />
          ) : (
            <img
              src={ICON_MAP[iconText]}
              alt="icon"
              style={{ width: '36px', height: '36px' }}
            />
          )}
        </div>
        <div className={styles.lang}>{lang}</div>
      </div>
    </button>
  );
};

export default LanguageBtn;
