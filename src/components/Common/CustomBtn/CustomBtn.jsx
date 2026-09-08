import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import styles from './CustomBtn.module.css';

const CustomBtn = ({
  text,
  onClick,
  disabled,
  height = '100%',
  fontSize = '50px',
  type = 'ok', // ok, cancel, error
  stopEventOnClick = false,
  useLineHeight = false,
  ...rest
}) => {
  const [clicked, setClicked] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    if (disabled) return;

    // 클릭-스루 방지를 위해 요청 시 합성/네이티브 이벤트 모두 차단
    if (stopEventOnClick) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent?.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }

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
        type === 'cancel' && styles.cancel,
        type === 'error' && styles.error,
        type === 'warning' && styles.warning
      )}
      onClick={handleClick}
      disabled={disabled}
      // disabled 상태일 때 효과
      style={{
        height,
        fontSize,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...rest}
    >
      <span
        className={clsx(
          styles.customBtnText,
          type === 'error' && styles.errorText,
          type === 'cancel' && styles.cancelText,
          type === 'ok' && styles.okText,
          type === 'warning' && styles.warningText
        )}
        style={{ lineHeight: useLineHeight ? '100%' : 'normal' }}
      >
        {text}
      </span>
    </button>
  );
};

export default CustomBtn;
