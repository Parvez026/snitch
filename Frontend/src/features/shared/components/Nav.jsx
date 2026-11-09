import React, { useState } from "react";
import {Search,ShoppingBag,UserRound,Menu,X,} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Nav = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const cartItems = useSelector((state) => state.cart);
console.log(cartItems);

  // Calculate total quantity of products
  const totalCartItems = cartItems?.items?.reduce((total, item) => total + item.quantity,0);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#101010] text-white">

      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 md:px-10">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-black tracking-[0.3em] md:text-3xl"
        >
          SNITCH
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 text-sm text-gray-300 md:flex">
          <Link to="/" className="text-white">
            Home
          </Link>

          <a href="#products" className="transition hover:text-white">
            Shop
          </a>

          <a href="#about" className="transition hover:text-white">
            About
          </a>

          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">

          <button aria-label="Search">
            <Search size={21} />
          </button>

          {/* Cart */}
          <button
            className="relative"
            aria-label="Shopping cart"
            onClick={() => navigate("/cart")}
          >
            <ShoppingBag size={21} />

            {totalCartItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
                {totalCartItems > 9 ? "9+" : totalCartItems}
              </span>
            )}
          </button>

          <button
            aria-label="User profile"
            className="hidden md:block"
          >
            <UserRound size={21} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col gap-4 border-t border-white/10 bg-[#101010] px-6 py-5 text-sm md:hidden">

          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>

          <a href="#products" onClick={() => setIsMenuOpen(false)}>
            Shop
          </a>

          <a href="#about" onClick={() => setIsMenuOpen(false)}>
            About
          </a>

          <a href="#contact" onClick={() => setIsMenuOpen(false)}>
            Contact
          </a>

        </div>
      )}

    </nav>
  );
};

export default Nav;
