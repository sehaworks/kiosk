import { basicApi } from '../mainApi';

// 로컬 기준 YYYY-MM-DD 포맷터 (UTC 영향 제거)
const fmtLocalDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// 관리자 비밀번호 확인
export const checkAdminPw = async (pinPw) => {
  console.log('[관리자 비밀번호 확인] checkAdminPw', pinPw);

  // if (!deviceId) {
  //   const id = localStorage.getItem('kiosk.deviceId');

  //   console.log('[관리자 비밀번호 확인] deviceId 없음, store 에서 조회', id);
  //   deviceId = id;
  // }

  const response = await basicApi.post('/pos/verify-pin', {
    // deviceId,
    pinPw,
  });
  return response.data;
};

// 판매자 코드번호 확인
export const checkEmpNo = async (deviceId, pinPw, empNo) => {
  console.log('[판매자 코드번호 확인] checkEmpNo', deviceId, pinPw, empNo);

  if (!deviceId) {
    const id = localStorage.getItem('kiosk.deviceId');

    console.log('[관리자 비밀번호 확인] deviceId 없음, store 에서 조회', id);
    deviceId = id;
  }

  const response = await basicApi.post('/pos/login-emp', {
    deviceId,
    pinPw,
    empNo,
  });
  return response.data;
};

// 결제 내역 조회
export const getPaymentHistory = async (
  deviceId,
  date = new Date(),
  pageable
) => {
  try {
    const day = fmtLocalDate(date); // '2025-09-23' 형태
    // console.log('[결제 내역 조회] getPaymentHistory DATE', day, pageable);
    const response = await basicApi.get('/payments', {
      params: {
        deviceId,
        startDate: day,
        endDate: day,
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort,
      },
    });
    // console.log('[결제 내역 조회] getPaymentHistory RESPONSE', response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 결제 상세 조회
export const getPaymentDetail = async (paymentId) => {
  try {
    const response = await basicApi.get(`/payments/${paymentId}/detail`);
    // console.log('[결제 상세 조회] getPaymentDetail RESPONSE', response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 환불
export const refundPayment = async (refundInfo) => {
  try {
    const response = await basicApi.post('/order/refund', refundInfo);
    // console.log('[환불] refundPayment RESPONSE', response);

    const data = response?.data;

    // 200이지만 비즈니스 실패인 경우
    if (data && data.status === 'FAIL') {
      const err = new Error(data.message || '환불 실패');
      err.isBizFail = true; // 호출부에서 구분 용도
      err.code = data.code; // 필요시 로깅/분기
      err.payload = data; // 원본 보존
      throw err;
    }

    // 정상 성공으로 간주
    return data;
  } catch (error) {
    // 여기서는 원본 에러를 그대로 던져서 호출부에서 HTTP 500 등 네트워크/서버 오류와 구분하도록 함
    console.error('[환불] refundPayment ERROR', error);
    throw error;
  }
};

// qr 재발행(주문번호) -> 입장권 재발행
export const reissueQr = async (orderId) => {
  try {
    const response = await basicApi.post(`/qr/reissue/order/${orderId}`);
    // console.log('[qr 재발행] reissueQr RESPONSE', response);
    return response.data;
  } catch (error) {
    console.error('[qr 재발행] ERROR', error);

    // 서버에서 내려주는 trace에 메시지가 있는 경우 파싱
    let msg = '다시 시도해주세요';
    const trace = error?.response?.data?.trace;
    if (trace) {
      // 예: "java.lang.IllegalArgumentException: 해당 주문(720)의 QR 티켓이 존재하지 않습니다.\r\n ..."
      const match = trace.match(/IllegalArgumentException:\s*(.+?)\r?\n/);
      if (match && match[1]) {
        msg = match[1].trim();
      }
    }

    // InfoModal에서 바로 subtitle로 쓸 수 있게 throw
    const err = new Error(msg);
    err.isQrReissueFail = true;
    err.subtitle = msg;
    throw err;
  }
};

// 영수증 재발행
export const reissueReceipt = async (orderId, deviceId) => {
  try {
    const response = await basicApi.post('/printer/card-receipt', null, {
      params: { orderId, deviceId },
    });
    // console.log('[영수증 재발행] reissueReceipt RESPONSE', response);
    return response.status;
  } catch (error) {
    console.error('[영수증 재발행] ERROR', error);
    throw error;
  }
};

// 장치 설정 조회
