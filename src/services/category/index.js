import { categoriesApi } from '../mainApi';

// 카테고리 목록 조회
export const getCategoryList = async () => {
  try {
    const response = await categoriesApi.get('');
    // console.log('getCategoryList', response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
