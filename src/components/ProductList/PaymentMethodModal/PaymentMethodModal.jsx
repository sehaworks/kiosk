import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styles from './PaymentMethodModal.module.css';
import { useTranslation } from 'react-i18next';
import noImage from '@/assets/imgs/icons/no-image.png';
// 결제수단 이미지
import samsungPay from '@/assets/imgs/icons/samsungpay.png';
import applePay from '@/assets/imgs/icons/applepay.png';
import mobilePay from '@/assets/imgs/icons/mobilepay.png';
import creditCard from '@/assets/imgs/icons/card.png';

const PaymentMethodModal = ({
  open,
  cart = [],
  methods, // 결제수단 목록
  selected, // 선택된 결제수단
  onSelect,
  onBack,
  onPay,
  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('product');

  // 총액 계산(상위 cart 변경 시 자동 갱신)
  const totalAmount = useMemo(
    () => cart.reduce((sum, l) => sum + l.price * l.qty, 0),
    [cart]
  );
  const fmt = (n) => n.toLocaleString();

  // 선택 상태(상위에서 제어 안 주면 내부 로컬 상태 사용)
  const [innerSelected, setInnerSelected] = useState(null);
  const value = selected ?? innerSelected;
  const setValue = onSelect ?? setInnerSelected;

  // 기본 결제수단(임시 이미지 영역 포함)
  const items = methods ?? [
    {
      key: 'card',
      label: t('payment_method_modal.credit_card'),
      img: creditCard,
    },
    {
      key: 'mobilepayment',
      label: t('payment_method_modal.mobile_payment'),
      img: mobilePay,
    },
    {
      key: 'samsung',
      label: t('payment_method_modal.samsung_pay'),
      img: samsungPay,
    },
    {
      key: 'apple',
      label: t('payment_method_modal.apple_pay'),
      img: applePay,
    },
  ];

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${isDown ? styles.down : ''}`}
      aria-modal="true"
      role="dialog"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <header className={styles.header}>
          <div className={styles.title}>{t('payment_method_modal.title')}</div>
        </header>

        {/* 본문 */}
        <section className={styles.content}>
          {/* 총 결제 금액 */}
          <div className={styles.totalBox}>
            <span className={styles.totalLabel}>
              {t('total_payment_amount')}
            </span>
            <span className={styles.totalValue}>
              {fmt(totalAmount)}
              <span className={styles.unit}>{t('price_unit', '원')}</span>
            </span>
          </div>
          {/* 결제수단 */}
          <div className={styles.grid}>
            {items.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`${styles.methodCard} ${
                  value === m.key ? styles.selected : ''
                }`}
                onClick={() => setValue(m.key)}
              >
                <div className={styles.thumb} aria-hidden>
                  <img src={m.img || noImage} alt={m.label} />
                </div>
                <div className={styles.label}>{m.label}</div>
              </button>
            ))}
          </div>
        </section>

        {/* 하단 버튼 */}
        <footer className={styles.footer}>
          {/* 총 결제 금액 */}
          <div className={styles.totalBox}>
            <span className={styles.totalLabel}>
              {t('total_payment_amount', '결제금액')}
            </span>
            <span className={styles.totalValue}>
              {fmt(totalAmount)}
              <span className={styles.unit}>{t('price_unit', '원')}</span>
            </span>
          </div>
          {/* 하단 버튼 */}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onBack}>
              {t('payment_method_modal.prev', '취소')}
            </button>
            <button
              type="button"
              className={styles.nextBtn}
              onClick={onPay}
              disabled={!value || cart.length === 0}
            >
              {t('payment_method_modal.pay', '다음')}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default PaymentMethodModal;
