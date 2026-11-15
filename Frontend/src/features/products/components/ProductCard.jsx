import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import React, { useState } from 'react'


const ProductCard = ({ product,navigate }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images = product.images || [];

  const changeImage = (direction) => {
    if (!images.length) return;

    setActiveImage((prev) =>
      (prev + direction + images.length) % images.length
    );
  };

  return (
 <article className="group h-full">
  <div className="overflow-hidden rounded-2xl border border-[#e5ddd3] bg-[#fbf9f6] p-2.5 transition-all duration-300 hover:border-[#c9b8a5]">

    {/* Image Section */}
    <div className="relative overflow-hidden rounded-xl bg-[#f2efec]">

      {/* Main Image */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="aspect-[3/3.5] cursor-pointer overflow-hidden"
      >
        {images[activeImage]?.url ? (
          <img
            src={images[activeImage].url}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      {/* Image Count */}
      {images.length > 1 && (
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-[11px] text-white backdrop-blur">
          {activeImage + 1} / {images.length}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        aria-label="Add to wishlist"
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110"
      >
        <Heart
          size={18}
          className={
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-[#171717]"
          }
        />
      </button>

      {/* Image Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => changeImage(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-all hover:bg-white group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => changeImage(1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-all hover:bg-white group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image._id || index}
              onClick={() => setActiveImage(index)}
              aria-label={`View image ${index + 1}`}
              className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all ${
                activeImage === index
                  ? "scale-105 border-white shadow-md"
                  : "border-white/60 opacity-75 hover:opacity-100"
              }`}
            >
              <img
                src={image.url}
                alt={`${product.title} view ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Product Details — inside the same card */}
    <div className="px-2 pt-2">
      {/* Title and Price */}
      <div className="flex flex-col gap-2">
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="cursor-pointer text-sm font-medium leading-5 text-[#171717] hover:text-gray-500 md:text-base"
        >
          {product.title}
        </h3>

        <p className="shrink-0 text-sm font-semibold text-[#171717] md:text-base">
          {product.price?.currency === "INR" ? "₹" : ""}
          {product.price?.amount?.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  </div>
</article>
  );
};

export default ProductCard