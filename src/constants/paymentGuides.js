// 각 결제수단에 대한 가이드 매핑
import noImage from '@/assets/imgs/icons/no-image.png';
import cardVideo from '@/assets/videos/card.mp4';
import samsungVideo from '@/assets/videos/samsungpay.mp4';
import easyVideo from '@/assets/videos/mobilepay.mp4';

// 각 결제수단 키에 대한 가이드 콘텐츠 매핑
// - title/subtitle은 i18n 키를 사용해서 언어별로 분리
// - contentImg는 정적 리소스 import
// - buttons는 ModalLayout의 버튼 스펙 그대로 사용 가능

// 필요 시 공통 취소 버튼 팩토리
const makeCancelButton = (t, onClose) => ({
  text: t('payment_guide_modal.cancel', '취소'),
  type: 'cancel',
  onClick: onClose,
});

// 필요 시 수기 안내 확인 버튼 등 확장 가능
// const makeOkButton = (t, onOk) => ({ text: t('confirm'), type: 'ok', onClick: onOk });

export function getPaymentGuideConfig(methodKey, t, handlers) {
  // console.log('🎂methodKey', methodKey);

  const { onClose } = handlers || {};

  const MAP = {
    card: {
      title: t(
        'payment_guide_modal.credit_card.title',
        '신용카드를 투입구에 넣어주세요'
      ),
      subtitle: t(
        'payment_guide_modal.credit_card.subtitle',
        '결제가 완료될 때까지 카드를 빼지 마세요'
      ),
      contentImg: noImage,
      contentVideo: cardVideo,
      buttons: [makeCancelButton(t, onClose)],
    },
    samsung: {
      title: t(
        'payment_guide_modal.samsung_pay.title',
        '삼성페이를 단말기에 태그해주세요'
      ),
      subtitle: t(
        'payment_guide_modal.samsung_pay.subtitle',
        '휴대폰을 단말기에 가까이 대주세요.'
      ),
      contentImg: noImage,
      contentVideo: samsungVideo,
      buttons: [makeCancelButton(t, onClose)],
    },
    apple: {
      title: t(
        'payment_guide_modal.apple_pay.title',
        '애플페이를 단말기에 태그해주세요'
      ),
      subtitle: t(
        'payment_guide_modal.samsung_pay.subtitle',
        '휴대폰을 단말기에 가까이 대주세요.'
      ),
      contentVideo: samsungVideo,
      buttons: [makeCancelButton(t, onClose)],
    },
    mobilepayment: {
      title: t(
        'payment_guide_modal.easy_pay.title',
        '바코드를 스캐너에 인식시켜주세요'
      ),
      subtitle: t(
        'payment_guide_modal.easy_pay.subtitle',
        '바코드를 리더기에 가까이 대주세요'
      ),
      contentImg: noImage,
      contentVideo: easyVideo,
      buttons: [makeCancelButton(t, onClose)],
    },
    // kakao: {
    //   title: t('payment_guide_modal.kakao_pay.title', '카카오페이 결제 안내'),
    //   subtitle: t(
    //     'payment_guide_modal.kakao_pay.subtitle',
    //     '바코드를 카메라에 가까이 대주세요.'
    //   ),
    //   contentImg: noImage,
    //   buttons: [makeCancelButton(t, onClose)],
    // },
    // naver: {
    //   title: t('payment_guide_modal.naver_pay.title', '네이버페이 결제 안내'),
    //   subtitle: t(
    //     'payment_guide_modal.naver_pay.subtitle',
    //     '네이버 앱에서 결제를 완료해 주세요.'
    //   ),
    //   contentImg: noImage,
    //   buttons: [makeCancelButton(t, onClose)],
    // },
    // zeropay: {
    //   title: t('payment_guide_modal.zero_pay.title', '제로페이 결제 안내'),
    //   subtitle: t(
    //     'payment_guide_modal.zero_pay.subtitle',
    //     'QR을 스캔하거나 앱에서 결제해 주세요.'
    //   ),
    //   contentImg: noImage,
    //   buttons: [makeCancelButton(t, onClose)],
    // },
  };

  // 안전한 폴백
  return (
    MAP[methodKey] || {
      title: t('payment_guide_modal.default.title', '결제 안내'),
      subtitle: t(
        'payment_guide_modal.default.subtitle',
        '화면의 지시에 따라 진행해 주세요.'
      ),
      contentImg: noImage,
      buttons: [makeCancelButton(t, onClose)],
    }
  );
}
