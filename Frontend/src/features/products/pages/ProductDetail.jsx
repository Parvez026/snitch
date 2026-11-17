
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {ArrowLeft,ChevronLeft,ChevronRight,ShoppingBag,Truck,RotateCcw,ShieldCheck,Check} from "lucide-react";

import { useProduct } from "../hooks/useProduct.js";
import { useCart } from "../../cart/hooks/useCart.js";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [loading, setLoading] = useState(true);

  const { handleGetProductById } = useProduct();
  const { handleAddItem } = useCart();

  // Fetch product details
  async function fetchProductDetails() {
    try {
      setLoading(true);

      const data = await handleGetProductById(productId);
      setProduct(data?.product || data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  // Set first variant as selected by default
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedAttributes(product.variants[0].attributes || {});
    } else {
      setSelectedAttributes({});
    }
  }, [product]);

  // Find selected variant
  const activeVariant = useMemo(() => {
    if (!product?.variants?.length) return null;

    return product.variants.find((variant) => {
      if (!variant.attributes) return false;

      const variantKeys = Object.keys(variant.attributes);
      const selectedKeys = Object.keys(selectedAttributes);

      return (
        variantKeys.length === selectedKeys.length &&
        variantKeys.every(
          (key) => variant.attributes[key] === selectedAttributes[key]
        )
      );
    });
  }, [product, selectedAttributes]);

  // Get all available attributes
  const availableAttributes = useMemo(() => {
    if (!product?.variants) return {};

    const attributes = {};

    product.variants.forEach((variant) => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!attributes[key]) attributes[key] = new Set();
          attributes[key].add(value);
        });
      }
    });

    Object.keys(attributes).forEach((key) => {
      attributes[key] = Array.from(attributes[key]);
    });

    return attributes;
  }, [product]);

  // Reset image when variant changes
  useEffect(() => {
    setSelectedImage(0);
  }, [activeVariant]);

  // Handle attribute selection
  const handleAttributeChange = (attrName, value) => {
    const newAttributes = {
      ...selectedAttributes,
      [attrName]: value,
    };

    const exactMatch = product.variants.find((variant) => {
      const variantAttributes = variant.attributes || {};

      return (
        Object.keys(newAttributes).every(
          (key) => newAttributes[key] === variantAttributes[key]
        ) &&
        Object.keys(variantAttributes).every(
          (key) => newAttributes[key] === variantAttributes[key]
        )
      );
    });

    if (exactMatch) {
      setSelectedAttributes(exactMatch.attributes);
    } else {
      const fallbackVariant = product.variants.find(
        (variant) => variant.attributes?.[attrName] === value
      );

      if (fallbackVariant) {
        setSelectedAttributes(fallbackVariant.attributes);
      } else {
        setSelectedAttributes(newAttributes);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7f4]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#dedbd3] border-t-[#171717]" />
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400">
            Loading collection
          </p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7f4] px-5 text-center">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-gray-400">
          Product unavailable
        </p>

        <h2 className="mb-6 font-serif text-4xl text-[#171717]">
          We couldn't find this piece.
        </h2>

        <Link
          to="/"
          className="bg-[#171717] px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#b89a69]"
        >
          Back to collection
        </Link>
      </div>
    );
  }

  // Image fallback
  const displayImages =
    activeVariant?.images?.length > 0
      ? activeVariant.images
      : product.images?.length > 0
        ? product.images
        : [{ url: "/snitch_editorial_warm.png" }];

  const currentImage =
    displayImages[selectedImage]?.url || displayImages[0]?.url;

  // Price fallback
  const displayPrice = activeVariant?.price?.amount
    ? activeVariant.price
    : product.price;

  const formattedPrice = Number(displayPrice?.amount || 0).toLocaleString("en-IN");

  const isOutOfStock = activeVariant && activeVariant.stock !== undefined ? activeVariant.stock <= 0 : false;

  const changeImage = (direction) => {
    setSelectedImage((prev) => {
      if (direction === "next") {
        return prev === displayImages.length - 1 ? 0 : prev + 1;
      }

      return prev === 0 ? displayImages.length - 1 : prev - 1;
    });
  };

  const handleAddToCart = () => {
    if (!activeVariant || isOutOfStock) return;

    handleAddItem({
      productId: product._id,
      variantId: activeVariant._id,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-16 text-[#171717]">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1440px] px-5 pt-7 sm:px-8 lg:px-14">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400">
          <Link to="/" className="transition hover:text-black">
            Home
          </Link>

          <span>/</span>

          <span className="max-w-[180px] truncate text-[#171717]">
            {product.title}
          </span>
        </div>
      </div>

      {/* Main Product Section */}
      <main className="mx-auto max-w-[1440px] px-5 pb-10 pt-7 sm:px-8 lg:px-14 lg:pt-10">
        <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.75fr)] lg:gap-16 xl:gap-24">

          {/* LEFT: Product Gallery */}
          <section className="min-w-0">

            {/* Gallery */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[76px_minmax(0,1fr)] lg:gap-4">

              {/* Thumbnails */}
              {displayImages.length > 1 && (
                <div className="order-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide md:order-1 md:max-h-[760px] md:flex-col md:overflow-y-auto md:overflow-x-hidden">
                  {displayImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-[82px] w-[66px] flex-shrink-0 overflow-hidden bg-[#eeece7] transition-all duration-200 md:h-[100px] md:w-full ${
                        selectedImage === index
                          ? "ring-1 ring-[#171717] ring-offset-2 ring-offset-[#f8f7f4]"
                          : "opacity-65 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.title} view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="group relative order-1 aspect-[2/2.5] overflow-hidden bg-[#eeece7] md:order-2">

                <img
                  src={currentImage}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
                {/* Image Counter */}
                {displayImages.length > 1 && (
                  <div className="absolute top-4 right-4 bg-[#171717]/80 px-3 py-2 text-[9px] tracking-[0.15em] text-white backdrop-blur-sm">
                    {String(selectedImage + 1).padStart(2, "0")} /{" "}
                    {String(displayImages.length).padStart(2, "0")}
                  </div>
                )}

                {/* Navigation */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => changeImage("prev")}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/50 bg-[#f8f7f4]/85 opacity-100 backdrop-blur-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                    >
                      <ChevronLeft size={18} strokeWidth={1.5} />
                    </button>

                    <button
                      type="button"
                      onClick={() => changeImage("next")}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/50 bg-[#f8f7f4]/85 opacity-100 backdrop-blur-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                    >
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: Product Information */}
          <section className="min-w-0 lg:sticky lg:top-24">

            {/* Product Heading */}
            <div className="border-b border-[#e7e4dd] pb-6">
              <h1 className="max-w-xl font-semibold text-4xl font-normal leading-[1.08] tracking-[-0.025em] sm:text-5xl xl:text-[58px]">
                {product.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-xl font-medium tracking-tight">
                  {displayPrice?.currency || "INR"} {formattedPrice}
                </span>

                <span className="h-1 w-1 rounded-full bg-[#c9a96e]" />

                <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400">
                  Inclusive of applicable taxes
                </span>
              </div>
            </div>

            {/* Variant Selection */}
            {Object.entries(availableAttributes).length > 0 && (
              <div className="space-y-7 border-b border-[#e7e4dd] py-7">
                {Object.entries(availableAttributes).map(
                  ([attrName, values]) => (
                    <div key={attrName}>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                          Select {attrName}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {values.map((value) => {
                          const isSelected =
                            selectedAttributes[attrName] === value;

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                handleAttributeChange(attrName, value)
                              }
                              className={`flex min-h-10 min-w-12 items-center justify-center border px-4 text-[10px] font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                                isSelected
                                  ? "border-[#171717] bg-[#171717] text-white"
                                  : "border-[#dedbd3] bg-transparent text-[#555] hover:border-[#171717] hover:text-black"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Stock Status */}
            {activeVariant && activeVariant.stock !== undefined && (
              <div className="flex items-center gap-2 border-b border-[#e7e4dd] py-4">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeVariant.stock > 0 ? "bg-green-600" : "bg-red-500"
                  }`}
                />

                <p
                  className={`text-[10px] font-medium uppercase tracking-[0.15em] ${
                    activeVariant.stock > 0
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {activeVariant.stock > 0
                    ? `${activeVariant.stock} pieces available`
                    : "Currently unavailable"}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="py-4">
              <p className="max-w-lg text-[13px] leading-7 text-[#77736c]">
                {product.description || "Made to make a statement. Discover the details of this piece from the SNITCH collection."}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!activeVariant || isOutOfStock}
                className="group flex w-full items-center justify-center gap-3 bg-[#171717] px-6 py-[18px] text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#a58a5d] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <ShoppingBag size={16} strokeWidth={1.6} />

                {!activeVariant
                  ? "Select a variant"
                  : isOutOfStock
                    ? "Out of stock"
                    : "Add to bag"}
              </button>

              <Link
                to="/"
                className="flex w-full items-center justify-center gap-2 border border-[#dcd8cf] px-6 py-[17px] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#171717] transition-all duration-300 hover:border-[#171717]"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
                Continue shopping
              </Link>
            </div>

            {/* Service Information */}
            <div className="mt-8 border-y border-[#e7e4dd]">
              <div className="flex items-center gap-4 border-b border-[#e7e4dd] py-4">
                <Truck size={17} strokeWidth={1.3} className="text-[#a58a5d]" />

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    Reliable Delivery
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    Delivered to your doorstep
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-[#e7e4dd] py-4">
                <RotateCcw size={17} strokeWidth={1.3} className="text-[#a58a5d]" />

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    Easy Returns
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    Return policy as per store terms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <ShieldCheck size={17} strokeWidth={1.3} className="text-[#a58a5d]" />

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    Secure Shopping
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    Safe and secure checkout
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
