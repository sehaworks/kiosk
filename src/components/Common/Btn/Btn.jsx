import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import styles from './Btn.module.css';

// 모달에 들어가는 버튼
const Btn = ({
  text,
  onClick,
  disabled,
  type = 'cancel', // ok, cancel
}) => {
  const [clicked, setClicked] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    if (disabled) return;

    // 실제 onClick 실행
    onClick?.(e);

    // 클릭 효과 클래스 추가
    setClicked(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    // 150ms 후에 다시 제거
    timerRef.current = setTimeout(() => {
      setClicked(false);
      timerRef.current = null;
    }, 150);
  };

  return (
    <button
      type="button"
      className={clsx(
        styles.customBtn,
        disabled && styles.disabled,
        clicked && styles.clicked,
        type === 'ok' && styles.ok,
        type === 'cancel' && styles.cancel
      )}
      onClick={handleClick}
      disabled={disabled}
      // disabled 상태일 때 효과
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        className={clsx(
          styles.customBtnText,
          type === 'cancel' && styles.cancelText,
          type === 'ok' && styles.okText
        )}
      >
        {text}
      </span>
    </button>
  );
};

export default Btn;
