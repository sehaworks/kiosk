import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './OverError.module.css';
import { useTranslation } from 'react-i18next';
import CustomBtn from '@/components/Common/CustomBtn/CustomBtn';
import { BsExclamationCircle } from 'react-icons/bs';

/**
 * 구매 수량 한도 초과 경고 모달
 * - open: 표시 여부
 * - limit: 한도 수량
 * - onClose: 닫기 콜백
 * - autoCloseMs: 자동 닫힘(ms) — 키오스크라서 실수 방지용으로 0 이면 자동닫힘 없음
 */
const OverError = ({
  open,
  limit,
  onClose,
  autoCloseMs = 0,
  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('common');

  // 클릭 전용
  const eatEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent?.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  const handleSafeClose = (e) => {
    eatEvent(e);
    requestAnimationFrame(() => setTimeout(() => onClose?.(), 0));
  };

  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const id = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(id);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${isDown ? styles.down : ''}`}
      role="alertdialog"
      aria-live="assertive"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={styles.header}>
          {/* 아이콘 */}
          <div className={styles.icon}>
            <BsExclamationCircle className={styles.warningIcon} />
          </div>

          <div className={styles.title}>{t('exceed_limit.title')}</div>
          <div className={styles.msgContainer}>
            <p className={styles.msg}>
              {t('exceed_limit.content1', { limit })}
            </p>
            <p className={styles.msg}>
              {t('exceed_limit.content2', `유인매표소에서 진행해주세요.`)}
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles.footer}>
          <CustomBtn text={t('close')} onClick={onClose} stopEventOnClick />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OverError;
