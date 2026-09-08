import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InfoModal from '@/components/Common/InfoModal/InfoModal';
import { useNetworkModalStore } from '@/store/networkModalStore';
import { useBarrierFreeStore } from '@/store/barrierFreeStore';

// 위치 상관없이 네트워크 끊김 시 공통으로 띄워지는 모달
export default function GlobalNetworkModal() {
  const navigate = useNavigate();
  const location = useLocation();

  // 낮은 화면
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);

  const { open, type, title, subtitle, buttonText, openModal, closeModal } =
    useNetworkModalStore();

  // 현재 페이지가 메인 페이지인지 확인
  const isMainPage = location.pathname === '/';

  // 닫을 때 기본 동작: 제품/결제 중이 아니면 메인으로 복귀
  const handleClose = () => {
    closeModal();
    if (!isMainPage) navigate('/');
  };

  // 브라우저 온라인/오프라인 이벤트 감지
  useEffect(() => {
    const onOffline = () => {
      // 메인(/) 페이지에서는 띄우지 않음
      if (isMainPage) {
        // console.log('메인 페이지에서는 띄우지 않음');
        return;
      }
      openModal();
    };
    const onOnline = () => closeModal();

    if (!navigator.onLine) openModal(); // 진입 시 오프라인이면 즉시 알림

    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [openModal, closeModal, isMainPage]);

  if (isMainPage) return null;

  return (
    <InfoModal
      open={open}
      onClose={handleClose}
      type={type}
      title={title}
      subtitle={subtitle}
      buttonText={buttonText}
      isDown={isLowScreenOn} // ✅ 여기!
    />
  );
}
