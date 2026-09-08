import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalLayout.module.css';
import clsx from 'clsx';
import Btn from '@/components/Common/Btn/Btn';
import { useTranslation } from 'react-i18next';
import { useBarrierFreeStore } from '@/store/barrierFreeStore';

// 결제 관련 모달 레이아웃

/**
 * 버튼 배열 형식
 *    buttons={[
    { text: '닫기', type: 'cancel', onClick: handleClose },
    { text: '영수증 출력', type: 'ok', onClick: handlePrint }
  ]}
 */

const ModalLayout = ({
  open,
  onClose,
  title,
  isTitleLarge = false, // title 2줄인 경우, header 높이 조정
  subtitle,
  contentImg,
  contentVideo,
  buttons = [],

  content = null, // img 대신 커스텀 content
  contentAlign = 'center',

  isTicketMethodModal = false,

  // 자동닫힘 제어용
  isAutoClose = false, // 자동닫힘 버전
  autoCloseSec = 0, // n초 후 자동닫힘
  onAutoClose, // 0초 도달 시 호출

  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('product');

  // 낮은 화면
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);

  // 콜백을 ref에 고정
  // 부모가 매 렌더 함수 새로 만들어도 effect 재시작 X => 모달이 닫히면 카운트다운 중단
  const autoCloseRef = useRef(onAutoClose);
  useEffect(() => {
    autoCloseRef.current = onAutoClose;
  }, [onAutoClose]);

  // 카운트다운 state
  const [secLeft, setSecLeft] = useState(autoCloseSec);
  const timerRef = useRef(null);

  // 타이머 설정/리셋
  useEffect(() => {
    // 모달이 닫히거나 자동닫힘 미사용이면 타이머 정리
    if (!open || !isAutoClose || autoCloseSec <= 0) {
      setSecLeft(autoCloseSec);
      clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    // 열릴 때마다 카운트다운 재시작
    setSecLeft(autoCloseSec);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          // 렌더 중 setState 경고 방지 -> 다음 틱으로 미룸
          setTimeout(() => {
            autoCloseRef.current?.(); // 부모 setState 안전 호출
          }, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    // 언마운트/prop 변경 시 정리
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [open, isAutoClose, autoCloseSec]);

  if (!open) return null;

  const btns = buttons.length ? buttons : [];
  const btnCount = btns.length;

  // 버튼 렌더러
  const renderButton = (btn, idx) => {
    // 사용자가 노드를 직접 준 경우 그대로 렌더
    if (React.isValidElement(btn)) {
      return btn;
    }

    // 객체 구성일 경우 공통 버튼으로 통일
    const {
      text,
      onClick,
      disabled = false,
      fontSize = '50px',
      height = '130px',
      type = 'cancel',
    } = btn || {};

    return (
      <Btn
        key={idx}
        text={text}
        onClick={onClick}
        type={type}
        disabled={disabled}
        fontSize={fontSize}
        height={height}
      />
    );
  };

  return ReactDOM.createPortal(
    <div className={`${styles.overlay} ${isLowScreenOn ? styles.down : ''}`}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <header
          className={clsx(
            styles.header,
            isTitleLarge ? styles.large : styles.small
          )}
        >
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && (
            <div
              className={clsx(
                styles.subtitle,
                !subtitle && styles.subtitleHidden
              )}
            >
              {subtitle || 'no subtitle'}
            </div>
          )}
        </header>

        {/* 본문 */}
        <section
          className={clsx(
            styles.content,
            contentAlign === 'start' && styles.contentStart
          )}
        >
          {/* {content
            ? content
            : contentImg && (
                <img
                  className={styles.contentImg}
                  src={contentImg}
                  alt="content"
                />
              )} */}
          {content ? (
            content
          ) : contentVideo ? ( // 영상 우선
            <video
              className={styles.contentVideo}
              src={contentVideo}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : contentImg ? (
            <img className={styles.contentImg} src={contentImg} alt="content" />
          ) : null}

          {/* 자동닫힘 안내 */}
          {isAutoClose && autoCloseSec > 0 && (
            <div className={styles.autoNote}>
              <b className={styles.autoNoteStrong}>{secLeft}</b>{' '}
              {t(
                'paper_ticket.done.subtitle.suffix',
                '초 후에 자동으로 닫힙니다'
              )}
            </div>
          )}
        </section>

        {/* 하단 버튼 - 버튼 개수에 따라 조정 */}
        <div
          className={clsx(
            styles.btns,
            btnCount === 0 && styles.noBtns,
            btnCount === 1 && styles.one,
            btnCount === 2 && styles.two,
            isTicketMethodModal && styles.ticketMethodModalBtns
          )}
        >
          {btns.map((btn, i) => (
            <div className={styles.btnItem} key={i}>
              {renderButton(btn, i)}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalLayout;
