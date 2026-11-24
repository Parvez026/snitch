
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ArrowRight, MoveRight } from "lucide-react";

import { useProduct } from "../hooks/useProduct";
import ProductCard from "../components/ProductCard.jsx";
import useWishlist from "../../wishlist/hooks/useWishlist.js";

const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const { handleGetWishlist } = useWishlist();

  const products = useSelector((state) => state.product.products);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // Fetch products and wishlist
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          handleGetAllProducts(),
          handleGetWishlist(),
        ]);
      } catch (error) {
        console.error("Home page fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];

  // Latest products
  const latestProducts = useMemo(() => {
    return [...safeProducts]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )
      .slice(0, 8);
  }, [safeProducts]);

  // More products for the second section
  const featuredProducts = useMemo(() => {
    return [...safeProducts]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )
      .slice(8, 12);
  }, [safeProducts]);

  return (
    <main className="min-h-screen bg-[#F5F1E9] text-[#352D25]">

      {/* HERO SECTION */}
      <section className="relative mx-auto h-[280px] overflow-hidden sm:h-[340px] md:h-[400px]">

      {/* Hero Image */}
      <img
        src="/home.jpg"
        alt="Premium men's fashion collection"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-[#F1E5D2]/45 via-[#F1E5D2]/35 to-transparent md:via-[#F1E5D2]/20" /> */}

      {/* Hero Content */}
   <div className="relative z-10 mx-auto flex h-full max-w-[1500px] items-center px-6 sm:px-10 md:px-16">
    <div className="max-w-xl">
      <h1 className="font-serif text-4xl leading-[1.08] tracking-tight text-[#382E25] sm:text-5xl md:text-6xl">
        Style that
        <br />
        speaks <span className="italic text-[#8A765F]">naturally.</span>
      </h1>

      <button
        onClick={() => navigate("/shop")}
        className="mt-6 inline-flex items-center gap-4 rounded-full bg-[#554638] px-7 py-3 text-xs font-semibold tracking-widest text-white transition hover:bg-[#3E3228]"
      >
        SHOP COLLECTION
        <ArrowRight size={16} />
      </button>
      </div>
    </div>
    </section>

      {/* NEW ARRIVALS */}
      <section
        id="new-arrivals"
        className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 md:px-12 md:py-5"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-[#382E25] sm:text-4xl">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="group hidden items-center gap-2 rounded-full border border-[#CFC2AF] px-5 py-2.5 text-xs font-medium text-[#554638] transition hover:bg-[#554638] hover:text-white sm:flex"
          >
            View All
            <MoveRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-[#E7DED1]" />
                <div className="mt-3 h-3 w-3/4 rounded bg-[#E7DED1]" />
                <div className="mt-2 h-3 w-1/3 rounded bg-[#E7DED1]" />
              </div>
            ))}
          </div>
        ) : latestProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-5 xl:grid-cols-5">
            {latestProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-[#8A7D6E]">
            No products available yet.
          </p>
        )}

        <button
          onClick={() => navigate("/shop")}
          className="mt-9 flex w-full items-center justify-center gap-2 rounded-full border border-[#CFC2AF] py-3 text-xs font-semibold tracking-widest text-[#554638] transition hover:bg-[#554638] hover:text-white sm:hidden"
        >
          VIEW ALL PRODUCTS
          <ArrowRight size={15} />
        </button>
      </section>

      {/* FEATURED COLLECTION */}
      {!loading && featuredProducts.length > 0 && (
        <section className="bg-[#EAE2D6]">
          <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 md:px-12 md:py-20">

            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-2 text-[10px] font-semibold tracking-[0.25em] text-[#9A8264]">
                  THE EVERYDAY EDIT
                </p>

                <h2 className="font-serif text-3xl tracking-tight text-[#382E25] sm:text-4xl">
                  More to Explore
                </h2>

                <p className="mt-2 text-sm text-[#8A7D6E]">
                  Pieces worth making room for.
                </p>
              </div>

              <button
                onClick={() => navigate("/shop")}
                className="group hidden items-center gap-2 text-xs font-medium text-[#554638] sm:flex"
              >
                Explore All
                <MoveRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  navigate={navigate}
                />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* BOTTOM CTA */}
      <section className="px-5 py-16 text-center sm:py-20">
        <p className="mb-3 text-[10px] font-semibold tracking-[0.3em] text-[#9A8264]">
          FIND YOUR EVERYDAY STYLE
        </p>

        <h2 className="font-serif text-3xl text-[#382E25] sm:text-4xl">
          Less ordinary. More you.
        </h2>

        <button
          onClick={() => navigate("/shop")}
          className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#554638] px-7 py-3.5 text-xs font-semibold tracking-widest text-white transition hover:bg-[#3E3228]"
        >
          EXPLORE SHOP
          <ArrowRight size={16} />
        </button>
      </section>

    </main>
  );
};

export default Home;
