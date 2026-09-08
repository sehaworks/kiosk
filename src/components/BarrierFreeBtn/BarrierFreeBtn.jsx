import { useEffect, useState } from 'react';
import styles from './BarrierFreeBtn.module.css';
import {
  useBarrierFreeStore,
  BARRIER_FREE_MODE,
  VOLUME_LEVELS,
} from '@/store/barrierFreeStore';
// import { useNormalVoice } from '@/hooks/useBarrierFree';

const BarrierFreeBtn = () => {
  // 확대, 고대비는 퍼블리싱에서 처리
  const [isMagnifyOn, setIsMagnifyOn] = useState(false);
  const [isContrastOn, setIsContrastOn] = useState(false);

  // 저자세 모드 (낮은 화면)
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);
  const toggleLowScreen = useBarrierFreeStore((s) => s.toggleLowScreen);

  // 고대비 토글 시 body에 class 적용
  useEffect(() => {
    const body = document.body;
    const className = 'contrast-on';
    if (isContrastOn) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }
    return () => body.classList.remove(className);
  }, [isContrastOn]);

  // 낮은화면 전환 음성 안내
  // const { speakLowScreenOn, speakLowScreenOff } = useNormalVoice();

  // main: 음량 조절
  const volumeIndex = useBarrierFreeStore((s) => s.volumeIndex);
  const increaseVolume = useBarrierFreeStore((s) => s.increaseVolume);
  const decreaseVolume = useBarrierFreeStore((s) => s.decreaseVolume);

  // 시각장애인 모드 상태
  const currentMode = useBarrierFreeStore((s) => s.currentMode);

  // 시각장애인 모드에서는 버튼 숨김 (물리 버튼으로만 조작)
  if (currentMode === BARRIER_FREE_MODE.VISUALLY_IMPAIRED) {
    return null;
  }

  return (
    <div
      className={`${styles.barrierFreeBtnBox} ${isLowScreenOn ? styles.down : ''}`}
    >
      {/* 상단 버튼 그룹 */}
      <div className={styles.bfBtnBox}>
        {/* 확대 버튼 */}
        <button
          className={`${styles.bfBtn} ${styles.magnifyBtn} ${isMagnifyOn ? styles.on : styles.off}`}
          onClick={() => setIsMagnifyOn((prev) => !prev)}
        >
          확대&nbsp;
          <span>{isMagnifyOn ? 'ON' : 'OFF'}</span>
        </button>

        {/* 음량 조절 */}
        {/* <div className={styles.volumeGroup}>
          <span className={styles.volumeLabel}>음량</span>
          <div className={styles.volumeControl}>
            <button
              className={styles.volumeBtn}
              onClick={decreaseVolume}
              disabled={volumeIndex <= 0}
            >
              -
            </button>
            <span className={styles.volumeLevel}>{volumeIndex + 1}단계</span>
            <button
              className={styles.volumeBtn}
              onClick={increaseVolume}
              disabled={volumeIndex >= VOLUME_LEVELS.length - 1}
            >
              +
            </button>
          </div>
        </div> */}
      </div>

      {/* 하단 버튼 그룹 */}
      <div className={styles.bfBtnBox}>
        {/* 고대비 버튼 */}
        <button
          className={`${styles.bfBtn} ${styles.contrastBtn} ${isContrastOn ? styles.on : styles.off}`}
          onClick={() => setIsContrastOn((prev) => !prev)}
        >
          고대비&nbsp;
          <span>{isContrastOn ? 'ON' : 'OFF'}</span>
        </button>

        {/* 낮은화면 버튼 */}
        <button
          className={`${styles.bfBtn} ${styles.lowScreenBtn} ${isLowScreenOn ? styles.on : styles.off}`}
          onClick={() => {
            toggleLowScreen();
            // 전환 후 상태는 반전이므로 현재 상태의 반대 멘트 재생
            if (isLowScreenOn) {
              speakLowScreenOff();
            } else {
              speakLowScreenOn();
            }
          }}
        >
          낮은화면&nbsp;
          <span>{isLowScreenOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
};

export default BarrierFreeBtn;
