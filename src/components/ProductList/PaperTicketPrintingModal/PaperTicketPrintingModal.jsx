import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ModalLayout from '@/components/Common/ModalLayout/ModalLayout';
import noImage from '@/assets/imgs/icons/no-image.png';
import paperTicketPrintingVideo from '@/assets/videos/paper-ticket.mp4';
import { useBarrierFreeStore } from '@/store/barrierFreeStore';

/**
 * 지류(영수증 프린터) 티켓 발권 모달 (UI 시뮬)
 *
 * props
 * - open: 모달 표시 여부
 * - stage: 'printing' | 'done'  (외부에서 제어해도 되고, 내부만 쓰고 싶으면 상위에서 setState로 바꿔주면 됨)
 * - onCancel: (옵션) 출력 중 단계에서 강제 취소가 필요하면 버튼 추가해서 연결
 * - onConfirm: 완료 단계의 "확인" 클릭 콜백
 * - autoCloseSec: 완료 단계에서 자동 닫힘(초). 0 이면 자동 닫힘 없음.
 * - onAutoClose: 카운트다운 0초 시 호출(보통 onConfirm과 동일 동작)
 *
 * 설계 메모
 * - 지정된 디자인 상 "출력 중"에는 버튼이 없으므로 buttons=[]
 * - "완료" 단계에서는 확인 버튼 1개만 노출
 * - 카운트다운 숫자만 강조해야 하므로 subtitle은 ReactNode로 구성 (ModalLayout이 그대로 렌더하므로 OK)
 */

// 지류 입장권 발권 모달

// TODO: 실제 결제 로직 연결 시 로직 변경 필요

const PaperTicketPrintingModal = ({
  open,
  stage = 'printing', // 'printing' | 'done'
  onCancel, // 강제 취소
  onConfirm, // 확인
  autoCloseSec = 20, // 자동 닫힘 초
  onAutoClose, // 자동 닫힘 콜백
}) => {
  const { t } = useTranslation('product');

  // 낮은 화면
  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);

  // 티켓 발권중 모달
  const { title, subtitleTop, buttons, image, isAutoClose, contentVideo } =
    useMemo(() => {
      if (stage === 'printing') {
        return {
          title: t('paper_ticket.printing.title', '티켓을 출력하고 있습니다'),
          subtitleTop: t(
            'paper_ticket.printing.subtitle',
            '출력이 완료될 때까지 잠시만 기다려주세요'
          ),
          // 출력 중엔 버튼 없음 (디자인 기준)
          buttons: [],
          isAutoClose: false,
          image: noImage,
          contentVideo: paperTicketPrintingVideo,
        };
      }

      // 'done'
      // 티켓 발권 완료 모달
      return {
        title: t('paper_ticket.done.title', '티켓 발권이 완료되었습니다'),
        subtitleTop: t(
          'paper_ticket.done.subtitle.prefix',
          '출력된 티켓과 영수증을 받아가세요'
        ),
        buttons: [
          {
            text: t('common.confirm', '확인'),
            type: 'ok',
            onClick: onConfirm,
            fontSize: '50px',
            height: '130px',
          },
        ],
        image: noImage,
        contentVideo: paperTicketPrintingVideo,
        isAutoClose: autoCloseSec > 0,
      };
    }, [stage, t, onConfirm, autoCloseSec]);

  if (!open) return null;

  return (
    <ModalLayout
      open={open}
      onClose={onCancel}
      title={title}
      subtitle={subtitleTop}
      contentImg={image}
      contentVideo={contentVideo}
      buttons={buttons}
      isAutoClose={isAutoClose}
      autoCloseSec={autoCloseSec}
      onAutoClose={onAutoClose}
      isDown={isLowScreenOn}
    />
  );
};

export default PaperTicketPrintingModal;
