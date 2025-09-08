import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ShoppingBag, 
  User, 
  LogIn, 
  Menu, 
  X,
  ShoppingCart
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock data for now
  const isAuthenticated = false;
  const totalItems = 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < 50 || currentScrollY < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setMobileMenuOpen(false);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-4 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
          >
            ShopFlow
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link-${idx}`}
              to={navItem.link}
              className={cn(
                "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors",
                location.pathname === navItem.link && "text-blue-500 dark:text-blue-400"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="text-sm">{navItem.name}</span>
            </Link>
          ))}

          {/* Cart Icon with Badge */}
          <Link
            to="/cart"
            className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/dashboard"
                className="dark:text-neutral-50 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors"
              >
                <User className="h-4 w-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm dark:text-neutral-50 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden dark:text-neutral-50 text-neutral-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 inset-x-4 bg-black/95 backdrop-blur-md border border-white/[0.2] rounded-2xl z-[4999] p-4 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((navItem: any, idx: number) => (
                <Link
                  key={`mobile-link-${idx}`}
                  to={navItem.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors dark:text-neutral-50 text-neutral-600 dark:hover:bg-neutral-800 hover:bg-neutral-100",
                    location.pathname === navItem.link && "bg-blue-500/10 text-blue-500"
                  )}
                >
                  {navItem.icon}
                  <span>{navItem.name}</span>
                </Link>
              ))}

              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-lg transition-colors dark:text-neutral-50 text-neutral-600 dark:hover:bg-neutral-800 hover:bg-neutral-100"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors dark:text-neutral-50 text-neutral-600 dark:hover:bg-neutral-800 hover:bg-neutral-100"
                  >
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors text-left dark:text-neutral-50 text-neutral-600 dark:hover:bg-neutral-800 hover:bg-neutral-100"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg transition-colors dark:text-neutral-50 text-neutral-600 dark:hover:bg-neutral-800 hover:bg-neutral-100"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
