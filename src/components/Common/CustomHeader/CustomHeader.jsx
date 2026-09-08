import leftArrow from '@/assets/imgs/icons/left-arrow.png';

import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './CustomHeader.module.css';
import { useNavigate } from 'react-router-dom';
import homeIcon from '@/assets/imgs/icons/home-icon.png';
import {
  PiHouse,
  PiHouseBold,
  PiShoppingCart,
  PiShoppingCartBold,
} from 'react-icons/pi';

const TitleAnimator = ({ titleKey }) => {
  const { t } = useTranslation('header');
  const [prev, setPrev] = useState(titleKey);
  const [anim, setAnim] = useState(false); // true면 교체 애니메이션 진행

  useEffect(() => {
    if (titleKey === prev) return;
    setAnim(true);
    const tm = setTimeout(() => {
      setPrev(titleKey);
      setAnim(false);
    }, 220); // CSS duration과 맞춤
    return () => clearTimeout(tm);
  }, [titleKey, prev]);

  return (
    <div className={styles.titleSwap}>
      {anim && (
        <div className={`${styles.title} ${styles.titleOut}`}>{t(prev)}</div>
      )}
      <div className={`${styles.title} ${anim ? styles.titleIn : ''}`}>
        {t(titleKey)}
      </div>
    </div>
  );
};

const CustomHeader = ({
  title,
  isHomeBtn = false, // '처음으로' 버튼 여부
  onBack,
  onHome,
  onCartClick,
  cartCount = 0,
  animatedTitle = false,
  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('header');
  const navigate = useNavigate();

  const handleGoToMain = () => {
    if (onHome) {
      onHome();
    } else {
      navigate('/');
    }
  };

  return (
    <header className={`${styles.header} ${isDown ? styles.down : ''}`}>
      {/* 처음으로 가기 */}
      {isHomeBtn && (
        <div className={styles.left}>
          <div className={styles.homeBtn} onClick={handleGoToMain}>
            {/* {t('go_to_main', '처음으로')} */}
            <PiHouse />
          </div>
        </div>
      )}

      {/* 페이지 이름 */}
      <div className={styles.center}>
        {animatedTitle ? (
          <TitleAnimator titleKey={title} />
        ) : (
          <div className={styles.title}>{t(title)}</div>
        )}
        {/* <div className={styles.title}>{t(title)}</div> */}
      </div>

      {/* 카트 */}
      <div className={styles.right}>
        <div className={styles.cartBtn} onClick={onCartClick}>
          <PiShoppingCart />
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;
