
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../hooks/useCart';
import { useNavigate, Link } from 'react-router';

// Currency formatter
const sym = {INR: '₹',USD: '$',EUR: '€',GBP: '£',};
const fmt = (amount, currency = 'INR') =>`${sym[currency] || currency + ' '}${Number(amount || 0).toLocaleString('en-IN')}`;

// Quantity Stepper
const QtyControl = ({ value, onDecrease, onIncrease, loading }) => (
  <div className="flex items-center gap-0 border border-[#e5ddd3] rounded-lg overflow-hidden">
    <button
      onClick={onDecrease}
      disabled={loading}
      className="w-9 h-9 flex items-center justify-center text-[#171717] hover:bg-[#f2efec] disabled:opacity-30 transition-colors text-lg font-light"
      aria-label="Decrease quantity"
    >
      −
    </button>

    <span className="w-10 h-9 flex items-center justify-center text-sm font-medium text-[#171717] select-none border-x border-[#e5ddd3]">
      {loading ? (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#171717]/30 border-t-[#171717] animate-spin block" />
      ) : (value)}
    </span>

    <button
      onClick={onIncrease}
      disabled={loading}
      className="w-9 h-9 flex items-center justify-center text-[#171717] hover:bg-[#f2efec] disabled:opacity-30 transition-colors text-lg font-light"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

// Single Cart Item
const CartItem = ({ item, onRemove, onIncrement, onDecrement }) => {
  const [qtyLoading, setQtyLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const product = item.product || {};
  const productId = product._id;
  const variantId = item.variant;

  const variant = Array.isArray(product.variants) ? product.variants.find((v) => String(v._id) === String(variantId))
    : String(product.variants?._id) === String(variantId)
    ? product.variants
    : null;

  const images =variant?.images?.length > 0? variant.images: product.images?.length > 0? product.images : [];
  const thumbnail = images[0]?.url;

  // Price
  const currency = item.price?.currency || 'INR';
  const linePrice =(item.price?.amount || 0) * (item.quantity || 0);

  // Variant attributes
  const variantAttrs = variant?.attributes? Object.entries(variant.attributes):[];

  // Decrease quantity
  const handleDecrease = async () => {
    setQtyLoading(true);
    try {
      if (item.quantity === 1) {
        await onRemove({ productId, variantId });
      } else {
        await onDecrement({ productId,variantId,currentQty: item.quantity});
      }
    } catch (error) {
      console.error('Decrease quantity failed:', error);
    } finally {
      setQtyLoading(false);
    }
  };

  // Increase quantity
  const handleIncrease = async () => {
    setQtyLoading(true);
    try {
      await onIncrement({ productId, variantId });
    } catch (error) {
      console.error('Increase quantity failed:', error);
    } finally {
      setQtyLoading(false);
    }
  };

  // Remove item
  const handleRemove = async () => {
    setRemoveLoading(true);
    try {
      await onRemove({ productId, variantId });
    } catch (error) {
      console.error('Remove item failed:', error);
    } finally {
      setRemoveLoading(false);
    }
  };


  return (
    <div className="group flex gap-4 sm:gap-6 py-6 border-b border-[#e5ddd3] last:border-b-0 items-start">

      {/* Product Image */}
      <Link
        to={`/product/${productId}`}
        className="relative flex-shrink-0 w-24 h-28 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-[#f2efec] block"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={product.title || 'Product'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#B5ADA3]">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {images.length > 1 && (
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[9px] font-semibold text-white">
            +{images.length - 1}
          </span>
        )}
      </Link>


      {/* Product Information */}
      <div className="flex flex-col flex-1 min-w-0 gap-2">

        {/* Title and Total Price */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/product/${productId}`}
              className="text-sm sm:text-base font-semibold text-[#171717] hover:text-[#555] transition-colors leading-snug line-clamp-1"
            >
              {product.title || 'Unnamed Product'}
            </Link>

            <p className="text-xs text-[#82776d] mt-0.5 line-clamp-1">
              {product.description || ''}
            </p>
          </div>

          <span className="font-syne font-bold text-sm sm:text-base text-[#171717] whitespace-nowrap flex-shrink-0">
            {fmt(linePrice, currency)}
          </span>
        </div>


        {/* Unit Price */}
        <p className="text-xs text-[#B5ADA3]">
          {fmt(item.price?.amount, currency)} each
        </p>


        {/* Variant Attributes and Stock */}
        {(variantAttrs.length > 0 || variant?.stock !== undefined) && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">

            {variantAttrs.map(([key, value]) => (
              <span
                key={key}
                className="px-2.5 py-0.5 rounded-full bg-[#f2efec] border border-[#e5ddd3] text-[10px] font-medium text-[#82776d] uppercase tracking-wide"
              >
                {key}: {value}
              </span>
            ))}

            {variant?.stock !== undefined && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${
                  variant.stock > 0
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                {variant.stock > 0
                  ? `${variant.stock} left`
                  : 'Out of stock'}
              </span>
            )}

          </div>
        )}


        {/* Quantity and Remove */}
        <div className="flex items-center justify-between gap-3 mt-2">

          <QtyControl
            value={item.quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
            loading={qtyLoading}
          />

          <button
            onClick={handleRemove}
            disabled={removeLoading}
            className="flex items-center gap-1.5 text-xs text-[#B5ADA3] hover:text-red-500 transition-colors disabled:opacity-40"
            aria-label="Remove item"
          >
            {removeLoading ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-red-300 border-t-red-500 animate-spin block" />
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}

            Remove
          </button>

        </div>
      </div>
    </div>
  );
};

// Order Summary
const OrderSummary = ({ items, onCheckout,cartData }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');


  // Calculate subtotal
  const subtotal = cartData?.totalPrice || 0;

  const currency = items[0]?.price?.currency || 'INR';

  const shipping = subtotal > 1500 ? 0 : 99;

  const discount = promoApplied? Math.round(subtotal * 0.1): 0;

  const total = subtotal - discount + shipping;


  // Apply promo code
  const handlePromo = () => {
    if (promoCode.trim().toUpperCase() === 'SNITCH10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code.');
      setPromoApplied(false);
    }
  };


  const rows = [
    {
      label: 'Subtotal',
      value: fmt(subtotal, currency),
    },
    ...(discount > 0
      ? [
          {
            label: 'Discount (10%)',
            value: `-${fmt(discount, currency)}`,
            green: true,
          },
        ]
      : []),
    {
      label: `Shipping${shipping === 0 ? ' — Free' : ''}`,
      value: shipping === 0 ? 'Free' : fmt(shipping, currency),
    },
  ];


  return (
    <div className="rounded-2xl border border-[#e5ddd3] bg-[#fbf9f6] p-6 sm:p-7 flex flex-col gap-5 sticky top-28">

      <h2 className="font-syne text-lg font-extrabold text-[#171717] tracking-tight">
        Order Summary
      </h2>


      {/* Price Rows */}
      <div className="flex flex-col gap-3">
        {rows.map(({ label, value, green }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-[#82776d]">{label}</span>

            <span
              className={`font-medium ${
                green ? 'text-emerald-600' : 'text-[#171717]'
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>


      {/* Promo Code */}
      <div className="pt-1">
        <label className="block text-[10px] uppercase tracking-widest font-bold text-[#B5ADA3] mb-2">
          Promo Code
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
              setPromoError('');
              setPromoApplied(false);
            }}
            placeholder="e.g. SNITCH10"
            className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#e5ddd3] text-sm text-[#171717] placeholder:text-[#c9bdb4] outline-none focus:border-[#171717] transition-colors"
          />

          <button
            onClick={handlePromo}
            className="h-10 px-4 rounded-xl bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#333] transition-colors active:scale-[0.98]"
          >
            Apply
          </button>
        </div>

        {promoApplied && (
          <p className="text-[11px] text-emerald-600 font-medium mt-1.5">
            Code applied — 10% off!
          </p>
        )}

        {promoError && (
          <p className="text-[11px] text-red-500 mt-1.5">
            {promoError}
          </p>
        )}
      </div>


      {/* Total */}
      <div className="border-t border-[#e5ddd3] pt-4 flex justify-between items-center">
        <span className="font-syne font-extrabold text-base text-[#171717]">
          Total
        </span>

        <span className="font-syne font-extrabold text-xl text-[#171717]">
          {fmt(total, currency)}
        </span>
      </div>


      {/* Free Shipping Progress */}
      {shipping > 0 && (
        <div className="text-[11px] text-[#B5ADA3]">
          Add{' '}
          <span className="font-semibold text-[#171717]">
            {fmt(1500 - subtotal, currency)}
          </span>{' '}
          more for free shipping.

          <div className="mt-2 h-1.5 rounded-full bg-[#e5ddd3] overflow-hidden">
            <div
              className="h-full bg-[#171717] rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((subtotal / 1500) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}


      {/* Checkout */}
      <button
        onClick={onCheckout}
        className="w-full h-14 rounded-xl bg-[#171717] text-white font-syne font-extrabold text-sm uppercase tracking-wider hover:bg-[#333] active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2.5"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>

        Secure Checkout
      </button>


      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-5 pt-1">
        {[
          {
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            label: 'Secure',
          },
          {
            icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
            label: 'Pay Safe',
          },
          {
            icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z',
            label: 'Returns',
          },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 text-[10px] text-[#B5ADA3] font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={icon}
              />
            </svg>

            {label}
          </div>
        ))}
      </div>

    </div>
  );
};

// Empty Cart
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-28 px-6 text-center max-w-sm mx-auto">

    <div className="w-20 h-20 rounded-full bg-[#f2efec] border border-[#e5ddd3] flex items-center justify-center mb-6">
      <svg
        className="w-9 h-9 text-[#c9bdb4]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    </div>

    <h2 className="font-syne text-2xl font-extrabold text-[#171717] tracking-tight mb-2">
      Your Bag is Empty
    </h2>

    <p className="text-sm text-[#82776d] leading-relaxed mb-8">
      Looks like you haven&apos;t added any pieces yet. Explore our curated menswear collection.
    </p>

    <Link
      to="/"
      className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-[#171717] text-white font-syne font-bold text-xs uppercase tracking-wider hover:bg-[#333] transition-all duration-200 active:scale-[0.98] shadow-sm"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16l-4-4m0 0l4-4m-4 4h18"
        />
      </svg>

      Continue Shopping
    </Link>

  </div>
);

// Main Cart Page
const Cart = () => {

  const cartData = useSelector((state) => state.cart);
  const {handleGetCart,handleRemoveItem,handleIncrementCartItem,handleDecrementCartItem} = useCart();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Extract actual products from API response
 const items = cartData?.items || [];


// Get total price and currency from Redux
const totalPrice = cartData?.totalPrice || 0;
const currency = cartData?.currency || "INR";

console.log("cartData:", cartData);
console.log("items:", items);
console.log("totalPrice:", totalPrice);
  
  // Fetch cart when component mounts
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await handleGetCart();
      } catch (err) {
        console.error('Failed to load cart:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);


  // Total quantity of all products
const totalItems = items.reduce((acc, item) => acc + (item.quantity || 0),0);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#171717]">

      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-10 sm:py-14">

        {/* Page Header */}
        <div className="mb-8 sm:mb-10 flex items-center justify-between gap-4">

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gray-400 mb-1.5">
              MY BAG
            </p>

            <h1 className="font-syne text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
              Shopping Cart

              {!loading && items.length > 0 && (
                <span className="ml-3 text-sm font-normal text-gray-400">
                  ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
              )}
            </h1>
          </div>


          {/* Continue Shopping */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#82776d] hover:text-[#171717] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Continue Shopping
          </Link>

        </div>

        {/* Loading Skeleton */}
        {loading ? (

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

            <div className="space-y-6">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="flex gap-5 py-6 border-b border-[#e5ddd3] animate-pulse"
                >
                  <div className="w-24 h-28 sm:w-28 sm:h-36 rounded-xl bg-[#eae6e1] flex-shrink-0" />

                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-4 bg-[#eae6e1] rounded w-1/2" />
                    <div className="h-3 bg-[#eae6e1] rounded w-3/4" />
                    <div className="h-3 bg-[#eae6e1] rounded w-1/4" />
                    <div className="h-9 bg-[#eae6e1] rounded-lg w-28 mt-4" />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#e5ddd3] bg-[#fbf9f6] p-6 h-80 animate-pulse" />

          </div>

        ) : items.length === 0 ? (

          <EmptyCart />

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16 items-start">
            {/* Left: Cart Items */}
            <div>
              {/* Items Header */}
              <div className="hidden sm:grid grid-cols-[1fr_auto] pb-3 border-b border-[#e5ddd3] text-[10px] uppercase tracking-[0.2em] font-semibold text-[#B5ADA3]">
                <span>Product</span>
                <span>Total</span>
              </div>

              {/* Items List */}
              <div>
                {items.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onIncrement={handleIncrementCartItem}
                    onDecrement={handleDecrementCartItem}
                  />
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#e5ddd3]">

                <div className="flex flex-wrap gap-4 text-[11px] text-[#B5ADA3]">

                  {[
                    {
                      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                      text: '100% Authentic',
                    },
                    {
                      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
                      text: 'Free Returns in 14 Days',
                    },
                    {
                      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
                      text: 'Pan-India Delivery',
                    },
                  ].map(({ icon, text }) => (
                    <span
                      key={text}
                      className="flex items-center gap-1.5"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-[#c9bdb4]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={icon}
                        />
                      </svg>

                      {text}
                    </span>
                  ))}

                </div>
              </div>

            </div>

            {/* Right: Order Summary */}
            <OrderSummary
              items={items}
              cartData={cartData}
              onCheckout={() => navigate('/checkout')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
