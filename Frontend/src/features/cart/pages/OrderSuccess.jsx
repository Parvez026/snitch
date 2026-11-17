
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../../products/hooks/useProduct";
import { useCart } from "../hooks/useCart";

import {
  Check,
  Copy,
  ArrowRight,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Clock3,
  CheckCircle2,
  Printer,
  Headphones,
} from "lucide-react";

/* -------------------- Helpers -------------------- */

const formatPrice = (price) => {
  const amount = price?.amount ?? price ?? 0;
  const currency = price?.currency || "INR";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getDeliveryRange = () => {
  const start = new Date();
  start.setDate(start.getDate() + 3);

  const end = new Date();
  end.setDate(end.getDate() + 5);

  return `${start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })} - ${end.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })}`;
};

/* -------------------- Tracking Steps -------------------- */

const trackingSteps = [
  {
    status: "confirmed",
    label: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: CheckCircle2,
  },
  {
    status: "processing",
    label: "Processing",
    description: "Your items are being prepared.",
    icon: Package,
  },
  {
    status: "shipped",
    label: "Shipped",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: Check,
  },
];

const statusOrder = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

/* -------------------- Main Component -------------------- */

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = useMemo(
    () => new URLSearchParams(location.search).get("order_id"),
    [location.search]
  );

  const allProducts =
    useSelector((state) => state.product?.products) || [];

  const { handleGetAllProducts } = useProduct();
  const { handleGetOrderDetails } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [copied, setCopied] = useState(false);

  const deliveryRange = useMemo(() => getDeliveryRange(), []);

  /* Fetch Recommendations */
  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const recommendations = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];

    return allProducts.slice(0, 4);
  }, [allProducts]);

  /* Fetch Order */
  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      if (!orderId) {
        setOrderError("Order ID not found");
        setLoading(false);
        return;
      }

      try {
        const data = await handleGetOrderDetails(orderId);

        if (isMounted) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Order fetch failed:", error);

        if (isMounted) {
          setOrderError(
            error.response?.data?.message ||
              "Unable to fetch order details"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  /* Copy Order ID */
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(
        order.razorpay?.orderId || ""
      );

      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /* Print */
  const handlePrint = () => {
    window.print();
  };

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900" />

          <p className="mt-4 text-xs tracking-widest uppercase text-stone-500">
            Loading your order
          </p>
        </div>
      </div>
    );
  }

  /* Error */
  if (orderError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] px-5">
        <div className="max-w-md text-center">
          <Package className="mx-auto h-10 w-10 text-stone-400" />

          <h2 className="mt-5 text-2xl font-semibold text-stone-900">
            Unable to load order
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            {orderError || "Order details not available"}
          </p>

          <Link
            to="/my-orders"
            className="mt-7 inline-flex items-center gap-2 bg-stone-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            My Orders <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusOrder.indexOf(
    order.orderStatus
  );

  const isCancelled = order.orderStatus === "cancelled";
  const isPending = order.orderStatus === "pending";

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#171717] print:bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="text-[11px] font-black tracking-[0.3em]"
          >
            SNITCH<span className="text-stone-400">.</span>
          </Link>

          <span className="mx-3 text-stone-300">/</span>

          <span className="text-[10px] uppercase tracking-widest text-stone-500">
            Order Details
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">

        {/* Success Header */}
        <section className="mb-8 rounded-2xl bg-[#171717] px-6 py-8 text-white sm:px-10 sm:py-10">

          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
                {order.status === "paid"
                  ? "Payment Successful"
                  : `Payment ${order.status}`}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Thank you for your order.
              </h1>
            </div>

            <div className="sm:min-w-[210px] sm:text-right">
              <p className="text-[9px] uppercase tracking-[0.25em] text-stone-500">
                Order Reference
              </p>
              <p className="mt-2 break-all font-mono text-xs text-stone-200">
                {order.razorpay?.orderId}
              </p>
              <button
                onClick={handleCopyId}
                className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-stone-300 transition hover:text-white print:hidden"
              >
                {copied ? (
                  <>
                    <Check size={13} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy Reference
                  </>
                )}
              </button>
            </div>

          </div>
        </section>

        {/* Order Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                <CreditCard size={17} />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  Payment
                </p>

                <p className="mt-1 text-sm font-semibold capitalize">
                  {order.status}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                <Clock3 size={17} />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  Order Date
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                <Truck size={17} />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-widest text-stone-400">
                  Estimated Delivery
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {deliveryRange}
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* Order Tracking */}
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 sm:p-8">

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                Delivery Updates
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Order Progress
              </h2>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${
                isCancelled
                  ? "bg-red-50 text-red-700"
                  : "bg-stone-100 text-stone-800"
              }`}
            >
              {order.orderStatus || "Pending"}
            </span>
          </div>

          {isCancelled ? (
            <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-5">
              <h3 className="text-sm font-semibold text-red-800">
                This order has been cancelled.
              </h3>

              <p className="mt-1 text-xs text-red-600">
                Please contact customer support if you need assistance.
              </p>
            </div>
          ) : (
            <div className="mt-9">

              {/* Desktop Timeline */}
              <div className="hidden sm:block">
                <div className="relative grid grid-cols-4">

                  <div className="absolute left-[12.5%] right-[12.5%] top-5 h-[2px] bg-stone-200" />

                  <div
                    className="absolute left-[12.5%] top-5 h-[2px] bg-stone-900 transition-all duration-500"
                    style={{
                      width:
                        currentStatusIndex < 0
                          ? "0%"
                          : `${(currentStatusIndex / 3) * 75}%`,
                    }}
                  />

                  {trackingSteps.map((step, index) => {
                    const done = currentStatusIndex >= index;
                    const active = currentStatusIndex === index;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.status}
                        className="relative flex flex-col items-center text-center"
                      >
                        <div
                          className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                            done
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 bg-white text-stone-400"
                          }`}
                        >
                          <Icon size={16} />
                        </div>

                        <h3
                          className={`mt-4 text-xs font-semibold ${
                            done ? "text-stone-900" : "text-stone-400"
                          }`}
                        >
                          {step.label}
                        </h3>

                        <p className="mt-2 max-w-[130px] text-[10px] leading-relaxed text-stone-400">
                          {step.description}
                        </p>

                        {active && (
                          <span className="mt-3 text-[8px] font-bold uppercase tracking-widest text-emerald-700">
                            Current Stage
                          </span>
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>

              {/* Mobile Timeline */}
              <div className="space-y-6 sm:hidden">
                {trackingSteps.map((step, index) => {
                  const done = currentStatusIndex >= index;
                  const active = currentStatusIndex === index;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                            done
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 bg-white text-stone-400"
                          }`}
                        >
                          <Icon size={15} />
                        </div>

                        {index !== 3 && (
                          <div
                            className={`mt-2 h-8 w-[2px] ${
                              currentStatusIndex > index
                                ? "bg-stone-900"
                                : "bg-stone-200"
                            }`}
                          />
                        )}
                      </div>

                      <div className="pt-1">
                        <h3
                          className={`text-sm font-semibold ${
                            done ? "text-stone-900" : "text-stone-400"
                          }`}
                        >
                          {step.label}
                        </h3>

                        <p className="mt-1 text-xs text-stone-400">
                          {step.description}
                        </p>

                        {active && (
                          <span className="mt-2 inline-block text-[9px] font-bold uppercase tracking-widest text-emerald-700">
                            Current Stage
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isPending && (
                <p className="mt-6 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                  Your order is awaiting confirmation.
                </p>
              )}

            </div>
          )}
        </section>

        {/* Products + Price Summary */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_0.8fr]">

          {/* Products */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">

            <div className="flex items-center justify-between border-b border-stone-100 pb-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                  Your Purchase
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Order Items
                </h2>
              </div>

              <span className="text-xs text-stone-500">
                {order.orderItems?.length || 0} items
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {order.orderItems?.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex gap-4 py-5 first:pt-5 last:pb-0"
                >
                  <img
                    src={
                      item.images?.[0]?.url ||
                      "/placeholder-image.jpg"
                    }
                    alt={item.title}
                    className="h-24 w-20 rounded-lg bg-stone-100 object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h3 className="text-sm font-semibold text-stone-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-stone-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-3 text-sm font-semibold">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Price Summary */}
          <div className="h-fit rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">

            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-400">
              Payment Summary
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Order Total
            </h2>

            <div className="mt-7 flex items-center justify-between border-b border-stone-100 pb-4">
              <span className="text-xs text-stone-500">
                Total Products
              </span>

              <span className="text-xs font-semibold">
                {order.orderItems?.reduce(
                  (total, item) => total + Number(item.quantity || 0),
                  0
                ) || 0}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 py-4">
              <span className="text-xs text-stone-500">
                Payment Method
              </span>

              <span className="text-xs font-semibold">
                Razorpay
              </span>
            </div>

            <div className="flex items-center justify-between pt-5">
              <span className="text-sm font-semibold">
                Grand Total
              </span>

              <span className="text-xl font-bold tracking-tight">
                {formatPrice(order.price)}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-50 p-3">
              <CheckCircle2 size={15} className="text-emerald-700" />

              <span className="text-[10px] font-semibold text-emerald-800">
                {order.status === "paid"
                  ? "Payment verified successfully"
                  : `Payment ${order.status}`}
              </span>
            </div>

          </div>
        </section>

        {/* Delivery Address */}
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
              <MapPin size={18} />
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                Delivery Information
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Shipping Address
              </h2>
            </div>
          </div>

          <div className="mt-6 border-t border-stone-100 pt-5">
            <h3 className="text-sm font-semibold">
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
          </div>

        </section>

        {/* Support */}
        <section className="mt-6 flex flex-col gap-4 rounded-2xl bg-[#171717] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Headphones size={19} />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Need assistance?
              </h3>

              <p className="mt-1 text-xs text-stone-400">
                We're here to help with your order.
              </p>

              <p className="mt-3 text-xs font-semibold">
                care@snitch.co.in
              </p>
            </div>
          </div>

          <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500">
            SNITCH Customer Care
          </span>

        </section>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">

          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-700 transition hover:bg-white"
          >
            <Printer size={14} />
            Print Receipt
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/my-orders"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition hover:bg-white"
            >
              My Orders
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-stone-900 px-7 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-stone-700"
            >
              Continue Shopping
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-16 print:hidden">

            <div className="mb-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                Discover More
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Complete Your Look
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
              {recommendations.map((product) => (
                <button
                  key={product._id}
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                  className="group text-left"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-stone-200">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "/placeholder-image.jpg"
                      }
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-3 truncate text-xs font-semibold text-stone-900">
                    {product.title}
                  </h3>

                  <p className="mt-1 text-xs text-stone-600">
                    {formatPrice(product.price)}
                  </p>
                </button>
              ))}
            </div>

          </section>
        )}

      </main>
    </div>
  );
};

export default OrderSuccess;
