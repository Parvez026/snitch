import React from 'react'
import {Search,ShoppingBag,UserRound,Heart,ChevronLeft,ChevronRight,ArrowUpRight,Star,Menu,X,} from "lucide-react";


const Nav = ({cartCount,setMenuOpen,menuOpen}) => {
  return (
     <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#101010] text-white">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 md:px-10">

          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-black tracking-[0.3em] md:text-3xl"
          >
            SNITCH
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-9 text-sm text-gray-300 md:flex">
            <a href="/" className="text-white">
              Home
            </a>
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

            <button
              className="relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={21} />

              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
                {cartCount}
              </span>
            </button>

            <button aria-label="User profile" className="hidden md:block">
              <UserRound size={21} />
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-white/10 bg-[#101010] px-6 py-5 text-sm md:hidden">
            <a href="/">Home</a>
            <a href="#products" onClick={() => setMenuOpen(false)}>
              Shop
            </a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        )}
      </nav>
  )
}

export default Nav