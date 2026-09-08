import { useNetworkModalStore } from '@/store/networkModalStore';
import { basicApi, categoriesApi, productsApi } from './mainApi';

const isNetworkError = (error) => {
  // 응답 자체가 없거나, Axios 네트워크 에러 코드/메시지
  if (!error?.response) return true;
  if (error?.code === 'ERR_NETWORK') return true;
  if (
    typeof error?.message === 'string' &&
    /Network Error/i.test(error.message)
  )
    return true;
  return false;
};

const isOnMain = () => {
  const p = window.location?.pathname || '/';
  return p === '/' || p === '';
};

// 네트워크/서버 다운 감지 인터셉터
export function setupNetworkInterceptors() {
  const instances = [basicApi, categoriesApi, productsApi];

  instances.forEach((inst) => {
    inst.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;

        // 메인에서는 열지 않음
        if (isOnMain()) return;

        // 1. 네트워크 연결 끊김/타임아웃
        if (isNetworkError(error) || error?.code === 'ECONNABORTED') {
          useNetworkModalStore.getState().openModal({
            type: 'warning',
            title: '네트워크 연결 끊김',
            subtitle: '인터넷 연결 상태를 확인해주세요.',
          });
        }
        // 2. 5xx 에러 반환 시
        // else if (status >= 500 && status < 600) {
        //   useNetworkModalStore.getState().openModal({
        //     type: 'warning',
        //     title: '서버 응답 지연',
        //     subtitle: '잠시 후 다시 시도해주세요.',
        //   });
        // }

        return Promise.reject(error);
      }
    );
  });
}
