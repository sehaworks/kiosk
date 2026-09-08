import { devicesApi, basicApi } from '../mainApi';

// 단일 장치 조회
export const getDeviceInfo = async (deviceId) => {
  try {
    const response = await devicesApi.get(`/${deviceId}`);
    console.log('[장치정보] getDeviceInfo RESPONSE', response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
