import { productsApi } from '../mainApi';

export const getProductList = async (orgCode) => {
  console.log("상품 목록 조회 [getProductList]");

  try {
    const response = await productsApi.get('', {
      params: {
        orgCode,
        channel: 'KIOSK',
      },
    });

    console.log("상품 목록 조회 [getProductList] response: ", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};