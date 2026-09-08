import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './InfoModal.module.css';
import CustomBtn from '@/components/Common/CustomBtn/CustomBtn';
import { useBarrierFreeStore } from '@/store/barrierFreeStore';
import { useTranslation } from 'react-i18next';

import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

// 경고, 확인 모달 컴포넌트
const InfoModal = ({
  open,
  onClose,
  type = 'warning', // warning, success
  title,
  subtitle,
  buttonText = '닫기',
  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('infoModal');

  // 낮은 화면
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${isDown ? styles.down : ''}`}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        {/* 헤더 */}
        <div className={styles.header}>
          {/* 아이콘 */}
          <div className={styles.icon}>
            {type === 'warning' ? (
              <BsExclamationCircle className={styles.warningIcon} />
            ) : (
              <BsCheckCircle className={styles.successIcon} />
            )}
          </div>

          {title && <p className={styles.title}>{title}</p>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* 버튼 */}
        <div className={styles.footer}>
          <CustomBtn text={buttonText} onClick={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InfoModal;
