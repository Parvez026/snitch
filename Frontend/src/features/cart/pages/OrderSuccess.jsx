
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../../products/hooks/useProduct';
import { useCart } from "../hooks/useCart";

/* Currency Formatter */
const sym = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const fmt = (amount, currency = 'INR') =>
  `${sym[currency] || currency + ' '}${Number(amount || 0).toLocaleString('en-IN')}`;

/* Estimated Delivery Date */
const getDeliveryRange = () => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const start = new Date();
  start.setDate(start.getDate() + 3);

  const end = new Date();
  end.setDate(end.getDate() + 5);

  return `${start.toLocaleDateString('en-IN', options)} — ${end.toLocaleDateString('en-IN', options)}`;
};

/* Main Order Success Page */
const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const orderId = queryParams.get("order_id");

  const allProducts =
    useSelector((state) => state.product?.products) || [];

  const { handleGetAllProducts } = useProduct();
  const { handleGetOrderDetails } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [copied, setCopied] = useState(false);

  const deliveryRange = useMemo(() => getDeliveryRange(), []);

  /* Fetch Recommended Products */
  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const recommendations = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];
    return allProducts.slice(0, 4);
  }, [allProducts]);

  /* Fetch Actual Order Details */
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setOrderError("Order ID not found");
        setLoading(false);
        return;
      }

      try {
        const data = await handleGetOrderDetails(orderId);
        console.log("Final Order Data:", data);
        setOrder(data);
      } catch (error) {
        console.error("Order fetch failed:", error);

        setOrderError(
          error.response?.data?.message ||
          "Unable to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  /* Copy Order ID */
  const handleCopyId = () => {
    if (navigator?.clipboard?.writeText && order?.razorpay?.orderId) {
      navigator.clipboard.writeText(order.razorpay.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* Print Receipt */
  const handlePrint = () => {
    window.print();
  };

  /* Loading State */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <p className="text-sm font-medium text-stone-600">
          Loading your order details...
        </p>
      </div>
    );
  }
  
  /* Error State */
  if (orderError || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FAFAF8]">
        <h2 className="text-xl font-bold text-stone-900">
          Unable to load order
        </h2>

        <p className="text-sm text-stone-500">
          {orderError || "Order details not available"}
        </p>

        <Link to="/" className="underline text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  /* Dynamic Order Tracking */
  const orderSteps = [
    {
      step: "01",
      status: "confirmed",
      label: "Order Confirmed",
      sub: "Your order has been confirmed",
    },
    {
      step: "02",
      status: "processing",
      label: "Processing",
      sub: "Your order is being prepared",
    },
    {
      step: "03",
      status: "shipped",
      label: "Shipped",
      sub: "Your order is on the way",
    },
    {
      step: "04",
      status: "delivered",
      label: "Delivered",
      sub: "Order delivered successfully",
    },
  ];

  const statusOrder = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentStatusIndex = statusOrder.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717] antialiased selection:bg-[#171717] selection:text-white print:bg-white print:text-black">

      {/* Breadcrumb */}
      <div className="border-b border-[#e5ddd3] bg-white/70 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between text-xs text-[#82776d]">
          <div className="flex items-center gap-2 tracking-wider uppercase text-[10px] font-semibold">
            <Link to="/" className="hover:text-[#171717] transition-colors">
              Snitch
            </Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-[#171717] transition-colors">
              Bag
            </Link>
            <span>/</span>
            <span className="text-[#171717]">Order Receipt</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-7 sm:py-10">

        {/* Main Confirmation Card */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

          {/* Header */}
          <div className="bg-black text-white px-6 py-5 md:px-8 md:py-6 relative overflow-hidden">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -right-5 -top-12 h-52 w-52 rounded-full border border-white/10" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-[0.35em]">
                  SNITCH<span className="text-stone-500">.</span>
                </span>

                <span className="rounded-full border border-white/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-stone-300">
                  Order Confirmation
                </span>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
                    Payment Successfully Verified
                  </p>
                  <p className="mt-3 max-w-md text-xs leading-relaxed text-stone-400">
                    Thank you for choosing SNITCH. Your order is confirmed
                    and we're getting things ready for you.
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-stone-500">
                    Order Reference
                  </p>

                  <p className="mt-2 break-all font-mono text-xs text-stone-200">
                    {order.razorpay?.orderId}
                  </p>

                  <button
                    onClick={handleCopyId}
                    className="mt-3 text-[10px] cursor-pointer font-semibold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 print:hidden"
                  >
                    {copied ? "Copied!" : "Copy Order ID"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="px-5 py-6 sm:px-8 sm:py-7">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Payment Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    order.status === "paid"
                      ? "bg-emerald-500"
                      : order.status === "pending"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`} />

                  <span className="text-sm font-semibold capitalize text-stone-900">
                    {order.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Delivery Estimate
                </p>

                <p className="mt-2 text-sm font-semibold text-stone-900">
                  {deliveryRange}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Payment Method
                </p>

                <p className="mt-2 text-sm font-semibold text-stone-900">
                  Razorpay
                </p>
              </div>

            </div>

            {/* Divider */}
            <div className="my-6 border-t border-dashed border-stone-200" />

          
{/* Seller-wise Order Tracking */}
  <div>
  <div className="mb-5">
    <h2 className="text-xl font-semibold tracking-tight text-stone-900">
      Order Progress
    </h2>

    <p className="mt-1 text-xs text-stone-500">
      Track delivery updates for each seller separately.
    </p>
  </div>

  {order.sellerOrders?.length > 0 ? (
    <div className="space-y-5">
      {order.sellerOrders.map((sellerOrder, index) => {
        const steps = [
          {
            status: "confirmed",
            label: "Confirmed",
            sub: "Order confirmed",
          },
          {
            status: "processing",
            label: "Processing",
            sub: "Preparing your order",
          },
          {
            status: "shipped",
            label: "Shipped",
            sub: "On the way",
          },
          {
            status: "delivered",
            label: "Delivered",
            sub: "Successfully delivered",
          },
        ];

        const statusOrder = [
          "confirmed",
          "processing",
          "shipped",
          "delivered",
        ];

        const currentIndex = statusOrder.indexOf(
          sellerOrder.orderStatus
        );

        return (
          <div
            key={sellerOrder._id || index}
            className="rounded-xl border border-stone-200 bg-[#faf9f7] p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Seller Order {index + 1}
                </p>

                <h3 className="mt-1 text-sm font-bold text-stone-900">
                  Your Items
                </h3>
              </div>

              <span className="rounded-full bg-stone-900 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white">
                {sellerOrder.orderStatus}
              </span>
            </div>

            {/* Seller Products */}
            <div className="mt-4 space-y-3">
              {sellerOrder.items?.map((item, itemIndex) => (
                <div
                  key={item._id || itemIndex}
                  className="flex items-center gap-3 border-b border-stone-200 pb-3 last:border-0 last:pb-0"
                >
                  <img
                    src={
                      item.images?.[0]?.url ||
                      "/placeholder-image.jpg"
                    }
                    alt={item.title}
                    className="h-16 w-14 rounded-lg object-cover bg-stone-200"
                  />

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-bold text-stone-900">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-[10px] text-stone-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-stone-800">
                      {fmt(
                        item.price?.amount,
                        item.price?.currency
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cancelled Status */}
            {sellerOrder.orderStatus === "cancelled" ? (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
                <p className="text-xs font-semibold text-red-700">
                  This seller's order has been cancelled.
                </p>
              </div>
            ) : (
              /* Tracking Steps */
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {steps.map((step, stepIndex) => {
                  const done = currentIndex >= stepIndex;
                  const active = currentIndex === stepIndex;

                  return (
                    <div
                      key={step.status}
                      className={`rounded-lg border p-3 ${
                        done
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-white text-stone-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px]">
                          0{stepIndex + 1}
                        </span>

                        {done && (
                          <span className="text-emerald-400">
                            ✓
                          </span>
                        )}
                      </div>

                      <h4 className="mt-2 text-[11px] font-bold">
                        {step.label}
                      </h4>

                      <p className="mt-1 text-[9px] leading-relaxed text-stone-400">
                        {step.sub}
                      </p>

                      {active && (
                        <p className="mt-2 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                          Current Stage
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <p className="rounded-xl border border-stone-200 bg-[#faf9f7] p-4 text-xs text-stone-500">
      No seller-wise tracking information available.
    </p>
  )}
  </div>

            {/* Divider */}
            <div className="my-6 border-t border-dashed border-stone-200" />

            {/* Shipping & Support */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Shipping Address */}
              <div className="rounded-xl border border-stone-200 bg-[#faf9f7] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Delivering To
                  </p>

                  <svg className="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z" />
                    <circle cx="12" cy="10" r="2.5" strokeWidth={1.6} />
                  </svg>
                </div>

                <h3 className="mt-3 text-base font-bold text-stone-900">
                  {order.shippingAddress?.fullName}
                </h3>

                <div className="mt-2 space-y-1 text-xs leading-relaxed text-stone-500">
                  <p>{order.shippingAddress?.addressLine}</p>

                  {order.shippingAddress?.landmark && (
                    <p>{order.shippingAddress.landmark}</p>
                  )}

                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state} -{" "}
                    {order.shippingAddress?.pincode}
                  </p>

                  <p>{order.shippingAddress?.phone}</p>
                  <p>{order.shippingAddress?.email}</p>
                </div>

                <span className="mt-3 inline-block rounded-full border border-stone-200 bg-white px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-stone-500">
                  {order.shippingAddress?.addressType || "Address"}
                </span>
              </div>

              {/* Customer Support */}
              <div className="flex flex-col justify-between rounded-xl bg-[#171717] p-4 text-white sm:p-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">
                    We're Here For You
                  </p>

                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    Need a hand?
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-stone-400">
                    Have questions about your order or delivery?
                    Our support team is here to help.
                  </p>
                </div>

                <div className="mt-5 border-t border-white/10 pt-3">
                  <p className="text-xs font-semibold text-white">
                    care@snitch.co.in
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-widest text-stone-500">
                    Customer Support
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between print:hidden">

              <Link
                to="/"
                className="flex h-10 items-center justify-center gap-3 rounded-xl bg-[#171717] px-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-stone-700 active:scale-[0.98]"
              >
                Continue Shopping

                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </Link>

              <button
                onClick={handlePrint}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 transition hover:text-stone-900"
              >
                Print Order Receipt
              </button>

            </div>

          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-16 sm:mt-20 print:hidden">

            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-stone-400 mb-1">
                  CURATED LOOKBOOK
                </p>

                <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
                  You Might Also Admire
                </h3>
              </div>

              <Link
                to="/"
                className="text-xs font-semibold text-stone-800 hover:text-stone-950 underline underline-offset-4 tracking-wider uppercase"
              >
                Explore Full Archive →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.map((prod) => {
                const img =
                  prod.images?.[0]?.url || '/placeholder-image.jpg';

                return (
                  <div
                    key={prod._id}
                    onClick={() => navigate(`/product/${prod._id}`)}
                    className="group relative flex flex-col rounded-2xl border border-[#e5ddd3] bg-white p-3 hover:border-[#c9b8a5] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#f2efec] mb-3">
                      <img
                        src={img}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    <h4 className="font-bold text-sm text-[#171717] line-clamp-1 group-hover:text-stone-600 transition-colors">
                      {prod.title}
                    </h4>

                    <p className="text-xs font-bold text-stone-900 mt-1">
                      {fmt(prod.price?.amount, prod.price?.currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default OrderSuccess;
