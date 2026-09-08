import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // 1. useLocation 추가
import MainPage from './pages/Main/MainPage';
import ProductListPage from './pages/Product/ProductListPage';
import { useBarrierFreeStore } from './store/barrierFreeStore'; // 스토어 경로 확인

function App() {
  const isHighContrastOn = useBarrierFreeStore((state) => state.isHighContrastOn);
  const location = useLocation(); // 2. 현재 페이지 경로 감지

  // 3. 고대비 상태가 true이거나, 페이지 경로(location.pathname)가 바뀔 때마다 실행!
  useEffect(() => {
    if (isHighContrastOn) {
      document.body.classList.add('contrast-on');
    } else {
      document.body.classList.remove('contrast-on');
    }
  }, [isHighContrastOn, location.pathname]);

  return (
    <Routes>
      {/* 메인 화면 */}
      <Route path="/" element={<MainPage />} />

      {/* /products 주소일 때 이동할 화면 */}
      <Route path="/products" element={<ProductListPage />} />
    </Routes>
  );
}

export default App;