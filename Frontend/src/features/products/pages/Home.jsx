
import React, { useEffect, useMemo, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import {Search,ShoppingBag,SlidersHorizontal,X,ChevronDown,RotateCcw,ArrowUpDown} from "lucide-react";
import { useNavigate } from "react-router";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  "All",
  "Shirts",
  "T-Shirts",
  "Polo",
  "Oversized",
  "Formal",
  "Casual",
];

const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  const products = useSelector((state) => state.product.products);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        await handleGetAllProducts();
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];

  const getProductPrice = (product) =>
    Number(product.price?.amount ?? 0);

  const filteredProducts = useMemo(() => {
    let result = [...safeProducts];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      result = result.filter((product) => {
        const title = product.title?.toLowerCase() || "";
        const description = product.description?.toLowerCase() || "";

        return title.includes(query) || description.includes(query);
      });
    }

    // Category
    if (activeCategory !== "All") {
      const selected = activeCategory.toLowerCase().replace(/[-\s]/g, "");

      result = result.filter((product) => {
        const category = (
          product.category ||
          product.categoryName ||
          ""
        )
          .toLowerCase()
          .replace(/[-\s]/g, "");

        const title = (product.title || "")
          .toLowerCase()
          .replace(/[-\s]/g, "");

        return category === selected || title.includes(selected);
      });
    }

    // Maximum price
    if (maxPrice !== "") {
      result = result.filter(
        (product) => getProductPrice(product) <= Number(maxPrice)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "low") {
        return getProductPrice(a) - getProductPrice(b);
      }

      if (sortBy === "high") {
        return getProductPrice(b) - getProductPrice(a);
      }

      if (sortBy === "latest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      return 0;
    });

    return result;
  }, [safeProducts, searchQuery, activeCategory, maxPrice, sortBy]);

  const activeFilterCount =
    (activeCategory !== "All" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (sortBy !== "latest" ? 1 : 0);

  const hasActiveFilters =
    activeCategory !== "All" || maxPrice !== "" || searchQuery !== "";

  const clearFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setSortBy("latest");
    setMaxPrice("");
  };

  const handleAddToCart = (product) => {
    if (product?._id) {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
      <section
        id="products"
        className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 md:px-12 md:py-16"
      >
        {/* Heading */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-medium tracking-[0.3em] text-[#a18e6d]">
              DISCOVER YOUR STYLE
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              All Products
              <span className="ml-3 align-middle text-sm font-normal text-gray-400">
                ({filteredProducts.length})
              </span>
            </h2>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-5 flex gap-3">
          <div className="group flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#e9e5de] bg-white px-4 transition-all duration-300 focus-within:border-[#a18e6d] focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <Search
              size={17}
              strokeWidth={1.7}
              className="shrink-0 text-gray-400 transition-colors group-focus-within:text-[#a18e6d]"
            />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name..."
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="shrink-0 text-gray-400 transition hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`relative flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-medium transition-all duration-300 sm:px-6 ${
              showFilters
                ? "border-[#171717] bg-[#171717] text-white shadow-lg shadow-black/10"
                : "border-[#e9e5de] bg-white text-[#171717] hover:border-[#171717]"
            }`}
          >
            <SlidersHorizontal size={16} strokeWidth={1.7} />
            <span className="hidden sm:inline">Filters</span>

            {activeFilterCount > 0 && (
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${
                  showFilters
                    ? "bg-white text-black"
                    : "bg-[#171717] text-white"
                }`}
              >
                {activeFilterCount}
              </span>
            )}

            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filter Panel */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${showFilters
              ? "mb-5 grid-rows-[1fr] opacity-100"
              : "mb-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-xl border border-[#e9e5de] bg-white p-4 shadow-sm sm:p-5">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.15em] text-[#171717]">
          REFINE PRODUCTS
        </p>

        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-[10px] text-gray-400 transition hover:text-black"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="mb-5">
        <p className="mb-2.5 text-[9px] font-semibold tracking-[0.18em] text-gray-400">
          CATEGORY
        </p>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-[10px] transition-all duration-200 ${
                activeCategory === category
                  ? "border-[#171717] bg-[#171717] text-white"
                  : "border-[#eae7e1] bg-[#faf9f6] text-gray-600 hover:border-black hover:text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price + Sort */}
      <div className="grid grid-cols-1 gap-3 border-t border-[#f0ede8] pt-4 sm:grid-cols-2">

        {/* Price */}
        <div>
          <p className="mb-2 text-[9px] font-semibold tracking-[0.18em] text-gray-400">
            MAXIMUM PRICE
          </p>

          <div className="flex h-10 items-center rounded-lg border border-[#e9e5de] bg-[#faf9f6] px-3 transition focus-within:border-black">
            <span className="mr-2 text-xs text-gray-400">₹</span>

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Enter price"
              className="h-full w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
            />

            {maxPrice && (
              <button
                type="button"
                onClick={() => setMaxPrice("")}
                className="text-gray-400 hover:text-black"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Sort */}
        <div>
          <p className="mb-2 text-[9px] font-semibold tracking-[0.18em] text-gray-400">
            SORT BY
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#e9e5de] bg-[#faf9f6] px-3 text-xs text-gray-700 outline-none transition focus:border-black"
          >
            <option value="latest">Latest Arrivals</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[#f0ede8] pt-3">

        <button
          type="button"
          onClick={() => setShowFilters(false)}
          className="rounded-lg bg-[#171717] px-5 py-2 text-[9px] font-semibold tracking-widest text-white transition hover:bg-[#383838]"
        >
          APPLY
        </button>
      </div>

    </div>
  </div>
</div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-semibold tracking-widest text-gray-400">
              ACTIVE:
            </span>

            {activeCategory !== "All" && (
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="flex items-center gap-2 rounded-full border border-[#e9e5de] bg-white px-3 py-2 text-[10px] text-gray-600 transition hover:border-black hover:text-black"
              >
                {activeCategory}
                <X size={12} />
              </button>
            )}

            {maxPrice !== "" && (
              <button
                type="button"
                onClick={() => setMaxPrice("")}
                className="flex items-center gap-2 rounded-full border border-[#e9e5de] bg-white px-3 py-2 text-[10px] text-gray-600 transition hover:border-black hover:text-black"
              >
                Under ₹{maxPrice}
                <X size={12} />
              </button>
            )}

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="flex max-w-[200px] items-center gap-2 rounded-full border border-[#e9e5de] bg-white px-3 py-2 text-[10px] text-gray-600 transition hover:border-black hover:text-black"
              >
                <span className="truncate">{searchQuery}</span>
                <X size={12} className="shrink-0" />
              </button>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="px-2 text-[10px] font-medium text-[#a18e6d] transition hover:text-black"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-[#e9e6e0]" />
                <div className="mt-3 h-3 w-3/4 rounded bg-[#e9e6e0]" />
                <div className="mt-2 h-3 w-1/3 rounded bg-[#e9e6e0]" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                navigate={navigate}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <ShoppingBag size={35} className="mb-4 text-gray-300" />

            <h3 className="text-lg font-semibold">No products found</h3>

            <p className="mt-2 text-xs text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-[#171717] px-6 py-3 text-[10px] font-semibold tracking-widest text-white transition hover:bg-[#3a3a3a]"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
