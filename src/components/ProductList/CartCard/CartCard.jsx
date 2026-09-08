import React from 'react';
import styles from './CartCard.module.css';
import { FiTrash2 } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';
import { PiPlusBold, PiMinusBold, PiXCircleFill } from 'react-icons/pi';

const formatCurrency = (n) => n.toLocaleString();

const CartCard = ({ line, onRemove, onInc, onDec, incDisabled = false }) => {
  const { t } = useTranslation('product');

  const isLongName = (line.name ?? '').length > 8;

  return (
    <div
      // className={styles.item}
      className={`${styles.item} ${isLongName ? styles.itemWide : ''}`}
      role="listitem"
    >
      <div className={styles.itemHead}>
        <div className={styles.itemName}>{line.name}</div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.circleBtn}
          aria-label="수량 감소"
          onClick={() => onDec(line.productId)}
          disabled={line.qty <= 1}
        >
          <PiMinusBold />
        </button>
        <span className={styles.qty}>{line.qty}</span>
        <button
          type="button"
          className={styles.circleBtn}
          aria-label="수량 증가"
          onClick={() => onInc(line.productId)}
          disabled={incDisabled}
        >
          <PiPlusBold />
        </button>
      </div>

      <div className={styles.price}>
        {formatCurrency(line.price * line.qty)} {t('price_unit', '원')}
      </div>

      <button
        type="button"
        className={styles.removeBtn}
        aria-label={`${line.name} 삭제`}
        onClick={() => onRemove(line.productId)}
      >
        <PiXCircleFill size={48} />
      </button>
    </div>
  );
};

export default CartCard;
