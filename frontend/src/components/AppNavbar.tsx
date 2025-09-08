import React from "react";
import { Menu, HoveredLink } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores";

interface NavItem {
  label: string;
  href: string;
}

export function AppNavbar({ className }: { className?: string }) {
  const { isAuthenticated } = useAuth();

  const navItems: NavItem[] = isAuthenticated
    ? [
        { label: "Products", href: "/products" },
        { label: "Orders", href: "/orders" },
        { label: "Cart", href: "/cart" },
      ]
    : [
        { label: "Products", href: "/products" },
        { label: "Login", href: "/login" },
        { label: "Cart", href: "/cart" },
      ];

  return (
    <div className={cn("fixed top-8 inset-x-0 z-50 px-4", className)}>
      <Menu setActive={() => {}}>
        {navItems.map((item) => (
          <HoveredLink
            key={item.href}
            href={item.href}
            className="text-gray-900 dark:text-white text-lg md:text-2xl font-medium"
          >
            {item.label}
          </HoveredLink>
        ))}
      </Menu>
    </div>
  );
}

