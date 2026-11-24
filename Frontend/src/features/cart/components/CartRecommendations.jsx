
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useProduct } from "../../products/hooks/useProduct";
import ProductCard from "../../products/components/ProductCard";

const CartRecommendations = ({ cartItems = [] }) => {
  const navigate = useNavigate();

  const products = useSelector((state) => state.product.products || []);

  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    if (products.length === 0) {
      handleGetAllProducts().catch((error) => {
        console.error("Recommendation fetch failed:", error);
      });
    }
  }, []);

  const recommendedProducts = useMemo(() => {
    const cartProductIds = cartItems.map((item) =>
      String(item.product?._id)
    );

    return products
      .filter(
        (product) => !cartProductIds.includes(String(product._id))
      )
      .slice(0, 4);
  }, [products, cartItems]);

  if (recommendedProducts.length === 0) return null;

  return (
    <section className=" border-t border-[#e5ddd3] px-10">
      <div className="mb-7 container">
        <h2 className="mt-2 text-2xl font-bold text-[#171717]">
          You May Also Like
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5">
        {recommendedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            navigate={navigate}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/shop")}
          className="border-b border-[#171717] pb-1 text-xs font-semibold uppercase tracking-widest text-[#171717]"
        >
          Explore All Products
        </button>
      </div>
    </section>
  );
};

export default CartRecommendations;
