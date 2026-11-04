import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";
import {ShoppingBag,Heart,Truck,ShieldCheck,RotateCcw,Plus,Minus,ChevronRight,} from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate=useNavigate()

  const { handleGetProductById } = useProduct();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);

        const data = await handleGetProductById(productId);
        setProduct(data?.product ?? data);
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Product not found
      </div>
    );
  }

  const images = product.images || [];
  const price = product.price?.amount;
  const currency = product.price?.currency;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Breadcrumb */}
      <div 
      className="mx-auto max-w-6xl px-5 py-3 text-xs text-gray-400 cursor-pointer">
        <span className="hover:text-black transition duration-300" 
        onClick={()=>navigate('/')}>Home</span>
        <ChevronRight className="mx-1 inline" size={13} />
        Products
        <ChevronRight className="mx-1 inline" size={13} />
        <span className="text-black">{product.title}</span>
      </div>

      {/* Main Product */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 pb-8 md:grid-cols-2 md:items-start md:gap-10">
        {/* Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="group relative mx-auto h-[360px] w-full max-w-[320px] overflow-hidden rounded-2xl bg-[#efedea] sm:h-[420px] md:h-[460px]">
            {images[activeImage]?.url && (
              <img
                src={images[activeImage].url}
                alt={product.title}
                className="h-full w-full object-cover transition duration-500"
              />
            )}

            <button
              onClick={() => setWishlist(!wishlist)}
              className="absolute right-3 top-3 rounded-full bg-white p-2.5 shadow"
              aria-label="Add to wishlist"
            >
              <Heart
                size={18}
                className={
                  wishlist ? "fill-red-500 text-red-500" : "text-black"
                }
              />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="mt-3 flex justify-center gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image._id || index}
                onClick={() => setActiveImage(index)}
                className={`w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                  activeImage === index
                    ? "border-black"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image.url}
                  alt={`${product.title} ${index + 1}`}
                  className="aspect-[4/5] w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="md:sticky md:top-20 md:self-start md:max-w-[400px]">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400">
            SNITCH COLLECTION
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {product.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">
              {currency === "INR" ? "₹" : currency}
              {price}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Inclusive of all taxes
          </p>

          <div className="my-5 h-px bg-gray-200" />

          {/* Size */}
          <div>
            <div className="mb-3 flex justify-between">
              <h3 className="text-sm font-semibold">Select Size</h3>
              <button className="text-xs text-gray-500 underline">
                Size Guide
              </button>
            </div>

            <div className="flex gap-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-10 w-10 rounded-lg border text-xs transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold">Quantity</h3>

            <div className="flex w-fit items-center rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
                className="p-2.5"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>

              <span className="w-8 text-center text-sm">{quantity}</span>

              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="p-2.5"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Cart Buttons */}
          <button
            onClick={() =>
              console.log({
                productId: product._id,
                size: selectedSize,
                quantity,
              })
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <ShoppingBag size={17} />
            Add to Cart
          </button>

          <button className="mt-2 w-full rounded-full border border-black py-3 text-sm font-semibold transition hover:bg-black hover:text-white">
            Buy Now
          </button>

          {/* Benefits */}
          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-white p-3">
            <div className="flex flex-col items-center gap-1 text-center">
              <Truck size={19} className="text-gray-500" />
              <h4 className="text-[11px] font-semibold">Free Shipping</h4>
              <p className="text-[10px] text-gray-400">Eligible orders</p>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <ShieldCheck size={19} className="text-gray-500" />
              <h4 className="text-[11px] font-semibold">Secure Payment</h4>
              <p className="text-[10px] text-gray-400">Safe checkout</p>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <RotateCcw size={19} className="text-gray-500" />
              <h4 className="text-[11px] font-semibold">Easy Returns</h4>
              <p className="text-[10px] text-gray-400">Hassle-free</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description */}
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="border-t border-gray-200 pt-6">
          <p className="text-[10px] tracking-[0.3em] text-gray-400">
            PRODUCT INFORMATION
          </p>

          <h2 className="mt-2 text-xl font-bold">About this product</h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            {product.description}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-400">Product</p>
              <p className="mt-1 text-sm font-semibold">{product.title}</p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-400">Price</p>
              <p className="mt-1 text-sm font-semibold">
                {currency === "INR" ? "₹" : currency}
                {price}
              </p>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-xs text-gray-400">Gallery</p>
              <p className="mt-1 text-sm font-semibold">
                {images.length} Images
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
