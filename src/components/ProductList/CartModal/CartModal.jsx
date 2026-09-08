import { useTranslation } from 'react-i18next';
import styles from './CartModal.module.css';
import { FiTrash2 } from 'react-icons/fi';
import ReactDOM from 'react-dom';
import CartModalCard from './CartModalCard';
import CustomBtn from '@/components/Common/CustomBtn/CustomBtn';

const CartModal = ({
  open,
  cart = [],
  onInc, // 수량 증가
  onDec, // 수량 감소
  onRemove, // 삭제
  onCancel, // 취소
  onNext,
  incDisabled = false,
  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('product');

  const totalQty = cart.reduce((s, l) => s + l.qty, 0);
  const totalAmount = cart.reduce((s, l) => s + l.qty * l.price, 0);
  //  금액 포맷 함수
  const fmt = (n) => n.toLocaleString();

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${isDown ? styles.down : ''}`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={styles.modal}
        // 오버레이 클릭으로 닫히지 않도록 stopPropagation
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className={styles.header}>
          <div className={styles.title}>
            {t('cart_modal.title', '선택한 내역을 확인해주세요')}
          </div>
        </header>

        {/* 본문 */}
        <div className={styles.content}>
          {/* 결제 수량 */}
          <div className={styles.subInfo}>
            {t('payment_quantity', '결제수량')}
            <strong className={styles.em}>{totalQty}</strong>
          </div>

          {/* 장바구니 내역 */}
          <section className={styles.cartList} role="list">
            {cart.length === 0 ? (
              <div className={styles.empty}>
                {t('cart_modal.empty', '상품을 선택해주세요.')}
              </div>
            ) : (
              cart.map((line) => (
                <CartModalCard
                  key={line.productId}
                  line={line}
                  onInc={onInc}
                  onDec={onDec}
                  onRemove={onRemove}
                  incDisabled={incDisabled}
                />
              ))
            )}
          </section>
        </div>

        {/* 총액, 버튼 */}
        <footer className={styles.footer}>
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
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onCancel}
            >
              {t('cart_modal.cancle', '취소')}
            </button>
            <button
              type="button"
              className={styles.nextBtn}
              onClick={onNext}
              disabled={cart.length === 0}
            >
              {t('cart_modal.next', '다음')}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default CartModal;
