// components/site-header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { TimeStateControl } from "@/components/time-state-control";
import { UserMenu } from "@/components/user-menu";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "Collection" },
  { href: "/materials", label: "Materials" },
  { href: "/production", label: "Process" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-limestone/35 bg-off-white/95 text-charcoal shadow-[0_1px_0_rgba(32,32,29,0.02)] backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2" aria-label="ArcVane Studio home">
          <span className="h-2 w-2 rounded-full bg-warm-amber transition-transform group-hover:scale-110" />
          <span className="text-lg font-semibold tracking-tight text-charcoal">ArcVane Studio</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal/70 transition-colors hover:text-deep-brown focus:outline-none focus-visible:text-deep-brown focus-visible:ring-2 focus-visible:ring-warm-amber/35 focus-visible:ring-offset-4 focus-visible:ring-offset-off-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: time state + user menu + selection + mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <TimeStateControl />

          <div className="hidden sm:block">
            <UserMenu />
          </div>

          {/* Selection button */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center justify-center rounded-full border border-limestone/45 bg-shell/60 p-2 text-charcoal/70 transition-colors hover:border-warm-amber/35 hover:text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-amber/35 focus-visible:ring-offset-2 focus-visible:ring-offset-off-white"
            aria-label={`Selection${itemCount > 0 ? `, ${itemCount} items` : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-warm-amber px-1 text-[10px] font-bold text-charcoal">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="flex items-center justify-center rounded-full border border-limestone/45 bg-shell/60 p-2 text-charcoal/70 transition-colors hover:border-warm-amber/35 hover:text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-amber/35 focus-visible:ring-offset-2 focus-visible:ring-offset-off-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-limestone/35 bg-off-white transition-all duration-200 ease-in-out md:hidden",
          mobileOpen ? "max-h-96 border-t" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal/75 transition-colors hover:bg-sand/20 hover:text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-amber/35"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-limestone/35 pt-3 sm:hidden">
            <UserMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}
