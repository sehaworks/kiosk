import React, { useRef, useState, useEffect } from 'react';
import styles from './CartBar.module.css';
import { FiTrash2 } from 'react-icons/fi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import CustomBtn from '@/components/Common/CustomBtn/CustomBtn';
import CartCard from '@/components/ProductList/CartCard/CartCard';

const formatCurrency = (n) => n.toLocaleString();

const CartBar = ({
  cart = [],
  onInc,
  onDec,
  onRemove,
  onClear,
  onPay,
  incDisabled = false,
  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('product');

  const listRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // 스크롤 상태 체크
  const checkScroll = () => {
    const el = listRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  // 스크롤 이동 함수
  const scrollBy = (offset) => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScroll();
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [cart.length]);

  // 장바구니 총 수량 계산
  const totalQty = cart.reduce((s, l) => s + l.qty, 0);

  // 장바구니 총 금액 계산
  const totalAmount = cart.reduce((s, l) => s + l.qty * l.price, 0);

  return (
    <aside className={`${styles.bar} ${isDown ? styles.down : ''}`}>
      {/* 왼쪽 : 장바구니 */}
      <section className={styles.left}>
        <div className={styles.leftHeader}>
          <div className={styles.count}>
            {t('payment_quantity')}{' '}
            <span className={styles.em}>{totalQty}</span>
          </div>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onClear}
            disabled={cart.length === 0}
          >
            {t('delete_all')}
          </button>
        </div>

        {/* 스크롤 화살표 */}
        {showLeft && (
          <button
            type="button"
            className={`${styles.arrowBtn} ${styles.leftArrow}`}
            onClick={() => scrollBy(-300)} // 300px씩 이동
          >
            <IoIosArrowBack size={35} color="white" />
          </button>
        )}
        {/* 장바구니 목록 */}
        <div className={styles.list} ref={listRef} role="list">
          {cart.length === 0 ? (
            <div className={styles.empty}></div>
          ) : (
            cart.map((line) => (
              <CartCard
                key={line.productId}
                line={line}
                onRemove={onRemove}
                onInc={onInc}
                onDec={onDec}
                incDisabled={incDisabled}
              />
            ))
          )}
        </div>
        {showRight && (
          <button
            type="button"
            className={`${styles.arrowBtn} ${styles.rightArrow}`}
            onClick={() => scrollBy(300)}
          >
            <IoIosArrowForward size={35} color="white" />
          </button>
        )}
      </section>

      {/* 오른쪽 : 결제 금액 */}
      <section className={styles.right}>
        <div className={styles.summaryTitle}>{t('total_payment_amount')}</div>
        <div className={styles.total}>
          <strong>{formatCurrency(totalAmount)}</strong>
          <span className={styles.unit}>{t('price_unit')}</span>
        </div>
        <CustomBtn
          text={t('payment_button')}
          onClick={onPay}
          disabled={totalQty === 0}
          height="130px"
        />
      </section>
    </aside>
  );
};

export default CartBar;
