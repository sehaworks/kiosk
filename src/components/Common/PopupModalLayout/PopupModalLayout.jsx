import React from 'react';
import ReactDOM from 'react-dom';
import styles from './PopupModalLayout.module.css';
import CustomBtn from '@/components/Common/CustomBtn/CustomBtn';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { useBarrierFreeStore } from '@/store/barrierFreeStore';

// 팝업 모달 레이아웃
const PopupModalLayout = ({
  open,
  title,
  msg1,
  msg2,
  msg3,
  buttonText,
  onClick,
  isDown = false, // ✅ 추가
}) => {
  // 낮은 화면
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${isLowScreenOn ? styles.down : ''}`}
      role="alertdialog"
      aria-live="assertive"
    >
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        {/* 아이콘 */}
        <div className={styles.icon}>
          <BsExclamationCircle className={styles.warningIcon} />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.msgContainer}>
          <p className={styles.msg}>{msg1}</p>
          {msg2 && <p className={styles.msg}>{msg2}</p>}
          {msg3 && <div className={styles.msg}>{msg3}</div>}
        </div>
        <div className={styles.btnContainer}>
          <CustomBtn
            onClick={onClick}
            text={buttonText}
            fontSize="36px"
            type="error"
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopupModalLayout;
