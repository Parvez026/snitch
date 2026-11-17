
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

const ProductCard = ({ product, navigate }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images = Array.isArray(product?.images)
    ? product.images.filter((image) => image?.url)
    : [];

  const openProduct = () => {
    if (product?._id) {
      navigate(`/product/${product._id}`);
    }
  };

  const changeImage = (direction) => {
    if (images.length <= 1) return;

    setActiveImage(
      (prev) => (prev + direction + images.length) % images.length
    );
  };

  const formatPrice = () => {
    const amount = Number(product?.price?.amount);

    if (!Number.isFinite(amount)) return "Price unavailable";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: product?.price?.currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <article className="group min-w-0">

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl bg-[#f0efec]">

        <button
          type="button"
          onClick={openProduct}
          className="block aspect-[3/4] w-full overflow-hidden"
          aria-label={`View ${product?.title || "product"}`}
        >
          {images.length > 0 ? (
            <img
              src={images[activeImage]?.url}
              alt={product?.title || "Product"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs tracking-widest text-gray-400">
              NO IMAGE
            </div>
          )}
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => setIsWishlisted((prev) => !prev)}
          aria-label="Toggle wishlist"
          aria-pressed={isWishlisted}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-110"
        >
          <Heart
            size={17}
            strokeWidth={1.7}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-[#222]"
            }
          />
        </button>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => changeImage(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-sm transition group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => changeImage(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-sm transition group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((image, index) => (
              <button
                key={image._id || index}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Select image ${index + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeImage === index
                    ? "w-5 bg-white"
                    : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="px-0.5 pt-3 flex items-center justify-between ">
          <button
            type="button"
            onClick={openProduct}
            className="min-w-0 text-left"
          >
            <h3 className="line-clamp-2 text-[13px] font-medium leading-5 text-[#222] transition-colors group-hover:text-gray-500 sm:text-sm">
              {product?.title || "Untitled Product"}
            </h3>
          </button>
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#171717] sm:text-[15px]">
            {formatPrice()}
          </p>
        </div>

      </div>
    </article>
  );
};

export default ProductCard;
