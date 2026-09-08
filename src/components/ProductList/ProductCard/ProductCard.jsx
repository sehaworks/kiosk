import { useState, useRef } from 'react';
import styles from './ProductCard.module.css';
import clsx from 'clsx';
import noImage from '@/assets/imgs/icons/no-image.png';
import testImage from '@/assets/imgs/icons/29.png';
import { useTranslation } from 'react-i18next';
import defaultImage from '@/assets/imgs/icons/productDefaultImg.png';
import adultImage from '@/assets/imgs/icons/adult-img.png';
import childImage from '@/assets/imgs/icons/child-img.png';
import youthImage from '@/assets/imgs/icons/youth-img.png';
import babyImage from '@/assets/imgs/icons/baby-img.png';

// isActive: 사용 가능 상태
// kioskVisibleYn: 키오스크 노출 여부 상태

// default 이미지
const DEFAULT_IMAGE = defaultImage;

const ProductCard = ({
  productId,
  // img,
  name,
  desc,
  price,
  isActive,
  kioskVisibleYn,
  productNameKo,
  onClick,
}) => {
  const { t } = useTranslation('product');

  // 클릭/누름 상태를 관리 (hooks는 항상 최상단에 위치)
  const [pressed, setPressed] = useState(false);
  const [clicked, setClicked] = useState(false);
  const clickTimer = useRef(null);

  // 키오스크 노출 여부 체크
  if (kioskVisibleYn == 'N' || isActive === 'N') {
    return null;
  }

  const disabled = isActive === 'N' || kioskVisibleYn == 'N';
  // const soldOut = isActive === 'N';

  // 이름; 괄호 앞에서 줄바꿈
  const formatName = (text) => {
    if (!text) return '';
    // 첫 번째 ( 앞에서만 줄바꿈이면 g 빼고, 모든 (이면 g 유지
    return text.replace('(', '\n(');
    // 또는 모두 적용: return text.replace(/\(/g, '\n(');
  };

  // 터치/마우스 공통 Pointer 이벤트 사용 (터치에서도 안정적)
  const handlePointerDown = () => {
    if (disabled) return;
    setPressed(true);
    // 혹시 이전 타이머가 남아있으면 정리
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
  };

  const clearPressed = () => setPressed(false);

  const handlePointerUp = (e) => {
    if (disabled) return;
    // onClick 먼저 실행
    onClick?.(e);

    // '클릭 플래시' 효과: clicked 클래스를 아주 잠깐만 부여
    setClicked(true);
    clickTimer.current = setTimeout(() => {
      setClicked(false);
      clickTimer.current = null;
    }, 150); // 100~200ms 사이가 자연스러움

    // 누름 상태 해제
    setPressed(false);
  };

  const handlePointerCancel = () => {
    setPressed(false);
  };

  // 이미지 처리(사진 업로드 기능이 없어서 하드코딩)
  const getImage = () => {
    console.log(productNameKo);

    if (productId === 14 || price === 4000 || productNameKo.includes('성인')) {
      return defaultImage;
    } else if (
      productId === 15 ||
      price === 3000 ||
      productNameKo.includes('청소년')
    ) {
      return defaultImage;
    } else if (
      productId === 16 ||
      price === 2000 ||
      productNameKo.includes('어린이')
    ) {
      return defaultImage;
    } else if (
      productId === 17 ||
      price === 1000 ||
      productNameKo.includes('유아')
    ) {
      return defaultImage;
    }
    return DEFAULT_IMAGE;
  };

  return (
    // isActive가 false인 경우 품절 표시
    // <div
    //   className={`${styles.productCard} ${soldOut && styles.soldOut}`}
    // >
    <div
      className={clsx(
        styles.productCard,
        !disabled && styles.clickable,
        pressed && styles.pressedCard,
        clicked && styles.clickedCard
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={clearPressed}
      onPointerCancel={handlePointerCancel}
      role={!disabled ? 'button' : undefined}
      aria-disabled={disabled || undefined}
    >
      {/* transform/jitter 흡수용 래퍼 */}
      <div
        className={clsx(
          styles.cardInner,
          pressed && styles.pressed,
          clicked && styles.clicked
        )}
      >
        <div className={styles.productImage}>
          {/* <img src={img || DEFAULT_IMAGE} alt="product" /> */}
          <img src={getImage() || DEFAULT_IMAGE} alt="product" />
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productName}>{formatName(name) || ''}</div>
          <div className={styles.productDesc}>{desc || ''}</div>
          <div className={styles.productPrice}>
            <span className={styles.priceValue}>{price.toLocaleString()}</span>
            <span className={styles.priceUnit}>{t('price_unit')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
