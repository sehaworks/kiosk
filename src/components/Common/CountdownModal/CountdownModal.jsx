import React from 'react';
import ReactDOM from 'react-dom';
import PopupModalLayout from '@/components/Common/PopupModalLayout/PopupModalLayout';
import styles from './CountdownModal.module.css';
import CustomBtn from '../CustomBtn/CustomBtn';
import { useTranslation } from 'react-i18next';
import { BsExclamationCircle } from 'react-icons/bs';

/**
 * 카운트다운 모달 컴포넌트
 */
const CountdownModal = ({ isVisible, countdown, onCancel }) => {
  const { t } = useTranslation('common');

  // console.log('[CountdownModal] :', { isVisible, countdown });

  // 클릭 전용
  const eatClickOnly = (e) => {
    e.stopPropagation();
    const ne = e.nativeEvent;
    if (ne?.stopImmediatePropagation) ne.stopImmediatePropagation();
  };

  // 포인터/마우스 전용
  const eatPointerEvent = (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    const ne = e.nativeEvent;
    // 더블탭 방지
    try {
      if (ne?.cancelable) ne.preventDefault();
    } catch {
      // ignore
    }
    if (ne?.stopImmediatePropagation) ne.stopImmediatePropagation();
  };

  // 창 전체에서 다음 클릭을 캡처 단계에서 삼키는 세이프티넷
  const swallowNextClickGlobally = (ms = 220) => {
    const handler = (ev) => {
      ev.stopPropagation();
    };
    window.addEventListener('click', handler, { capture: true });
    setTimeout(
      () => window.removeEventListener('click', handler, { capture: true }),
      ms
    );
  };

  // 최상단 투명 실드 Pointer 이벤트 흡수
  const installClickShield = (ms = 200) => {
    const shield = document.createElement('div');
    Object.assign(shield.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '20000',
      pointerEvents: 'all',
      background: 'transparent',
    });
    document.body.appendChild(shield);
    setTimeout(() => {
      if (shield.isConnected) shield.remove();
    }, ms);
  };

  // 닫기 로직 (pointer/mouse에서 실행)
  const handleCloseOnPointerDown = (e) => {
    eatPointerEvent(e); // 현재 입력 완전히 차단
    swallowNextClickGlobally(); // 혹시 남을 click 전역 차단
    installClickShield(); // pointerup이 아래로 새는 것을 차단
    requestAnimationFrame(() => setTimeout(() => onCancel?.(), 0));
  };

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} role="alertdialog" aria-live="assertive">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {/* 아이콘 */}
          <div className={styles.icon}>
            <BsExclamationCircle className={styles.warningIcon} />
          </div>
          <div className={styles.title}>{t('inactivity_countdown.title')}</div>
          <div className={styles.msgContainer}>
            <p className={styles.msg}>{t('inactivity_countdown.message')}</p>
            <div className={styles.countdownContainer}>
              <span className={styles.msg}>
                <span className={styles.countdownNumber}>{countdown}</span>
                {t('inactivity_countdown.countdown_text')}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.btnContainer}>
          <CustomBtn
            text={t('close')}
            stopEventOnClick
            onPointerDown={handleCloseOnPointerDown}
            onMouseDown={handleCloseOnPointerDown}
            onClick={eatClickOnly}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CountdownModal;
