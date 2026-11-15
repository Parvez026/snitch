
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../hooks/useCart";

const formatPrice = (price) => {
  const amount = price?.amount ?? price ?? 0;
  const currency = price?.currency || "INR";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { handleGetMyOrders } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await handleGetMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("My Orders Error:", err);
        setError(
          err.response?.data?.message || "Unable to fetch your orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <p className="text-sm text-stone-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] px-5 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="mt-2 text-3xl font-bold text-stone-900">
              My Orders
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              View and track all your purchases.
            </p>
          </div>

          <Link
            to="/"
            className="text-xs font-semibold text-stone-700 underline underline-offset-4"
          >
            Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error && orders.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-stone-900">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Your purchases will appear here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">
                      Order ID
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-stone-700">
                      {order.razorpay?.orderId}
                    </p>
                    <p className="mt-2 text-xs text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase text-emerald-700">
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400">
                      Items
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-900">
                      {order.orderItems?.length || 0} products
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400">
                      Total Amount
                    </p>
                    <p className="mt-1 text-sm font-bold text-stone-900">
                      {formatPrice(order.price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400">
                      Seller Orders
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-900">
                      {order.sellerOrders?.length || 0}
                    </p>
                  </div>
                </div>

                {order.sellerOrders?.length > 0 && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {order.sellerOrders.map((sellerOrder, index) => (
                      <span
                        key={sellerOrder._id || index}
                        className="rounded-lg bg-stone-100 px-3 py-2 text-[10px] font-semibold capitalize text-stone-700"
                      >
                        Seller {index + 1}: {sellerOrder.orderStatus}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-end border-t border-stone-100 pt-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/order-success?order_id=${encodeURIComponent(
                          order.razorpay?.orderId
                        )}`
                      )
                    }
                    className="rounded-xl bg-stone-900 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-stone-700"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
