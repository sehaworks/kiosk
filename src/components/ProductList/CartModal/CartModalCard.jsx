import React from 'react';
import styles from './CartModalCard.module.css';
import { useTranslation } from 'react-i18next';
import { FiTrash2 } from 'react-icons/fi';
import noImage from '@/assets/imgs/icons/no-image.png';
import adultImage from '@/assets/imgs/icons/adult-img.png';
import childImage from '@/assets/imgs/icons/child-img.png';
import youthImage from '@/assets/imgs/icons/youth-img.png';
import babyImage from '@/assets/imgs/icons/baby-img.png';

// default 이미지
const DEFAULT_IMAGE = adultImage;

const CartModalCard = ({
  line,
  onInc,
  onDec,
  onRemove,
  incDisabled = false,
}) => {
  const { t } = useTranslation('product');

  //  금액 포맷 함수
  const fmt = (n) => n.toLocaleString();

  // 이미지 처리(사진 업로드 기능이 없어서 하드코딩)
  const getImage = () => {
    console.log(line);
    if (
      line.key === 14 ||
      line.price === 4000 ||
      line.nameKo.includes('성인')
    ) {
      return adultImage;
    } else if (
      line.key === 15 ||
      line.price === 3000 ||
      line.nameKo.includes('청소년')
    ) {
      return youthImage;
    } else if (
      line.key === 16 ||
      line.price === 2000 ||
      line.nameKo.includes('어린이')
    ) {
      return childImage;
    } else if (
      line.key === 17 ||
      line.price === 1000 ||
      line.nameKo.includes('유아')
    ) {
      return babyImage;
    }
    return DEFAULT_IMAGE;
  };

  return (
    <article className={styles.line} role="listitem">
      {/* 상품권명 + 수량 */}
      <div className={styles.left}>
        <div className={styles.name}>{line.name}</div>
      </div>
      <div className={styles.center}>
        <span className={styles.qty}>
          {line.qty}
          {t('ticket_unit', '장')}
        </span>
      </div>

      {/* 단가 + 삭제 버튼 */}
      <div className={styles.right}>
        <div className={styles.priceBox}>
          <span className={styles.priceValue}>
            {fmt(line.price * line.qty)}
          </span>
          <span className={styles.priceUnit}>{t('price_unit', '원')}</span>
        </div>
      </div>
    </article>
  );
};

export default CartModalCard;
