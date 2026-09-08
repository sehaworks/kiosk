import axios from 'axios';

// -------------------------------------------------------------
// [컴포넌트 속성에 맞춘 더미 데이터]
// -------------------------------------------------------------
const dummyCategories = [
  { categoryId: 1, categoryName: '티켓' },
];

const dummyProducts = [
  {
    productId: 1,
    productNameKo: '성인 일반 입장권',
    productNameEn: 'Adult Ticket',
    productDescription: '만 19세 이상 일반 관람권',
    productPrice: 10000,
    isActive: 'Y',
    kioskVisibleYn: 'Y',
  },
  {
    productId: 2,
    productNameKo: '청소년 / 군인 입장권',
    productNameEn: 'Youth / Military Ticket',
    productDescription: '만 13세 ~ 18세 및 군인 할인',
    productPrice: 7000,
    isActive: 'Y',
    kioskVisibleYn: 'Y',
  },
  {
    productId: 3,
    productNameKo: '어린이 입장권',
    productNameEn: 'Child Ticket',
    productDescription: '만 7세 ~ 12세 어린이',
    productPrice: 5000,
    isActive: 'Y',
    kioskVisibleYn: 'Y',
  },
  {
    productId: 4,
    productNameKo: '경로 / 장애인 우대권',
    productNameEn: 'Senior / Disabled Ticket',
    productDescription: '만 65세 이상 및 장애인 (증빙 필수)',
    productPrice: 0,
    isActive: 'Y',
    kioskVisibleYn: 'Y',
  },
];

const dummyOrderSuccess = {
  success: true,
  orderId: 'ORD-20260908-001',
  message: '주문이 완료되었습니다.',
};

const API_DEV_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://192.168.0.10:8082/api';

function createInstance(url = '') {
  const instance = axios.create({
    baseURL: `${API_DEV_URL}${url}`,
    timeout: 120000,
  });

  // [더미 전용 Interceptor]
  instance.interceptors.request.use((config) => {
    console.log(`[Dummy Mode] 요청 가로챔: ${config.baseURL}${config.url || ''}`);

    let responseData = [];
    const fullPath = `${config.baseURL}${config.url || ''}`;

    if (fullPath.includes('/category')) {
      responseData = dummyCategories;
    } else if (fullPath.includes('/products')) {
      responseData = dummyProducts;
    } else if (fullPath.includes('/order')) {
      responseData = dummyOrderSuccess;
    } else if (fullPath.includes('/printer') || fullPath.includes('/devices')) {
      responseData = { success: true, message: '장치 연결 성공(Dummy)' };
    }

    return Promise.reject({
      config,
      response: {
        status: 200,
        statusText: 'OK',
        data: responseData,
      },
      isDummy: true,
    });
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.isDummy) {
        return Promise.resolve(error.response);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const basicApi = createInstance();
export const categoriesApi = createInstance('/category');
export const productsApi = createInstance('/products');
export const orderApi = createInstance('/order');
export const printerApi = createInstance('/printer');
export const devicesApi = createInstance('/devices');