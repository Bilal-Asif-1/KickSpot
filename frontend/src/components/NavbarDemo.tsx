"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { ShoppingCart, User } from "lucide-react";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  
  // Mock data for now
  const isAuthenticated = false;
  const user = null;
  const cartItems = 0;

  return (
    <div
      className={cn("fixed top-8 inset-x-0 max-w-6xl mx-auto z-50 px-4", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm p-6">
            <HoveredLink href="/shipping">Free Shipping</HoveredLink>
            <HoveredLink href="/returns">Easy Returns</HoveredLink>
            <HoveredLink href="/support">Customer Support</HoveredLink>
            <HoveredLink href="/warranty">Product Warranty</HoveredLink>
            <HoveredLink href="/tracking">Order Tracking</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Products">
          <div className="text-sm grid grid-cols-2 gap-8 p-6">
            <ProductItem
              title="Latest Products"
              href="/products"
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=160&h=80&fit=crop&crop=center"
              description="Browse our newest product additions and trending items."
            />
            <ProductItem
              title="Featured Collection"
              href="/products?featured=true"
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=160&h=80&fit=crop&crop=center"
              description="Handpicked premium products curated by our team."
            />
            <ProductItem
              title="Best Sellers"
              href="/products?sort=bestselling"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&h=80&fit=crop&crop=center"
              description="Most popular items loved by thousands of customers."
            />
            <ProductItem
              title="Sale Items"
              href="/products?sale=true"
              src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=160&h=80&fit=crop&crop=center"
              description="Amazing deals and discounts on selected products."
            />
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm p-6">
            <HoveredLink href="/pricing">View All Plans</HoveredLink>
            <HoveredLink href="/pricing/basic">Basic Plan</HoveredLink>
            <HoveredLink href="/pricing/premium">Premium Plan</HoveredLink>
            <HoveredLink href="/pricing/enterprise">Enterprise</HoveredLink>
            <HoveredLink href="/pricing/compare">Compare Plans</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
