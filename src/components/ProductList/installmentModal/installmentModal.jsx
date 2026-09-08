import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './installmentModal.module.css';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { IoRefresh } from 'react-icons/io5';
import backCancel from '@/assets/imgs/icons/back-cancel.png';

const digitsOnly = (s = '') => String(s).replace(/\D/g, '');

const to2 = (s) => {
  // API 규격: 2자리 문자열
  const d = digitsOnly(s);
  if (!d) return '';
  // '0','3','12' → '00','03','12'
  return d.padStart(2, '0').slice(0, 2);
};

const MAX_INSTALLMENT = 24; // 최대 24개월

// 할부 개월 수 선택 모달
const InstallmentModal = ({
  open,
  totalAmount,
  onBack,
  onPay,
  resetTrigger,
  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('product');

  const PRESETS = [
    { label: t('installment_modal.none'), value: '0' }, // 잠금 + '0'
    { label: t('installment_modal.3'), value: '3' },
    { label: t('installment_modal.6'), value: '6' },
    { label: t('installment_modal.12'), value: '12' },
  ];

  // 내부 상태: 입력 값과 '프리셋 잠금' 여부
  const [value, setValue] = useState('');
  const [locked, setLocked] = useState(false); // 일시불/3/6/12 클릭 시 true

  // resetTrigger 값이 변경될 때마다 내부 상태 초기화
  useEffect(() => {
    setValue('');
    setLocked(false);
  }, [resetTrigger]);

  const localeMoney = useMemo(
    () => Number(totalAmount || 0).toLocaleString(),
    [totalAmount]
  );

  const selectedPreset = useMemo(() => {
    // 버튼 파란색 표시(요구 3): 현재 값과 일치하면 선택 처리
    const d = digitsOnly(value);
    const found = PRESETS.find((p) => digitsOnly(p.value) === d);
    return found?.value;
  }, [value]);

  // 현재 입력값 숫자/제한 초과 여부
  const n = Number(digitsOnly(value) || '0');
  const exceed = n > MAX_INSTALLMENT;

  if (!open) return null;

  // 프리셋 클릭
  const handlePreset = (presetVal) => {
    setValue(presetVal);
    setLocked(true); // 프리셋 선택 시 추가 입력 불가
  };

  // 숫자 키패드 입력 (최대 2자리)
  const pressDigit = (d) => {
    if (locked) return; // 프리셋 잠금 중엔 입력 불가
    setValue((prev) => {
      const next = digitsOnly(prev) + String(d);
      // 최대 2자리
      return next.slice(0, 2);
    });
  };

  // 백스페이스(한 글자 삭제)
  const backspace = () => {
    if (locked) return;
    setValue((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
  };

  // 초기화
  const reset = () => {
    setValue('');
    setLocked(false);
  };

  // 결제 버튼 활성 조건: 값이 하나라도 들어가 있어야 함
  const canPay = digitsOnly(value).length > 0 && !exceed;

  // 이전 클릭 시 선택 초기화
  const handleBack = () => {
    reset();
    onBack?.();
  };

  const handlePay = () => {
    if (!canPay) return;
    // API 규격에 맞춰 2자리 문자열로 normalize
    const inst = to2(value);
    onPay?.(inst);
  };

  // 키패드 데이터(요구 6: '010' 제거, 대신 초기화 버튼 배치)
  const keypad = [
    { k: '1' },
    { k: '2' },
    { k: '3' },
    { k: '4' },
    { k: '5' },
    { k: '6' },
    { k: '7' },
    { k: '8' },
    { k: '9' },
    // 하단 왼쪽: 초기화, 가운데: 0, 오른쪽: backspace
    { k: 'reset' },
    { k: '0' },
    { k: 'back' },
  ];

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${isDown ? styles.down : ''}`}
      aria-modal="true"
      role="dialog"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <header className={styles.header}>
          <div className={styles.title}>
            {t('installment_modal.title', '할부개월수를 선택해주세요')}
          </div>
        </header>

        {/* 본문 */}
        <section className={styles.content}>
          {/* 결제 금액 요약 */}
          <div className={styles.totalBox}>
            <div className={styles.totalLabel}>
              {t('installment_modal.subtitle', '결제금액')}
            </div>
            <div className={styles.totalValueRow}>
              <span className={styles.totalValue}>{localeMoney}</span>
              <span className={styles.totalLabel}>
                <span className={styles.unit}>{t('price_unit', '원')}</span>
              </span>
            </div>
          </div>

          <div className={styles.selectSection}>
            {/* 프리셋 버튼 */}
            <div className={styles.presetRow}>
              {/* 개월 수 입력 표시줄 */}
              <div className={styles.inputRow}>
                <div className={styles.inputBox}>
                  {/* 실제 입력은 키패드로만  */}
                  <input
                    className={styles.input}
                    value={digitsOnly(value)}
                    placeholder={t(
                      'installment_modal.placeholder',
                      '개월수 입력'
                    )}
                    readOnly
                    inputMode="none"
                  />
                  <span className={styles.monthBadge}>
                    {t('installment_modal.month', '개월')}
                  </span>
                </div>

                {/* 제한 초과 경고 */}
                <div className={clsx(styles.warnMsg, exceed && styles.visible)}>
                  {
                    exceed
                      ? t(
                          'installment_modal.limit_msg',
                          '최대 할부개월수는 24개월입니다'
                        )
                      : '\u00A0' /* 빈 칸으로 자리 유지 */
                  }
                </div>
              </div>
              <div className={styles.presetbtnBox}>
                {PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    className={clsx(
                      styles.presetBtn,
                      selectedPreset === p.value && styles.selected
                    )}
                    onClick={() => handlePreset(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.keypadBox}>
              {/* 개월 수 입력 표시줄 */}
              <div className={styles.inputRow}>
                <div className={styles.inputBox}>
                  {/* 실제 입력은 키패드로만  */}
                  <input
                    className={styles.input}
                    value={digitsOnly(value)}
                    placeholder={t(
                      'installment_modal.placeholder',
                      '개월수 입력'
                    )}
                    readOnly
                    inputMode="none"
                  />
                  <span className={styles.monthBadge}>
                    {t('installment_modal.month', '개월')}
                  </span>
                </div>

                {/* 제한 초과 경고 */}
                <div className={clsx(styles.warnMsg, exceed && styles.visible)}>
                  {
                    exceed
                      ? t(
                          'installment_modal.limit_msg',
                          '최대 할부개월수는 24개월입니다'
                        )
                      : '\u00A0' /* 빈 칸으로 자리 유지 */
                  }
                </div>
              </div>
              {/* 번호 키패드 (3 x 4) */}
              <div className={styles.keypad}>
                {keypad.map((item, idx) => {
                  if (item.k === 'reset') {
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={clsx(styles.key, styles.keyReset)}
                        onClick={reset}
                        aria-label={t('installment_modal.reset', '초기화')}
                        disabled={locked && !digitsOnly(value).length}
                        // 잠금이어도 초기화는 허용. 단, 이미 비었으면 disable
                      >
                        <IoRefresh className={styles.resetIcon} />
                      </button>
                    );
                  }
                  if (item.k === 'back') {
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={clsx(styles.key, styles.keyBack)}
                        onClick={backspace}
                        aria-label={t('installment_modal.backspace', '삭제')}
                        disabled={locked}
                      >
                        <img
                          src={backCancel}
                          alt="backspace"
                          className={styles.backCancel}
                          width={50}
                          height={50}
                        />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={styles.key}
                      onClick={() => pressDigit(item.k)}
                      disabled={locked || digitsOnly(value).length >= 2}
                    >
                      {item.k}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 */}
        <footer className={styles.footer}>
          {/* 결제 금액 요약 */}
          <div className={styles.totalBox}>
            <div className={styles.totalLabel}>
              {t('installment_modal.subtitle', '결제금액')}
            </div>
            <div className={styles.totalValueRow}>
              <span className={styles.totalValue}>{localeMoney}</span>
              <span className={styles.totalLabel}>
                <span className={styles.unit}>{t('price_unit', '원')}</span>
              </span>
            </div>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.prevBtn}
              onClick={handleBack}
            >
              {t('installment_modal.prev', '이전')}
            </button>
            <button
              type="button"
              className={styles.payBtn}
              onClick={handlePay}
              // 입력 안하면 비활성화
              disabled={!digitsOnly(value) || exceed}
            >
              {t('installment_modal.pay', '결제하기')}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default InstallmentModal;
