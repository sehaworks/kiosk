import React, { useEffect } from 'react';
import ModalLayout from '@/components/Common/ModalLayout/ModalLayout';
import { getPaymentGuideConfig } from '@/constants/paymentGuides';
import { useTranslation } from 'react-i18next';
import { useBarrierFreeStore } from '@/store/barrierFreeStore';

// 선택된 결제수단에 맞게 가이드 렌더링
// TODO: title 변경해야함
const PayCompleteModal = ({
  open,
  methodKey,
  onClose,
  onFinished,
  simulateMs = 2000,
}) => {
  const { t } = useTranslation('product');
  const cfg = getPaymentGuideConfig(methodKey, t, { onClose });

  // 낮은 화면
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);

  // 결제 완료 시 분기처리하여 내용 바꾸기

  // open되면 simulateMs초 뒤 onFinished 호출
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      // 결제 완료 → 외부로 알림
      onFinished?.();
    }, simulateMs);
    return () => clearTimeout(id);
  }, [open, simulateMs, onFinished]);

  if (!open) return null;

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      title={t('pay_complete_modal.title')}
      subtitle={t('pay_complete_modal.subtitle')}
      contentImg={cfg.contentImg}
      isDown={isLowScreenOn}
    />
  );
};

export default PayCompleteModal;
