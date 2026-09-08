import CustomHeader from '@/components/Common/CustomHeader/CustomHeader';
import CategoryTabs from '@/components/ProductList/CategoryTabs/CategoryTabs';
import ProductCard from '@/components/ProductList/ProductCard/ProductCard';
import ProductCardLowScreen from '@/components/ProductList/ProductCard/ProductCardLowScreen';
import { useBarrierFreeStore } from '@/store/barrierFreeStore';
import styles from './ProductListPage.module.css';

import { useEffect, useMemo, useState, useRef } from 'react';
import CartBar from '@/components/ProductList/CartBar/CartBar';
import { useProductStore } from '@/store/productStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useTranslation } from 'react-i18next';
import CartModal from '@/components/ProductList/CartModal/CartModal';
import PaymentMethodModal from '@/components/ProductList/PaymentMethodModal/PaymentMethodModal';
import OverError from '@/components/ProductList/OverError/OverError';
import PayGuideModal from '@/components/ProductList/PayGuideModal/PayGuideModal';
import TicketMethodModal from '@/components/ProductList/TicketMethodModal/TicketMethodModal';
import PaperTicketPrintingModal from '@/components/ProductList/PaperTicketPrintingModal/PaperTicketPrintingModal';

import { useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { usePaymentStore } from '@/store/paymentStore';

import { useKioskStore } from '@/store/kioskStore';
import { createOrder } from '@/services/order';
import { issueQr } from '@/services/order';
import InstallmentModal from '@/components/ProductList/installmentModal/installmentModal';

import { useOrderStore } from '@/store/orderStore';
import { reissueReceipt } from '@/services/admin';
import { getDeviceInfo } from '@/services/device';
import BarrierFreeBtn from '@/components/BarrierFreeBtn/BarrierFreeBtn';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

// 할부 최소 결제 금액
const MIN_INSTALLMENT_AMOUNT = 50000;

// ==========================================
// 1. 테스트용 하드코딩 더미 데이터 정의
// ==========================================
const DUMMY_PRODUCTS = [
  {
    productId: 1,
    productNameKo: '성인입장권',
    productNameEn: 'Adult Ticket',
    productDescription: '(만 19세 이상)',
    productPrice: 7000,
    isActive: 'Y',
    delYn: 'N',
    categoryCode: 'TICKET',
    kioskVisibleYn: 'Y',
  },
  {
    productId: 2,
    productNameKo: '청소년입장권',
    productNameEn: 'Youth Ticket',
    productDescription: '(만 13세 ~ 18세)',
    productPrice: 5000,
    isActive: 'Y',
    delYn: 'N',
    categoryCode: 'TICKET',
    kioskVisibleYn: 'Y',
  },
  {
    productId: 3,
    productNameKo: '어린이입장권',
    productNameEn: 'Child Ticket',
    productDescription: '(만 7세 ~ 12세)',
    productPrice: 3000,
    isActive: 'Y',
    delYn: 'N',
    categoryCode: 'TICKET',
    kioskVisibleYn: 'Y',
  },
  {
    productId: 4,
    productNameKo: '유아 우대권',
    productNameEn: 'Baby Ticket',
    productDescription: '(36개월 ~ 만 6세)',
    productPrice: 2000,
    isActive: 'Y',
    delYn: 'N',
    categoryCode: 'TICKET',
    kioskVisibleYn: 'Y',
  },
];

const DUMMY_CATEGORIES = [
  { categoryCode: 'TICKET', categoryName: '개인', sortOrder: 1 },
  { categoryCode: 'GROUP', categoryName: '단체', sortOrder: 2 },
];

const ProductListPage = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation('product');

  const navigate = useNavigate();
  const location = useLocation();

  const productListRef = useRef(null);

  // 상품 스토어
  const {
    products,
    prodLoading,
    prodError,
    setProducts,
    setProdLoading,
    setProdError,
  } = useProductStore();

  // 카테고리 스토어
  const {
    categories,
    catLoading,
    catError,
    setCategories,
    setCatLoading,
    setCatError,
  } = useCategoryStore();

  // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState('TICKET');

  // 장바구니 스토어
  const cart = useCartStore((s) => s.cart);
  const addLine = useCartStore((s) => s.add);
  const incLine = useCartStore((s) => s.inc);
  const decLine = useCartStore((s) => s.dec);
  const removeLine = useCartStore((s) => s.remove);
  const clearCart = useCartStore((s) => s.clear);

  // 결제 결과 스토어
  const setPaymentResult = usePaymentStore((s) => s.setPaymentResult);

  // 총 구매 수량 한도/한도 초과 경고 모달/ + 버튼 잠금 플래그
  const [maxQty, setMaxQty] = useState(20);
  const [overLimitOpen, setOverLimitOpen] = useState(false);
  const [incLocked, setIncLocked] = useState(false);

  // 모달 상태
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [isPayGuideModalOpen, setIsPayGuideModalOpen] = useState(false);

  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [installment, setInstallment] = useState('00');
  const [resetInstallmentTrigger, setResetInstallmentTrigger] = useState(0);

  const [isGroupNoticeOpen, setIsGroupNoticeOpen] = useState(false);
  const [isTicketMethodModalOpen, setIsTicketMethodModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // 지류 티켓
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [paperStage, setPaperStage] = useState('printing');
  const paperTimerRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [info, setInfo] = useState(null);
  const [infoButtonText, setInfoButtonText] = useState('닫기');
  const deviceId = useKioskStore((s) => s.deviceId);

  const currentOrder = useOrderStore((s) => s.currentOrder);
  const setOrder = useOrderStore((s) => s.setOrder);
  const clearOrder = useOrderStore((s) => s.clearOrder);

  // 합계 계산
  const totalAmount = useMemo(
    () => cart.reduce((s, l) => s + l.price * l.qty, 0),
    [cart]
  );

  useEffect(() => {
    if (location.state?.reopenTicketMethod) {
      setIsTicketMethodModalOpen(true);
      navigate('/products', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // 장바구니 모달 열기
  const openCartModal = () => {
    if (cart.length === 0) return;
    setIsCartModalOpen(true);
  };

  const goNextFromCart = async () => {
    try {
      setBusy(true);
      const orderRes = await createOrder(cart, {
        totalAmount,
        discountTotal: 0,
        finalAmount: totalAmount,
      });
      setOrder(orderRes);
      setIsCartModalOpen(false);
      setIsPaymentMethodModalOpen(true);
    } catch (e) {
      setInfoTitle('주문 실패');
      setInfoButtonText('확인');
      setInfo('주문 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setBusy(false);
    }
  };

  const backToCart = () => {
    setIsPaymentMethodModalOpen(false);
    setIsCartModalOpen(true);
    setSelectedPaymentMethod(null);
  };

  const handlePay = async () => {
    if (!selectedPaymentMethod) return;

    // 더미 테스트용: orderId가 없으면 임시 주문 정보 생성
    const orderData = currentOrder?.orderId
      ? currentOrder
      : { orderId: 'DUMMY_ORDER_123', finalAmount: totalAmount };

    try {
      setBusy(true);
      setIsPaymentMethodModalOpen(false); // 결제수단 모달 닫기
      setIsPayGuideModalOpen(true); // 결제 안내 모달 열기 (3초간 유지)

      // 3초 대기 후 바로 지류 티켓 발권 모달로 이동
      setTimeout(() => {
        setIsPayGuideModalOpen(false); // 결제 안내 모달 닫기

        // 더미 결제 결과 저장
        setPaymentResult({
          success: true,
          payMethod: selectedPaymentMethod,
          amount: orderData.finalAmount,
        });

        // 티켓 수령 모달 없이 바로 지류 티켓 발권 모달 세팅 및 오픈
        setPaperStage('printing'); // 발권중 상태로 시작
        setIsPaperModalOpen(true); // 지류 티켓 모달 열기

        // 1.5초 후 발권 완료 상태로 전환 (필요시 시간 조절 가능)
        setTimeout(() => {
          setPaperStage('done');
        }, 1500);

      }, 3000);

    } catch (e) {
      setInfoTitle('주문 실패');
      setInfoButtonText('확인');
      setInfo('결제 진행 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleInstallmentBack = () => {
    setIsInstallmentModalOpen(false);
    setIsPaymentMethodModalOpen(true);
  };

  const handleInstallmentPay = (inst2) => {
    setInstallment(inst2);
    setIsInstallmentModalOpen(false);
    setIsPayGuideModalOpen(true);
  };

  const handlePayGuideSuccess = (paymentResult) => {
    setPaymentResult(paymentResult);
    setIsPayGuideModalOpen(false);
    setIsTicketMethodModalOpen(true);
  };

  const handlePayGuideFailure = (err) => {
    setIsPayGuideModalOpen(false);
    setInfoTitle(t('info_modal.title') || '안내');
    setInfoButtonText(t('info_modal.button') || '확인');
    setInfo('결제에 실패했습니다. 다시 시도해 주세요.');

    setIsPaymentMethodModalOpen(true);
    setInstallment('00');
    setResetInstallmentTrigger((n) => n + 1);
  };

  const handleTicketMobile = () => {
    if (!currentOrder?.orderId) return;
    setIsTicketMethodModalOpen(false);
    navigate('/phone-number-enter', { state: { order: currentOrder } });
  };

  const handleTicketPaper = async () => {
    setIsTicketMethodModalOpen(false);
    if (!currentOrder?.orderId) return;

    setPaperStage('printing');
    setIsPaperModalOpen(true);
    try {
      await reissueReceipt(currentOrder.orderId, deviceId || 'MOCK_DEVICE');
      setPaperStage('done');
    } catch (err) {
      setIsPaperModalOpen(false);
      setPaperStage('printing');
      setInfoTitle('발권 실패');
      setInfoButtonText('확인');
      setInfo('지류 발권 도중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const closePaperModal = () => {
    setIsPaperModalOpen(false);
    setPaperStage('printing');
  };
  useEffect(() => () => clearTimeout(paperTimerRef.current), []);

  const didGoHomeRef = useRef(false);

  const goHome = () => {
    if (didGoHomeRef.current) return;
    didGoHomeRef.current = true;

    setIsPaperModalOpen(false);
    setPaperStage('printing');
    clearOrder();
    navigate('/');
  };

  // ==========================================
  // 2. 강제로 더미 데이터를 state에 세팅하는 로직
  // ==========================================
  useEffect(() => {
    setProducts(DUMMY_PRODUCTS);
    setCategories(DUMMY_CATEGORIES);
    setProdLoading(false);
    setCatLoading(false);
    setProdError(null);
    setCatError(null);
  }, [setProducts, setCategories, setProdLoading, setCatLoading, setProdError, setCatError]);

  const visibleAll = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((p) => p.delYn === 'N' && p.isActive === 'Y');
  }, [products]);

  const categoryItems = useMemo(() => {
    if (!categories.length) return [];
    return categories.map((c) => ({
      key: c.categoryCode,
      label: c.categoryName,
      sortOrder: c.sortOrder || 0,
      count: visibleAll.length,
    }));
  }, [categories, visibleAll]);

  useEffect(() => {
    if (!categoryItems.length) {
      setSelectedCategory('');
      return;
    }
    if (!selectedCategory || !categoryItems.some((it) => it.key === selectedCategory)) {
      setSelectedCategory(categoryItems[0].key);
    }
  }, [categoryItems, selectedCategory]);

  const visible = useMemo(() => {
    if (!selectedCategory) return visibleAll;
    return visibleAll.filter((p) => p.categoryCode === selectedCategory);
  }, [visibleAll, selectedCategory]);

  const totalQty = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);

  const showOverLimit = () => {
    setOverLimitOpen(true);
    setIncLocked(true);
  };
  const closeOverLimit = () => {
    setOverLimitOpen(false);
    setIncLocked(false);
  };

  const addToCart = (p) => {
    if (p.isActive === 'N') return;
    if (maxQty != null && totalQty + 1 > maxQty) {
      showOverLimit();
      return;
    }

    addLine({
      productId: p.productId,
      name: p.productNameKo,
      nameKo: p.productNameKo,
      price: p.productPrice,
      qty: 1,
    });
  };

  const inc = (id) => {
    const currentTotal = cart.reduce((s, l) => s + l.qty, 0);
    if (maxQty != null && currentTotal + 1 > maxQty) {
      showOverLimit();
      return;
    }
    incLine(id);
  };

  const dec = (id) => decLine(id);
  const clear = () => clearCart();

  const isLowScreenOn = useBarrierFreeStore((s) => s.isLowScreenOn);

  const PAGE_SIZE = 6;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(visible.length / PAGE_SIZE) || 1;
  const pageItems = visible.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [selectedCategory]);

  const renderList = isLowScreenOn ? pageItems : visible;

  return (
    <div className={`${styles.page} ${isLowScreenOn ? styles.down : ''}`}>
      <CustomHeader
        title="product_list"
        onBack={() => navigate(-1)}
        isHomeBtn
        isDown={isLowScreenOn}
        cartCount={totalQty}
        onCartClick={openCartModal}
      />

      <div className={`${styles.listContainer} ${isLowScreenOn ? styles.down : ''}`}>
        <CategoryTabs
          items={categoryItems}
          value={selectedCategory}
          onChange={setSelectedCategory}
          isDown={isLowScreenOn}
        />

        <div className={styles.productList} ref={productListRef}>
          {renderList.length === 0 ? (
            <div className={styles.empty}>상품이 없습니다.</div>
          ) : (
            <div className={`${styles.grid} ${isLowScreenOn ? styles.down : ''}`}>
              {renderList.map((p) => {
                const cartLine = cart.find((l) => l.productId === p.productId);
                const cartQty = cartLine ? cartLine.qty : 0;
                return isLowScreenOn ? (
                  <ProductCardLowScreen
                    key={p.productId}
                    productId={p.productId}
                    name={p.productNameKo}
                    desc={p.productDescription}
                    price={p.productPrice}
                    isActive={p.isActive}
                    kioskVisibleYn={p.kioskVisibleYn}
                    productNameKo={p.productNameKo}
                    onClick={() => (incLocked ? null : addToCart(p))}
                    qty={cartQty}
                    onInc={() => {
                      if (incLocked) return;
                      if (cartQty === 0) {
                        addToCart(p);
                      } else {
                        inc(p.productId);
                      }
                    }}
                    onDec={() => {
                      if (cartQty <= 1) {
                        removeLine(p.productId);
                      } else {
                        dec(p.productId);
                      }
                    }}
                    incDisabled={incLocked}
                  />
                ) : (
                  <ProductCard
                    key={p.productId}
                    productId={p.productId}
                    name={p.productNameKo}
                    desc={p.productDescription}
                    price={p.productPrice}
                    isActive={p.isActive}
                    kioskVisibleYn={p.kioskVisibleYn}
                    productNameKo={p.productNameKo}
                    onClick={() => (incLocked ? null : addToCart(p))}
                  />
                );
              })}
            </div>
          )}

          <div className={styles.pager}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <BiChevronLeft />
            </button>
            <div className={styles.dots}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${i === page ? styles.activeDot : ''}`}
                  onClick={() => setPage(i)}
                  aria-label={`page ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              className={styles.arrow}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <BiChevronRight />
            </button>
          </div>
        </div>
      </div>

      <CartBar
        cart={cart}
        onInc={inc}
        onDec={dec}
        onRemove={removeLine}
        onClear={clear}
        onPay={openCartModal}
        incDisabled={incLocked}
        isDown={isLowScreenOn}
      />

      <CartModal
        open={isCartModalOpen}
        cart={cart}
        onInc={inc}
        onDec={dec}
        onRemove={removeLine}
        onCancel={() => setIsCartModalOpen(false)}
        onNext={goNextFromCart}
        incDisabled={incLocked}
        isDown={isLowScreenOn}
      />

      <PaymentMethodModal
        open={isPaymentMethodModalOpen}
        cart={cart}
        selected={selectedPaymentMethod}
        onSelect={setSelectedPaymentMethod}
        onBack={backToCart}
        onPay={handlePay}
        isDown={isLowScreenOn}
      />

      <InstallmentModal
        open={isInstallmentModalOpen}
        totalAmount={currentOrder?.finalAmount}
        onBack={handleInstallmentBack}
        onPay={handleInstallmentPay}
        resetTrigger={resetInstallmentTrigger}
        isDown={isLowScreenOn}
      />

      <PayGuideModal
        open={isPayGuideModalOpen}
        methodKey={selectedPaymentMethod}
        orderId={currentOrder?.orderId}
        amount={currentOrder?.finalAmount}
        onSuccess={handlePayGuideSuccess}
        onFailure={handlePayGuideFailure}
        installment={installment}
        isDown={isLowScreenOn}
      />

      <TicketMethodModal
        open={isTicketMethodModalOpen}
        onClose={() => setIsTicketMethodModalOpen(false)}
        onSelectMobile={handleTicketMobile}
        onSelectPaper={handleTicketPaper}
        isDown={isLowScreenOn}
      />

      <PaperTicketPrintingModal
        open={isPaperModalOpen}
        stage={paperStage}
        onCancel={closePaperModal}
        onConfirm={goHome}
        autoCloseSec={20}
        onAutoClose={goHome}
        isDown={isLowScreenOn}
      />

      <OverError
        open={overLimitOpen}
        limit={maxQty}
        onClose={closeOverLimit}
        autoCloseMs={0}
        isDown={isLowScreenOn}
      />

      <BarrierFreeBtn />
    </div>
  );
};

export default ProductListPage;