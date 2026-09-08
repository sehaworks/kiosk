import React, { useEffect, useRef, useState } from 'react';
import ModalLayout from '@/components/Common/ModalLayout/ModalLayout';
import { getPaymentGuideConfig } from '@/constants/paymentGuides';
import { useTranslation } from 'react-i18next';

import { useBarrierFreeStore } from '@/store/barrierFreeStore';
import { payOrder } from '@/services/order';

// 선택된 결제수단에 맞게 가이드 렌더링
const PayGuideModal = ({
  open,
  methodKey,
  orderId,
  amount,
  installment = '00',
  onSuccess, // 결제 성공 콜백(result)
  onFailure, // 결제 실패 콜백(error)
  isDown = false, // ✅ 추가
}) => {
  const { t } = useTranslation('product');

  // deviceId
  const deviceId = localStorage.getItem('kiosk.deviceId');

  const cfg = getPaymentGuideConfig(methodKey, t, {});

  const ctrlRef = useRef(null);
  const seqRef = useRef(0);
  const [submitting, setSubmitting] = useState(false);

  // 낮은 화면
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);

  // 결제 실패 판별
  const isBusinessFail = (res) => {
    // paymentStatus가 FAIL 이거나 cardId가 null이면 결제 실패
    const status = String(res?.paymentStatus || '').toUpperCase();
    const failByStatus = status === 'FAIL';
    const cardIdNull = res?.cardId == null;

    return failByStatus || cardIdNull;
  };

  // 모달이 열릴 때마다 결제 시도
  useEffect(() => {
    if (!open || !orderId || !methodKey || amount == null) return;

    // 이전 진행중 요청 중단
    if (ctrlRef.current) ctrlRef.current.abort();

    const controller = new AbortController();
    ctrlRef.current = controller;
    const mySeq = ++seqRef.current;

    setSubmitting(true);

    (async () => {
      try {
        const res = await payOrder(
          { orderId, methodKey, amount, deviceId, installment },
          { signal: controller.signal }
        );

        // 최신 시퀀스만 반영 (모달 닫혔다 열리는 경쟁상태 방지)
        if (mySeq !== seqRef.current) return;

        // 비즈니스 실패(200 OK이지만 FAIL)
        // onFailure로 정규화해서 전달
        if (isBusinessFail(res)) {
          // onFailure 핸들러가 axios error 형태(err.response.data.message)를 사용 중이므로
          // 동일한 인터페이스를 가진 에러 객체를 만들어서 넘김
          const bizError = new Error('BusinessFailure: payment FAIL');
          bizError.response = { status: 200, data: res };
          onFailure?.(bizError);
          return;
        }

        // 정상 성공
        onSuccess?.(res);
      } catch (err) {
        // 사용자가 '취소'해서 abort된 경우는 무시
        if (controller.signal.aborted) return;
        if (mySeq !== seqRef.current) return;

        onFailure?.(err);
      } finally {
        if (mySeq === seqRef.current) setSubmitting(false);
      }
    })();

    // 언마운트/닫힘 시 진행중 요청 취소
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orderId, methodKey, amount, installment]);

  if (!open) return null;

  return (
    <ModalLayout
      open={open}
      title={cfg.title}
      subtitle={cfg.subtitle}
      contentImg={cfg.contentImg}
      buttons={cfg.buttons}
      contentVideo={cfg.contentVideo}
      isDown={isLowScreenOn}
    />
  );
};

export default PayGuideModal;
