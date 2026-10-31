import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { useProduct } from '../hooks/useProduct';

/* ─── Currency Symbol Formatter ────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price || typeof price.amount === 'undefined') return '—';
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const sym = symbols[price.currency] || `${price.currency} `;
  const formattedAmount = Number(price.amount).toLocaleString('en-IN');
  return `${sym}${formattedAmount}`;
};

/* ─── Copy to Clipboard Helper ────────────────────────────────────────── */
const copyText = (text, setCopied) => {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
};

/* ─── Product Card with Multi-Image Preview ────────────────────────────── */
const ProductCard = ({ product, onQuickView }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : [{ url: '/placeholder-image.jpg', _id: 'default' }];

  const currentImage = images[activeImgIndex]?.url || images[0]?.url;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-stone-300 transition-all duration-300 cursor-pointer"
    >
      {/* ── Top Media Area ── */}
      <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden select-none">
        <img
          src={currentImage}
          alt={product.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle Top & Bottom Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-70 pointer-events-none" />

        {/* Image Badge Count */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-stone-800 tracking-wider shadow-sm">
          <svg className="w-3 h-3 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{images.length} {images.length === 1 ? 'Shot' : 'Shots'}</span>
        </div>

        {/* Currency Pill Top-Right */}
        <div className="absolute top-3.5 right-3.5 z-10 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-md text-[10px] font-bold text-white tracking-widest uppercase">
          {product.price?.currency || 'INR'}
        </div>

        {/* In-Card Image Navigation Arrows (if multiple images) */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Image"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-900 flex items-center justify-center shadow-md backdrop-blur transition-transform active:scale-90"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Image"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-900 flex items-center justify-center shadow-md backdrop-blur transition-transform active:scale-90"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Thumbnail Dots Bar at Bottom of Image */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 z-10 flex items-center justify-center gap-1.5 px-4 pointer-events-none">
            {images.slice(0, 7).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeImgIndex ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom Content Card ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-syne font-bold text-base sm:text-lg text-stone-900 leading-snug line-clamp-1 group-hover:text-stone-700 transition">
              {product.title || 'Untitled Design'}
            </h3>
            <span className="font-syne font-extrabold text-base sm:text-lg text-stone-950 whitespace-nowrap">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description || 'No design notes provided.'}
          </p>
        </div>

        {/* Footer Meta Strip */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
          {/* Product ID Copy */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              copyText(product._id, setCopied);
            }}
            className="group/id flex items-center gap-1 hover:text-stone-700 transition text-[11px] font-mono"
            title="Click to copy MongoDB Product ID"
          >
            <span className="text-stone-300">#</span>
            <span>{product._id ? product._id.slice(-6) : 'N/A'}</span>
            <svg className="w-3 h-3 text-stone-300 group-hover/id:text-stone-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied && (
              <span className="text-[10px] text-emerald-600 font-sans font-medium">Copied!</span>
            )}
          </button>

          {/* Quick Inspect Trigger */}
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 group-hover:underline underline-offset-2">
            Inspect
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Detailed Table/List View Row ─────────────────────────────────────── */
const ProductTableRow = ({ product, onQuickView }) => {
  const [copied, setCopied] = useState(false);
  const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : [];
  const thumbnail = images[0]?.url || '/placeholder-image.jpg';

  return (
    <tr
      onClick={() => onQuickView(product)}
      className="group border-b border-stone-100 hover:bg-stone-50/70 transition-colors cursor-pointer"
    >
      <td className="py-4 pl-4 sm:pl-6 pr-3">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-14 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
            <img src={thumbnail} alt={product.title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-stone-900/80 text-[8px] font-bold text-white">
                +{images.length - 1}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-syne font-bold text-sm text-stone-900 group-hover:text-stone-700 transition">
              {product.title || 'Untitled'}
            </h4>
            <p className="text-xs text-stone-400 line-clamp-1 max-w-xs sm:max-w-md">
              {product.description || 'No description'}
            </p>
          </div>
        </div>
      </td>

      <td className="py-4 px-3 whitespace-nowrap">
        <span className="font-syne font-bold text-sm text-stone-900">
          {formatPrice(product.price)}
        </span>
      </td>

      <td className="py-4 px-3 hidden md:table-cell whitespace-nowrap">
        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </span>
      </td>

      <td className="py-4 px-3 hidden lg:table-cell whitespace-nowrap">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            copyText(product._id, setCopied);
          }}
          className="font-mono text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1"
        >
          <span>{product._id ? product._id.slice(0, 10) + '...' : '—'}</span>
          <svg className="w-3 h-3 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied && <span className="text-[10px] text-emerald-600 font-sans">Copied</span>}
        </button>
      </td>

      <td className="py-4 pr-4 sm:pr-6 pl-3 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white transition"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

/* ─── Full Luxury Quick-View Modal / Inspector ─────────────────────────── */
const QuickViewModal = ({ product, onClose }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
  const currentImg = images[selectedImg]?.url || '/placeholder-image.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAFAF8] rounded-3xl border border-stone-200/80 shadow-2xl overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Preview"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md backdrop-blur transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side: Editorial Image Gallery */}
        <div className="w-full lg:w-1/2 p-5 sm:p-6 flex flex-col justify-between bg-stone-100/70 border-b lg:border-b-0 lg:border-r border-stone-200">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200/60 shadow-inner">
            <img
              src={currentImg}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-white">
              Photo {selectedImg + 1} of {images.length}
            </div>
          </div>

          {/* Thumbnail Strip (all images) */}
          {images.length > 1 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={img._id || idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`relative w-14 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    idx === selectedImg
                      ? 'border-stone-900 ring-2 ring-stone-900/10 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Specs */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700">
                Snitch Atelier
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                ID: {product._id?.slice(-8)}
              </span>
            </div>

            <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-stone-900">
              {product.title}
            </h2>

            {/* Price tag */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-syne text-3xl font-bold text-stone-950">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                ({product.price?.currency || 'INR'})
              </span>
            </div>

            {/* Description */}
            <div className="mt-6 pt-5 border-t border-stone-200">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-2">
                Description &amp; Fit Details
              </span>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {product.description || 'No detailed description provided for this collection piece.'}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="mt-6 pt-5 border-t border-stone-200 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white border border-stone-200">
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                  Catalog Status
                </span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active / Live
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200">
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                  Total Visual Assets
                </span>
                <span className="font-semibold text-stone-800">
                  {images.length} High-Res Shots
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 col-span-2">
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                  Seller Mongo ID
                </span>
                <div className="flex items-center justify-between font-mono text-[11px] text-stone-600">
                  <span className="truncate pr-2">{product.seller || 'N/A'}</span>
                  <button
                    onClick={() => copyText(product.seller, setCopiedId)}
                    className="hover:text-stone-900 transition flex-shrink-0"
                  >
                    {copiedId ? (
                      <span className="text-emerald-600 font-sans font-medium text-[10px]">Copied</span>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-5 border-t border-stone-200 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-syne font-bold text-xs uppercase tracking-wider transition shadow-sm active:scale-[0.99]"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Dashboard Component ─────────────────────────────────────────── */
const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const rawProducts = useSelector((state) => state.product.sellerProduct);
  const user = useSelector((state) => state.auth?.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-asc, price-desc, title-asc
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [inspectingProduct, setInspectingProduct] = useState(null);

  // Safely extract products array from whatever structure is stored
  const products = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (rawProducts?.sellProducts && Array.isArray(rawProducts.sellProducts)) return rawProducts.sellProducts;
    if (rawProducts?.products && Array.isArray(rawProducts.products)) return rawProducts.products;
    return [];
  }, [rawProducts]);

  // Load products on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        await handleGetSellerProduct();
      } catch (err) {
        console.error('Failed to load seller catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p._id?.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    } else if (sortBy === 'title-asc') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [products, searchQuery, sortBy]);

  // Metrics summary calculations
  const metrics = useMemo(() => {
    const totalCount = products.length;
    const totalValuation = products.reduce((acc, p) => acc + (Number(p.price?.amount) || 0), 0);
    const avgValuation = totalCount > 0 ? Math.round(totalValuation / totalCount) : 0;
    const totalPhotos = products.reduce((acc, p) => acc + (p.images?.length || 0), 0);
    const currency = products[0]?.price?.currency || 'INR';

    return {
      totalCount,
      totalValuation,
      avgValuation,
      totalPhotos,
      currency,
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-stone-900 antialiased selection:bg-stone-900 selection:text-white">
      {/* ── Top Atelier Navigation Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Studio Tag */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="font-syne text-2xl sm:text-3xl font-extrabold tracking-[0.28em] text-stone-950 group-hover:text-stone-700 transition">
                SNITCH
              </span>
            </Link>
            <span className="h-4 w-px bg-stone-300 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-stone-200/80 text-stone-700 border border-stone-300">
                Seller Atelier
              </span>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Refresh Catalog Button */}
            <button
              onClick={() => handleGetSellerProduct()}
              title="Refresh Catalog"
              className="p-2.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white text-stone-600 hover:text-stone-900 transition shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Create Product Button */}
            <button
              onClick={() => navigate('/seller/create-product')}
              className="flex items-center gap-2 h-11 px-4 sm:px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-syne font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Content ──────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-stone-200">
          <div>
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-stone-400 block mb-1">
              Merchandise Management
            </span>
            <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              Seller Catalog
            </h1>
            <p className="text-sm text-stone-500 mt-1.5 max-w-xl">
              Showcase, audit, and inspect your luxury menswear drops and wardrobe items listed on Snitch.
            </p>
          </div>

          {/* Quick Status Tag */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-stone-200 shadow-sm self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <span className="font-semibold text-stone-800 block leading-tight">Live Storefront</span>
              <span className="text-[10px] text-stone-400">
                {products.length} {products.length === 1 ? 'Design' : 'Designs'} Published
              </span>
            </div>
          </div>
        </div>

        {/* ── Top Metric Cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
          {/* Stat 1: Total Products */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
              Total Pieces
            </span>
            <div className="font-syne text-2xl sm:text-3xl font-extrabold text-stone-900">
              {metrics.totalCount}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              Active in collection
            </span>
          </div>

          {/* Stat 2: Total Catalog Value */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
              Catalog Value
            </span>
            <div className="font-syne text-2xl sm:text-3xl font-extrabold text-stone-900">
              {formatPrice({ amount: metrics.totalValuation, currency: metrics.currency })}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              Cumulative retail price
            </span>
          </div>

          {/* Stat 3: Avg Price per Piece */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
              Avg. Ticket
            </span>
            <div className="font-syne text-2xl sm:text-3xl font-extrabold text-stone-900">
              {formatPrice({ amount: metrics.avgValuation, currency: metrics.currency })}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              Average item valuation
            </span>
          </div>

          {/* Stat 4: Total Photos */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
              Editorial Media
            </span>
            <div className="font-syne text-2xl sm:text-3xl font-extrabold text-stone-900">
              {metrics.totalPhotos}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              High-resolution assets
            </span>
          </div>
        </div>

        {/* ── Toolbar: Search, Sort & View Mode ─────────────────────── */}
        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-2 rounded-2xl bg-white border border-stone-200 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or ID..."
              className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:ring-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 outline-none hover:border-stone-300 transition cursor-pointer"
            >
              <option value="newest">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Title: A to Z</option>
            </select>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid Lookbook View"
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Table Inventory View"
                className={`p-2 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Products Display Area ─────────────────────────────────── */}
        <div className="mt-8">
          {loading ? (
            /* Loading Skeletons */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-2xl bg-white border border-stone-200 p-4 animate-pulse">
                  <div className="aspect-[4/5] bg-stone-100 rounded-xl mb-4" />
                  <div className="h-4 bg-stone-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-stone-100 rounded w-full mb-3" />
                  <div className="h-4 bg-stone-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="py-20 px-6 rounded-3xl bg-white border border-stone-200 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              {searchQuery ? (
                <>
                  <h3 className="font-syne font-bold text-lg text-stone-900">
                    No results for &ldquo;{searchQuery}&rdquo;
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Try checking for typos or clear your search query to see all listed items.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 transition"
                  >
                    Clear Filter
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-syne font-bold text-lg text-stone-900">
                    No Products in Catalog
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    You haven&apos;t published any menswear items yet. Start by creating your first product with lookbook images and pricing.
                  </p>
                  <button
                    onClick={() => navigate('/seller/create-product')}
                    className="mt-6 px-6 h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-syne font-bold text-xs uppercase tracking-wider transition shadow-sm"
                  >
                    + Create Your First Design
                  </button>
                </>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setInspectingProduct(p)}
                />
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/80 border-b border-stone-200 text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                      <th className="py-3.5 pl-4 sm:pl-6 pr-3">Product</th>
                      <th className="py-3.5 px-3">Price</th>
                      <th className="py-3.5 px-3 hidden md:table-cell">Gallery</th>
                      <th className="py-3.5 px-3 hidden lg:table-cell">Product ID</th>
                      <th className="py-3.5 pr-4 sm:pr-6 pl-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <ProductTableRow
                        key={product._id}
                        product={product}
                        onQuickView={(p) => setInspectingProduct(p)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Quick View Modal ────────────────────────────────────────── */}
      {inspectingProduct && (
        <QuickViewModal
          product={inspectingProduct}
          onClose={() => setInspectingProduct(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
