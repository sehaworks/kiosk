import AdminMainPage from '@/pages/Admin/AdminMainPage';
import KioskInfoPage from '@/pages/Admin/KioskInfoPage';
import PaymentDetailPage from '@/pages/Admin/PaymentDetailPage';
import MainPage from '@/pages/Main/MainPage';
import DiscountInfoPage from '@/pages/DiscountInfo/DiscountInfoPage';
import ProductListPage from '@/pages/Product/ProductListPage';
import PhoneNumberEnterPage from '@/pages/PhoneNumberEnter/PhoneNumberEnterPage';
import HeaderLayout from '@/layouts/HeaderLayout';
import { Route, Routes } from 'react-router-dom';
import DeviceIdInitializer from '@/components/System/DeviceIdInitializer';

const AppRoutes = () => {
  return (
    <>
      <DeviceIdInitializer />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/phone-number-enter" element={<PhoneNumberEnterPage />} />
        <Route path="/discount-info" element={<DiscountInfoPage />} />
        {/* <Route element={<HeaderLayout />}>
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/phone-number-enter" element={<PhoneNumberEnterPage />} />
      </Route> */}

        <Route path="/admin" element={<AdminMainPage />} />
        <Route path="/admin/kiosk-info" element={<KioskInfoPage />} />
        <Route path="/admin/payment-detail" element={<PaymentDetailPage />} />
        <Route path="/admin/kiosk-info" element={<KioskInfoPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
