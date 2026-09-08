import logo from '../../assets/imgs/logos/jeongeupLogo.png';
import logoW from '../../assets/imgs/logos/jeongeupLogo_w.png';
import languageIcon from '../../assets/imgs/main/language-icon.png';
import mainBg from '../../assets/imgs/main/main-bg.jpg';
import mascotFace from '../../assets/imgs/main/mascot-face.png';
import flagKo from '../../assets/imgs/icons/ko-lang.png';
import flagEn from '../../assets/imgs/icons/en-lang.png';
import flagZh from '../../assets/imgs/icons/zh-lang.png';
import flagJa from '../../assets/imgs/icons/ja-lang.png';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomBtn from '../../components/Common/CustomBtn/CustomBtn';
// import { getProductList } from '../../services/product';
import { useProductStore } from '../../store/productStore';
import { useTranslation } from 'react-i18next';
import '../../locales/i18n'
import { useCategoryStore } from '../../store/categoryStore';
// import { useNormalVoice } from '../../hooks/useBarrierFree';
import { useBarrierFreeStore } from '../../store/barrierFreeStore';
// import { getCategoryList } from '@/services/category';
import { resetKioskSession } from '../../store/resetAll';

import styles from './MainPage.module.css';
import LanguagePanel from '../../components/Main/LanguagePanel/LanguagePanel';

// import { getDeviceInfo } from '@/services/device';
// import { useKioskStore } from '@/store/kioskStore';
// import { useOrderStore } from '@/store/orderStore';

import { HiMagnifyingGlassPlus } from 'react-icons/hi2';
import { VscEye } from 'react-icons/vsc';
import { RiWheelchairLine } from 'react-icons/ri';
import { IoChevronDownOutline } from 'react-icons/io5';


// TODO : 상품 불러오지 못했을 때 모달 띄우기

const MainPage = () => {
  const navigate = useNavigate();

  // 저자세 모드 (낮은 화면)
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);
  const toggleLowScreen = useBarrierFreeStore((s) => s.toggleLowScreen);

  // 고대비모드
  const [isContrastOn, setIsContrastOn] = useState(false);

  const handleContrastToggle = () => {
    setIsContrastOn((prev) => {
      const next = !prev;
      document.body.classList.toggle('contrast-on', next);
      return next;
    });
  };

  // const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 일반 모드 음성 안내
  // const { speakLanguageSelected } = useNormalVoice();

  const didResetRef = useRef(false);

  // state 관리
  const [openLang, setOpenLang] = useState(false); // 언어 선택 모달

  // 지원 언어 목록
  const [supportedLangs, setSupportedLangs] = useState([
    'ko',
    'en',
    'ja',
    'zh',
  ]);

  // 선택한 언어 가져오기
  const [lang, setLang] = useState(i18n.language);

  const langMap = {
    ko: { label: '한국어', img: flagKo },
    en: { label: 'English', img: flagEn },
    ja: { label: '日本語', img: flagJa },
    zh: { label: '中文', img: flagZh },
  };

  const currentLang = langMap[lang] ?? {};

  useEffect(() => {
    const onLangChanged = (lng) => setLang(lng);
    i18n.on('languageChanged', onLangChanged);
    return () => i18n.off('languageChanged', onLangChanged);
  }, [i18n]);

  return (
    <div
      className={`${styles.page} ${isLowScreenOn ? styles.down : ''}`}
      //   onDoubleClick={(e) => e.preventDefault()}
      style={{ '--main-bg': `url(${mainBg})` }}
    >
      <header className={styles.header}>
        <img
          src={isContrastOn ? logoW : logo}
          alt="정읍시 로고"
          className={styles.logo}
        // onClick={handleLogoClick}
        />
        <div className={styles.langWrap} onClick={() => setOpenLang((v) => !v)}>
          <span className={styles.selectedLang}>
            <img src={currentLang.img} alt="lang" />
            <span>{currentLang.label}</span>
          </span>
          <span className={styles.chevDown}>
            <IoChevronDownOutline />
          </span>
          <LanguagePanel
            open={openLang}
            current={i18n.language}
            onClose={() => setOpenLang(false)}
            onSelect={(lng) => {
              i18n.changeLanguage(lng);
              setOpenLang(false);
              // 언어 선택 시 음성 안내
              speakLanguageSelected(lng);
            }}
            langs={supportedLangs} // 서버에서 주는 지원 언어 목록
          />
        </div>
      </header>

      <section className={styles.title}>
        <div className={styles.topTitleText}>
          {t(
            'top_title',
            '전통과 기술이 만나 과거와 현재,\n그리고 미래를 잇는 공간'
          )}
        </div>
        <div className={styles.titleText}>
          {t('main_title', '정읍 국가유산 미디어아트관\n방문을 환영합니다.')}
        </div>
        {/* <div className={styles.subTitleText}>
          {t('sub_title', '원하시는 서비스를 선택해주세요')}
        </div> */}
      </section>

      <footer className={styles.footerBox}>
        <div className={styles.barrierFreeBtnUnit}>
          <div
            className={`${styles.whiteBtn} ${styles.contrastBtn} ${isContrastOn ? styles.on : styles.off
              }`}
            onClick={handleContrastToggle}
            role="button"
            tabIndex={0}
          >
            <VscEye />
            {t('contrast_btn', '고대비')}
          </div>
          <div
            className={`${styles.whiteBtn} ${styles.lowScreenBtn} ${isLowScreenOn ? styles.on : styles.off}`}
            onClick={() => {
              toggleLowScreen();
              // 전환 후 상태는 반전이므로 현재 상태의 반대 멘트 재생
              // if (isLowScreenOn) {
              //   speakLowScreenOff();
              // } else {
              //   speakLowScreenOn();
              // }
            }}
          >
            <RiWheelchairLine />
            {t('screen_btn', '낮은화면')}
          </div>
        </div>
        <div className={styles.footer}>
          {/* <div className={`${styles.whiteBtn} ${styles.magnifyBtn}`}>
            <HiMagnifyingGlassPlus />
            {t('magnify_btn', '확대')}
          </div> */}
          <CustomBtn
            text={t('start_btn', '현장 티켓 구매')}
            onClick={(e) => {
              navigate('/products');
            }}
            fontSize="52px"
          />
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
