import { orderApi, basicApi } from '../mainApi';
import { useProductStore } from '@/store/productStore';
import { useKioskStore } from '@/store/kioskStore';

// 주문 등록
export const postOrder = async (order) => {
  try {
    // console.log('[주문해보자] postOrder ORDER', order);
    const response = await orderApi.post('', order);
    // console.log('[주문해보자] postOrder RESPONSE', response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 주문 결제 처리
export const postOrderPayment = async (order) => {
  try {
    // console.log('[결제해보자] postOrderPayment ORDER', order);
    const response = await orderApi.post('/payment', order);
    // console.log('[결제해보자] postOrderPayment RESPONSE', response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 기기 ID 정규화
const normalizeDeviceId = (id) => {
  if (id == null) return 0;
  const n = Number(id);
  return Number.isFinite(n) ? n : String(id);
};

// 장바구니 → 주문 등록 req body로 변환
export function buildOrderPayload(
  cartLines,
  {
    totalAmount,
    discountTotal = 0,
    finalAmount,
    channel = 'KIOSK',
    deviceId,
    orgId,
  }
) {
  // 안전장치: 장바구니 라인에 nameKo가 없더라도, 상품 스토어에서 Ko 이름을 찾아 쓸 수 있게 맵 준비
  const koNameMap = (() => {
    try {
      const list = useProductStore.getState().products || [];
      return new Map(list.map((p) => [p.productId, p.productNameKo]));
    } catch {
      return new Map();
    }
  })();

  const products = cartLines.map((l) => ({
    productId: l.productId,
    // productName: l.name, // 서버에서 검증/감사용으로 받을 수 있어 편리
    // 항상 한글 전송: 1) 라인에 저장된 nameKo → 2) 스토어 조회 → 3) (구버전 대비) name fallback
    productName: l.nameKo ?? koNameMap.get(l.productId) ?? l.name,
    productPrice: l.price,
    productCount: l.qty,
  }));

  const _total =
    totalAmount ?? cartLines.reduce((s, l) => s + l.price * l.qty, 0);
  const _discount = discountTotal ?? 0;
  const _final = finalAmount ?? _total - _discount;

  return {
    products,
    totalAmount: _total, // 총 금액
    discountTotal: _discount,
    finalAmount: _final, // 최종 금액
    channel,
    deviceId: normalizeDeviceId(deviceId),
    orgId: 1,
  };
}

// 결제수단 key → API paymentType 매핑
export function mapPaymentType(methodKey) {
  switch (methodKey) {
    case 'card':
      return 'CARD';
    case 'samsung':
      return 'SAMSUNG';
    case 'apple':
      return 'APPLE';
    case 'kakao':
    case 'naver':
    case 'mobilepayment':
      return 'EASY';
    default:
      return 'CARD';
  }
}

// 결제 처리 req body 생성
export function buildPaymentPayload({
  orderId,
  methodKey,
  amount,
  deviceId,
  installment,
}) {
  const paymentType = mapPaymentType(methodKey);
  const money = Number(amount ?? 0);
  const normalizedDeviceId = normalizeDeviceId(deviceId);
  // installment는 '01'과 같이 string 2자리수로 전달
  // installment는 항상 2자리 문자열
  const inst2 = String(installment ?? '00')
    .replace(/\D/g, '')
    .padStart(2, '0')
    .slice(0, 2);

  return {
    orderId,
    paymentType, // 'CARD' | 'CASH' ...
    amount: money, // 결제해야 할 금액(최종금액)
    deviceId: normalizedDeviceId,
    installment: inst2,
  };
}

// 1) 주문 생성
export async function createOrder(cartLines, priceInfo = {}) {
  const deviceId = useKioskStore.getState().deviceId;
  const orgId = useKioskStore.getState().orgId;
  const payload = buildOrderPayload(cartLines, {
    ...priceInfo,
    deviceId,
    orgId,
  });
  return await postOrder(payload); // { orderId, finalAmount, items: [...] }
}

// 2) 결제 처리
export async function payOrder({
  orderId,
  methodKey,
  amount,
  deviceId,
  installment,
}) {
  const payload = buildPaymentPayload({
    orderId,
    methodKey,
    amount,
    deviceId,
    installment,
  });
  return await postOrderPayment(payload);
}

// QR 발급
export async function issueQr(data) {
  try {
    const response = await basicApi.post('/qr/issue', data);
    // console.log('[QR 발급] issueQr RESPONSE', response.data);
    return response.data;
  } catch (error) {
    console.error('[QR 발급] ERROR', error);
    throw error;
  }
}
