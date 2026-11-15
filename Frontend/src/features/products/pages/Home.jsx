
import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import {Search,ShoppingBag,Heart,ChevronLeft,ChevronRight} from "lucide-react";
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

  const products = useSelector(
    (state) => state.product.products
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

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
