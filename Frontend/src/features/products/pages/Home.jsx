
import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import {Search,ShoppingBag,Heart,ChevronLeft,ChevronRight} from "lucide-react";
import { useNavigate } from "react-router";

const categories = [
  "All",
  "Shirts",
  "T-Shirts",
  "Polo",
  "Oversized",
  "Formal",
  "Casual",
];

const ProductCard = ({ product, onAddToCart,navigate }) => {
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

      {/* Add To Cart */}
      {/* <button
        onClick={() => onAddToCart(product)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171717] py-3.5 text-xs font-medium tracking-wide text-white transition-all duration-300 hover:bg-[#333] active:scale-[0.98] md:text-sm"
      >
        <ShoppingBag size={16} />
        Add to Cart
      </button> */}
    </div>
  </div>
</article>
  );
};

const Home = () => {
  const { handleGetAllProducts } = useProduct();

  const products = useSelector(
    (state) => state.product.products
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate=useNavigate()

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const safeProducts = products || [];

  const filteredProducts = safeProducts
    .filter((product) => {
      const matchesSearch = product.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        product.title
          ?.toLowerCase()
          .includes(activeCategory.toLowerCase().replace("-", ""));

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "low") {
        return a.price.amount - b.price.amount;
      }

      if (sortBy === "high") {
        return b.price.amount - a.price.amount;
      }

      return 0;
    });

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    console.log("Added to cart:", product);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#171717]">

      {/* Hero Section */}

      {/* Products Section */}
      <section
        id="products"
        className="mx-auto max-w-[1500px] px-5 py-12 md:px-10 md:py-5"
      >

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.3em] text-gray-400">
              CURATED FOR YOU
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              All Products
              <span className="ml-3 text-sm font-normal text-gray-400">
                ({filteredProducts.length})
              </span>
            </h2>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-xs outline-none md:text-sm"
          >
            <option value="latest">Latest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-6 py-3 text-xs font-medium transition md:text-sm ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-[#efedeb] text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search your favourite style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-5">

            {filteredProducts.map((product) => (
              <ProductCard
                navigate={navigate}
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}

          </div>
        ) : (
          <div className="py-20 text-center">
            <ShoppingBag
              size={40}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="text-lg font-semibold">
              No products found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or category.
            </p>
          </div>
        )}
      </section>
   

    </div>
  );
};

export default Home;
