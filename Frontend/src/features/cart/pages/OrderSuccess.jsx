import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../../products/hooks/useProduct';

/* ─── Currency Formatter ─────────────────────────────────────────────────── */
const sym = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const fmt = (amount, currency = 'INR') =>
  `${sym[currency] || currency + ' '}${Number(amount || 0).toLocaleString('en-IN')}`;

/* ─── Helper: Format Estimated Delivery Date Range ───────────────────────── */
const getDeliveryRange = () => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date();
  end.setDate(end.getDate() + 5);
  return `${start.toLocaleDateString('en-IN', options)} — ${end.toLocaleDateString('en-IN', options)}`;
};

/* ─── Main OrderSuccess Page ─────────────────────────────────────────────── */
const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const orderId = queryParams.get('order_id') || 'SN-' + Math.floor(100000 + Math.random() * 900000);

  const user = useSelector((state) => state.auth?.user);
  const allProducts = useSelector((state) => state.product?.products) || [];
  const { handleGetAllProducts } = useProduct();

  const [copied, setCopied] = useState(false);
  const deliveryRange = useMemo(() => getDeliveryRange(), []);

  // Fetch recommended pieces for the bottom lookbook section
  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const recommendations = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];
    return allProducts.slice(0, 4);
  }, [allProducts]);

  const handleCopyId = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717] antialiased selection:bg-[#171717] selection:text-white print:bg-white print:text-black">
      {/* ── Top Context Breadcrumb ────────────────────────────────────── */}
      <div className="border-b border-[#e5ddd3] bg-white/70 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between text-xs text-[#82776d]">
          <div className="flex items-center gap-2 tracking-wider uppercase text-[10px] font-semibold">
            <Link to="/" className="hover:text-[#171717] transition-colors">Snitch</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-[#171717] transition-colors">Bag</Link>
            <span>/</span>
            <span className="text-[#171717]">Order Receipt</span>
          </div>
        </div>
      </div>

      {/* ── Main Confirmation Body ───────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        {/* Hero Confirmation Card */}
        <div className="relative rounded-3xl border border-[#e5ddd3] bg-white p-6 sm:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Subtle Ambient Top Accent Glow */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-stone-200 via-stone-900 to-stone-200" />

          {/* Status Badge & Icon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#e5ddd3]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#171717] text-white flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-emerald-700 block mb-0.5">
                  Order Successfully Verified
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
                  Thank You for Your Order
                </h1>
              </div>
            </div>

            {/* Quick Actions (Print Receipt) */}
            <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
              <button
                onClick={handlePrint}
                className="h-10 px-4 rounded-xl border border-[#e5ddd3] hover:border-[#171717] bg-[#fbf9f6] hover:bg-white text-xs font-semibold uppercase tracking-wider text-[#171717] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Print or Save PDF Receipt"
              >
                <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Receipt</span>
              </button>
            </div>
          </div>

          {/* Order Meta Strip */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 rounded-2xl bg-[#fbf9f6] border border-[#e5ddd3]">
            {/* Reference */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#82776d] font-bold block mb-1">
                Order Reference
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-semibold text-[#171717] break-all">
                  {orderId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1 text-stone-400 hover:text-stone-700 transition cursor-pointer print:hidden"
                  title="Copy reference ID"
                >
                  {copied ? (
                    <span className="text-[10px] text-emerald-600 font-sans font-bold">Copied!</span>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#82776d] font-bold block mb-1">
                Estimated Delivery
              </span>
              <span className=" text-xs sm:text-sm font-bold text-[#171717]">
                {deliveryRange}
              </span>
            </div>

            {/* Payment Mode */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#82776d] font-bold block mb-1">
                Payment Method
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#171717] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Prepaid • Razorpay Verified
              </span>
            </div>
          </div>

          {/* Delivery Milestone Tracker */}
          <div className="mt-10 pt-8 border-t border-[#e5ddd3]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#82776d]">
                Dispatch Protocol &amp; Milestone Tracking
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold hidden sm:inline">
                Live Studio Progress
              </span>
            </div>

            {/* Timeline Steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-2 relative">
              {[
                {
                  step: '01',
                  label: 'Payment Approved',
                  sub: 'Razorpay Instant Settlement',
                  active: true,
                  done: true,
                },
                {
                  step: '02',
                  label: 'Atelier Curation',
                  sub: 'Garment Inspection & Steam',
                  active: true,
                  done: false,
                },
                {
                  step: '03',
                  label: 'Courier Handover',
                  sub: 'Air Express Dispatch',
                  active: false,
                  done: false,
                },
                {
                  step: '04',
                  label: 'Doorstep Delivery',
                  sub: 'Signed Receipt Required',
                  active: false,
                  done: false,
                },
              ].map(({ step, label, sub, active, done }, idx) => (
                <div
                  key={step}
                  className={`p-4 rounded-2xl border transition-all ${
                    done
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : active
                      ? 'bg-[#fbf9f6] border-stone-400 text-stone-900'
                      : 'bg-white border-[#e5ddd3] text-stone-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] tracking-widest font-bold">
                      {step}
                    </span>
                    {done ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : active ? (
                      <span className="w-2 h-2 rounded-full bg-stone-900 animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                    )}
                  </div>
                  <h4 className=" font-bold text-xs leading-snug">
                    {label}
                  </h4>
                  <p className={`text-[10px] mt-1 line-clamp-1 ${done ? 'text-stone-300' : 'text-stone-400'}`}>
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dossier & Logistics Breakdown */}
          <div className="mt-10 pt-8 border-t border-[#e5ddd3] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Recipient Details */}
            <div className="p-5 rounded-2xl bg-[#fbf9f6] border border-[#e5ddd3]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#82776d] block mb-3">
                Client &amp; Destination Dossier
              </span>
              <div className="space-y-1.5 text-stone-700">
                <p className="font-semibold text-stone-900 text-sm">
                  {user?.fullName || 'Valued Snitch Member'}
                </p>
                <p>{user?.email || 'Registered account email'}</p>
                {user?.contact && <p className="font-mono text-[11px]">{user.contact}</p>}
                <p className="text-stone-500 pt-1 border-t border-stone-200 mt-2 text-[11px]">
                  Shipping: Complimentary Express Courier (Pan-India Insured)
                </p>
              </div>
            </div>

            {/* Protection & Support */}
            <div className="p-5 rounded-2xl bg-[#fbf9f6] border border-[#e5ddd3] flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#82776d] block mb-3">
                  Atelier Client Care
                </span>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Need modifications to this delivery or have sizing concerns? Our concierge is available 24/7 for VIP members.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 mt-3 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-stone-900">care@snitch.co.in</span>
                <span className="text-stone-400">14-Day Free Exchange</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-10 pt-8 border-t border-[#e5ddd3] flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              to="/"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Continue Shopping</span>
            </Link>

            <div className="flex items-center gap-4 text-xs text-[#82776d]">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                100% Genuine Atelier Craft
              </span>
              <span>•</span>
              <span>Insured Transit</span>
            </div>
          </div>
        </div>

        {/* ── Recommendations: Curated Pieces For You ─────────────────── */}
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
                const img = prod.images?.[0]?.url || '/placeholder-image.jpg';
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
                    <h4 className=" font-bold text-sm text-[#171717] line-clamp-1 group-hover:text-stone-600 transition-colors">
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
