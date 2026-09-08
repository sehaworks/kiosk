import { printerApi } from '../mainApi';

// 프로그램 종료 api
export const exitProgram = async (deviceId) => {
  try {
    const response = await printerApi.post(`/close-chome`, null, {
      params: { deviceId },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
