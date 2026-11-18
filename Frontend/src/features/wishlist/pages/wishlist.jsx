
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useWishlist from "../hooks/useWishlist";
import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router";

const Wishlist = () => {
  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems
  );
 const nevigate=useNavigate()

  const { handleGetWishlist,handleRemoveFromWishlist } = useWishlist();

  useEffect(() => {
    handleGetWishlist();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-5 py-10 sm:px-10">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Your Collection
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#171717]">
            My Wishlist
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {wishlistItems.length} saved items
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <Heart size={42} strokeWidth={1.2} />
            <h2 className="mt-5 text-xl font-medium">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Save your favourite products here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {wishlistItems.map((product) => (
              <div
               onClick={() => nevigate(`/product/${product._id}`)}
               key={product._id}>
               <div className="relative">
                 <img
                  src={product.images?.[0]?.url}
                  alt={product.title}
                  className="relative aspect-[3/4] w-full rounded-lg object-cover"
                />
                  <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFromWishlist(product._id)}}
                  className="absolute top-3 right-3 rounded-full border border-gray-200 py-2 px-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                 >
                 <X size={16} />
                </button>
               </div>

                <div className="flex items-center justify-between gap-2 mt-3">
                    <h3 className="text-sm font-medium">
                  {product.title}
                </h3>

                <p className="text-sm font-semibold">
                  ₹{product.price?.amount}
                </p>
                </div>
              
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default Wishlist;
