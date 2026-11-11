
import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hooks/useAuth.js";

const Nav = () => {
  const cartItems = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  

  const { handleLogout } = useAuth();

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Calculate total quantity
  const totalCartItems = cartItems?.items?.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Logout handler
  const handleUserLogout = async () => {
    try {
      await handleLogout();

      setIsProfileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

          <Link to="/about" className="transition hover:text-white">
            About
          </Link>

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

          {/* User Profile Popup */}
          <div className="relative">

            <button
              aria-label="User profile"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-1 transition hover:text-gray-300"
            >
              <UserRound size={21} />
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 z-[60] w-64 overflow-hidden rounded-xl border border-[#e5ddd3] bg-[#faf9f7] text-[#171717] shadow-2xl">

                {user ? (
                  <>
                    {/* Logged In */}
                    <div className="border-b border-[#e5ddd3] px-5 py-4">
                      <p className="text-xs text-[#82776d]">
                        Welcome back
                      </p>

                      <h3 className="mt-1 truncate text-sm font-bold">
                        {user.fullName || user.name || user.email || "User"}
                      </h3>

                      {user.email && (
                        <p className="mt-1 truncate text-xs text-[#82776d]">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <div className="p-2 border-b border-[#e5ddd3]">
                      <button 
                      onClick={() =>(navigate("/order-success"),
                         setIsProfileOpen((prev) => !prev))
                        }
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-black transition hover:bg-gray-200/60"
                      >Track Order</button>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={handleUserLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Logged Out */}
                    <div className="px-5 py-4">
                      <h3 className="text-sm font-bold">
                        Welcome to SNITCH
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#82776d]">
                        Login to explore your account and shop your
                        favourite styles.
                      </p>
                    </div>

                    <div className="border-t border-[#e5ddd3] p-3">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/login");
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#82776d]"
                      >
                        <LogIn size={17} />
                        Login / Sign Up
                      </button>
                    </div>
                  </>
                )}

              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
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

          <Link to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>

          <a href="#contact" onClick={() => setIsMenuOpen(false)}>
            Contact
          </a>

        </div>
      )}

    </nav>
  );
};

export default Nav;
