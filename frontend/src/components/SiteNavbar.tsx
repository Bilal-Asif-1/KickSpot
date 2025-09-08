import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/stores";

type NavbarProps = {
  className?: string;
};

const navLinks = [
  { label: "Products", to: "/products" },
  { label: "Login", to: "/login" },
];

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = totalItems > 99 ? "99+" : totalItems?.toString() ?? "0";

  return (
    <header className={cn("w-full bg-black text-white sticky top-0 z-50", className)}>
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main Navigation"
      >
        {/* Left: Logo / Brand */}
        <Link to="/" className="flex items-center gap-2" aria-label="Home">
          <span className="text-2xl font-bold leading-none">
            <span className="text-blue-500">Shop</span>
            <span className="text-white">Now</span>
          </span>
        </Link>

        {/* Center: Links (desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-blue-400" : "text-white/90 hover:text-blue-400"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right: Cart + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:text-blue-400 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex min-w-[1.1rem] h-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:text-blue-400 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "w-full rounded-md px-2 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-blue-400" : "text-white/90 hover:text-blue-400"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

