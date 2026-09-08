import React from 'react';
import { useTranslation } from 'react-i18next';
import ModalLayout from '@/components/Common/ModalLayout/ModalLayout';
import noImage from '@/assets/imgs/icons/no-image.png';
import mobileTicket from '@/assets/videos/mobile-ticket.mp4';

/**
 * 티켓 수령 방법 선택 모달
 * - open: 표시 여부
 * - onClose: 닫기(아니오)
 * - onSelectMobile: '모바일 티켓 받기' 클릭
 * - onSelectPaper: (선택) 지류 발급 클릭이 필요해지면 확장
 *
 */
const TicketMethodModal = ({
  open,
  onClose,
  onSelectMobile,
  onSelectPaper,
}) => {
  const { t } = useTranslation('product');

  if (!open) return null;

  const buttons = [
    {
      text: t('ticket_method_modal.paper'),
      type: 'cancel',
      onClick: onSelectPaper,
      fontSize: '50px',
      height: '130px',
    },
    {
      text: t('ticket_method_modal.mobile'),
      type: 'ok',
      onClick: onSelectMobile,
      fontSize: '50px',
      height: '130px',
    },
  ];

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      title={t('ticket_method_modal.title')}
      subtitle={t('ticket_method_modal.subtitle')}
      contentImg={noImage}
      contentVideo={mobileTicket}
      buttons={buttons}
      isTicketMethodModal={true}
    />
  );
};

export default TicketMethodModal;
