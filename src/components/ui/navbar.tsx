"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  Zap,
  Heart,
  ChevronDown,
  LogOut,
  ShoppingBag,
  Package,
  Settings,
  X,
  LayoutGrid,
  LayoutDashboard,
  MessageCircle,
  Store,
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/data/categories";

const QUICK_LINKS = [
  { label: "New Drops", href: "/shop?sort=newest", color: "text-yellow-500" },
  { label: "Deals", href: "/shop?sale=true", color: "text-red-600" },
  { label: "Flash Sale", href: "/shop?flash=true", color: "text-orange-500" },
  { label: "Brands", href: "/shop?view=brands", color: "text-indigo-600" },
];

const TICKER_ITEMS = [
  "🚀 Free shipping on orders over KSh 3,000 within Nairobi",
  "⚡ Limited tech drop 04 — grab yours now",
  "🔥 Flash deals updated every 6 hours",
  "📦 Same-day delivery available in select Nairobi zones",
];

export function Navbar() {
  const router = useRouter();
  const { openCart, items } = useCartStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const megaRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
  const isAdmin = (session?.user as any)?.role === "admin";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setIsMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full">

      {/* ── LAYER 1: ANNOUNCEMENT TICKER ── */}
      <div className="bg-indigo-950 overflow-hidden py-2 border-b-2 border-indigo-800">
        <div className="flex gap-0 animate-marquee whitespace-nowrap">
          {[0, 1].map((pass) => (
            <span key={pass} className="inline-flex shrink-0">
              {TICKER_ITEMS.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-4 px-8 text-[10px] font-black uppercase tracking-[0.25em] text-white"
                >
                  {item}
                  <span className="text-yellow-300 font-black text-xs">•</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── LAYER 2: LOGO BAR ── */}
      <div className="bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center gap-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-2">
            <div className="bg-indigo-950 p-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:shadow-none group-hover:translate-x-[3px] group-hover:translate-y-[3px]">
              <Zap className="h-5 w-5 text-yellow-300 fill-current" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-black tracking-tighter text-slate-900 uppercase italic">
                Jijenge
              </span>
              <span className="text-[9px] font-black tracking-[0.22em] text-indigo-600 uppercase">
                Swiftsoko
              </span>
            </div>
          </Link>

          {/* SEARCH — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl relative mx-auto"
          >
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-none border-2 border-black h-11 font-bold text-sm placeholder:text-gray-400 placeholder:font-bold placeholder:uppercase placeholder:text-xs focus-visible:ring-0 focus-visible:border-indigo-600 pr-14"
              placeholder="Search products, brands & categories..."
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-0 h-11 w-12 bg-indigo-950 border-l-2 border-black flex items-center justify-center hover:bg-indigo-800 transition-colors"
            >
              <Search className="h-4 w-4 text-white stroke-[3px]" />
            </button>
          </form>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">

            {/* Mobile search toggle */}
            <button
              aria-label="Toggle search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-yellow-300 transition-colors"
            >
              {isSearchOpen
                ? <X className="h-4 w-4 stroke-[3px]" />
                : <Search className="h-4 w-4 stroke-[3px]" />
              }
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:flex w-10 h-10 items-center justify-center border-2 border-black hover:bg-yellow-300 group transition-colors"
            >
              <Heart className="h-4 w-4 stroke-[3px] group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label="Cart"
              className="flex items-center gap-1.5 h-10 px-3 border-2 border-black bg-yellow-300 font-black uppercase text-xs tracking-widest hover:bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all"
            >
              <ShoppingCart className="h-4 w-4 stroke-[3px]" />
              <span className="min-w-[1ch] text-center">
                {cartCount > 0 ? cartCount : "0"}
              </span>
            </button>

            {/* ── USER: LOGGED IN ── */}
            {session ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-2 h-10 px-3 border-2 border-black bg-indigo-950 text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-800 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75">
                    <div className="w-6 h-6 bg-yellow-300 flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5 text-black stroke-[3px]" />
                    </div>
                    <span className="hidden lg:inline max-w-[72px] truncate">
                      {session.user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-3 w-3 stroke-[3px] shrink-0" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-72 rounded-none border-2 border-black bg-white p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  align="end"
                  sideOffset={6}
                >
                  {/* Profile header */}
                  <DropdownMenuLabel className="p-0 border-b-2 border-black">
                    <div className="bg-indigo-950 px-4 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-300 border-2 border-yellow-300 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-black stroke-[3px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-black uppercase tracking-tighter text-sm truncate">
                          {session.user.name}
                        </p>
                        <p className="text-amber-300 text-[10px] font-bold uppercase tracking-widest truncate">
                          {session.user.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-yellow-300 text-black text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5">
                            ADMIN
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuGroup className="p-2 space-y-0.5">
                    {isAdmin && (
                      <>
                        <DropdownMenuItem
                          onClick={() => router.push("/dashboard")}
                          className="rounded-none border-2 border-transparent focus:border-black focus:bg-indigo-950 focus:text-white font-black uppercase text-xs tracking-widest cursor-pointer px-3 py-2.5 gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4 stroke-[3px]" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-black my-1" />
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={() => router.push("/orders")}
                      className="rounded-none border-2 border-transparent focus:border-black focus:bg-cyan-300 font-bold uppercase text-xs tracking-widest cursor-pointer px-3 py-2.5 gap-2"
                    >
                      <ShoppingBag className="h-4 w-4 stroke-[3px]" />
                      My Orders
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/wishlist")}
                      className="rounded-none border-2 border-transparent focus:border-black focus:bg-lime-300 font-bold uppercase text-xs tracking-widest cursor-pointer px-3 py-2.5 gap-2"
                    >
                      <Heart className="h-4 w-4 stroke-[3px]" />
                      Wishlist
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/returns")}
                      className="rounded-none border-2 border-transparent focus:border-black focus:bg-orange-300 font-bold uppercase text-xs tracking-widest cursor-pointer px-3 py-2.5 gap-2"
                    >
                      <Package className="h-4 w-4 stroke-[3px]" />
                      Returns & Refunds
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/account")}
                      className="rounded-none border-2 border-transparent focus:border-black focus:bg-yellow-300 font-bold uppercase text-xs tracking-widest cursor-pointer px-3 py-2.5 gap-2"
                    >
                      <Settings className="h-4 w-4 stroke-[3px]" />
                      Account Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-black my-1" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-none border-2 border-transparent focus:border-black focus:bg-red-600 focus:text-white font-black uppercase text-xs tracking-widest cursor-pointer px-3 py-2.5 gap-2"
                    >
                      <LogOut className="h-4 w-4 stroke-[3px]" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* ── USER: LOGGED OUT ── */
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => router.push("/login")}
                  className="h-10 px-4 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="h-10 px-4 border-2 border-black bg-yellow-300 font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* ── MOBILE HAMBURGER ── */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-yellow-300 transition-colors"
                >
                  <Menu className="h-5 w-5 stroke-[3px]" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-75 sm:w-85 border-l-4 border-black p-0 overflow-y-auto"
              >
                {/* Mobile header */}
                <SheetHeader className="p-5 border-b-2 border-black bg-indigo-950 shrink-0">
                  <SheetTitle className="text-left font-black uppercase italic tracking-tighter text-2xl text-white">
                    Menu
                  </SheetTitle>
                  {session ? (
                    <div className="flex items-center gap-2.5 mt-1">
                      <div className="w-9 h-9 bg-yellow-300 border-2 border-yellow-200 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-black stroke-[3px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-black text-xs uppercase tracking-tight truncate">
                          {session.user.name}
                        </p>
                        <p className="text-amber-300 text-[10px] font-bold uppercase tracking-widest truncate">
                          {isAdmin ? "Admin" : "Customer"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => router.push("/login")}
                        className="flex-1 py-2 border-2 border-white text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-indigo-950 transition-colors"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => router.push("/login")}
                        className="flex-1 py-2 border-2 border-yellow-300 bg-yellow-300 text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-colors"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </SheetHeader>

                <div className="flex flex-col divide-y-2 divide-black">
                  {/* Main nav links */}
                  <div className="p-4 space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2 mb-2">
                      Navigate
                    </p>
                    {[
                      { label: "Home", href: "/", icon: "🏠" },
                      { label: "Shop All", href: "/shop", icon: "🛍️" },
                      { label: "New Drops", href: "/shop?sort=newest", icon: "⚡" },
                      { label: "Deals", href: "/shop?sale=true", icon: "🔥" },
                      { label: "Flash Sale", href: "/shop?flash=true", icon: "⏳" },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-2 py-2.5 font-black uppercase text-xs tracking-widest border-2 border-transparent hover:border-black hover:bg-yellow-300 transition-all"
                      >
                        <span className="text-sm w-5 text-center">{link.icon}</span>
                        {link.label}
                      </a>
                    ))}
                    <a
                      href="https://wa.me/254700000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-2 py-2.5 font-black uppercase text-xs tracking-widest bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 stroke-[3px]" />
                      WhatsApp Orders
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 px-2 py-2.5 font-black uppercase text-xs tracking-widest bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    >
                      <Store className="h-4 w-4 stroke-[3px]" />
                      Sell With Us
                    </a>
                  </div>

                  {/* Categories */}
                  <div className="p-4 space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2 mb-2">
                      Categories
                    </p>
                    {CATEGORIES.map((cat) => (
                      <a
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        className="flex items-center gap-3 px-2 py-2 font-bold uppercase text-xs tracking-wide border-2 border-transparent hover:border-black hover:bg-yellow-300 transition-all"
                      >
                        <span className="text-sm w-5 text-center">{cat.icon}</span>
                        {cat.name}
                      </a>
                    ))}
                  </div>

                  {/* Auth-aware actions */}
                  {session && (
                    <div className="p-4 space-y-0.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2 mb-2">
                        My Account
                      </p>
                      {isAdmin && (
                        <a
                          href="/dashboard"
                          className="flex items-center gap-3 px-2 py-2.5 font-black uppercase text-xs tracking-widest border-2 border-black bg-indigo-950 text-white hover:bg-indigo-800 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 stroke-[3px]" />
                          Dashboard
                        </a>
                      )}
                      <a
                        href="/orders"
                        className="flex items-center gap-3 px-2 py-2.5 font-bold uppercase text-xs tracking-wide border-2 border-transparent hover:border-black hover:bg-cyan-300 transition-all"
                      >
                        <ShoppingBag className="h-4 w-4 stroke-[3px]" />
                        My Orders
                      </a>
                      <a
                        href="/wishlist"
                        className="flex items-center gap-3 px-2 py-2.5 font-bold uppercase text-xs tracking-wide border-2 border-transparent hover:border-black hover:bg-lime-300 transition-all"
                      >
                        <Heart className="h-4 w-4 stroke-[3px]" />
                        Wishlist
                      </a>
                      <a
                        href="/account"
                        className="flex items-center gap-3 px-2 py-2.5 font-bold uppercase text-xs tracking-wide border-2 border-transparent hover:border-black hover:bg-yellow-300 transition-all"
                      >
                        <Settings className="h-4 w-4 stroke-[3px]" />
                        Account Settings
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-2 py-2.5 font-black uppercase text-xs tracking-widest border-2 border-black bg-black text-white hover:bg-red-700 hover:border-red-700 transition-colors mt-2"
                      >
                        <LogOut className="h-4 w-4 stroke-[3px]" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-gray-200">
            <form onSubmit={handleSearch} className="relative flex">
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-none border-2 border-black h-11 font-bold text-sm placeholder:font-bold placeholder:uppercase placeholder:text-xs focus-visible:ring-0 pr-12"
                placeholder="Search..."
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-11 w-12 bg-indigo-950 border-l-2 border-black flex items-center justify-center"
              >
                <Search className="h-4 w-4 text-white stroke-[3px]" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── LAYER 3: CATEGORIES + QUICK LINKS BAR ── */}
      <div
        ref={megaRef}
        className="hidden md:block bg-white border-b-4 border-black"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-stretch h-11">

          {/* ALL CATEGORIES TRIGGER */}
          <button
            onMouseEnter={() => setIsMegaOpen(true)}
            onClick={() => setIsMegaOpen((v) => !v)}
            className={`flex items-center gap-2 px-5 font-black uppercase text-xs tracking-widest border-r-2 border-black transition-colors shrink-0 ${
              isMegaOpen
                ? "bg-indigo-950 text-white"
                : "bg-yellow-300 hover:bg-yellow-400 text-black"
            }`}
          >
            <LayoutGrid className="h-4 w-4 stroke-[3px]" />
            All Categories
            <ChevronDown
              className={`h-3 w-3 stroke-[3px] transition-transform duration-200 ${isMegaOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* QUICK LINKS */}
          <div className="flex items-stretch flex-1">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center px-5 font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white border-r border-gray-200 transition-colors ${link.color}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-stretch ml-auto border-l-2 border-black">
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 font-black uppercase text-xs tracking-widest text-white bg-green-600 border-r border-green-500 hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 stroke-[3px]" />
              WhatsApp Orders
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-5 font-black uppercase text-xs tracking-widest text-white bg-orange-500 hover:bg-orange-600 transition-colors"
            >
              <Store className="h-3.5 w-3.5 stroke-[3px]" />
              Sell With Us
            </a>
          </div>
        </div>

        {/* MEGA MENU DROPDOWN */}
        {isMegaOpen && (
          <div
            onMouseLeave={() => setIsMegaOpen(false)}
            className="absolute left-0 right-0 bg-white border-b-4 border-black shadow-[0_6px_0px_0px_rgba(0,0,0,1)] z-40"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-5 gap-x-6 gap-y-6">
                {CATEGORIES.map((cat) => (
                  <div key={cat.slug}>
                    <a
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setIsMegaOpen(false)}
                      className="flex items-center gap-2 font-black uppercase text-xs tracking-widest border-b-2 border-black pb-2 mb-2 hover:text-indigo-600 transition-colors"
                    >
                      <span className="text-sm">{cat.icon}</span>
                      {cat.name}
                    </a>
                    <ul className="space-y-1.5">
                      {cat.subcategories.slice(0, 4).map((sub) => (
                        <li key={sub.slug}>
                          <a
                            href={`/shop?category=${cat.slug}&sub=${sub.slug}`}
                            onClick={() => setIsMegaOpen(false)}
                            className="text-[11px] font-bold text-gray-500 hover:text-black hover:translate-x-1 inline-flex transition-all uppercase tracking-wide"
                          >
                            {sub.name}
                          </a>
                        </li>
                      ))}
                      {cat.subcategories.length > 4 && (
                        <li>
                          <a
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => setIsMegaOpen(false)}
                            className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline decoration-2 underline-offset-2"
                          >
                            View all →
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom promo strip */}
              <div className="mt-6 pt-5 border-t-2 border-black flex gap-3">
                <a
                  href="/shop?sale=true"
                  onClick={() => setIsMegaOpen(false)}
                  className="flex-1 bg-red-600 text-white px-4 py-3 font-black uppercase text-xs tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all text-center"
                >
                  🔥 Shop Deals
                </a>
                <a
                  href="/shop?sort=newest"
                  onClick={() => setIsMegaOpen(false)}
                  className="flex-1 bg-indigo-950 text-white px-4 py-3 font-black uppercase text-xs tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all text-center"
                >
                  ⚡ New Drops
                </a>
                <a
                  href="/shop"
                  onClick={() => setIsMegaOpen(false)}
                  className="flex-1 bg-yellow-300 text-black px-4 py-3 font-black uppercase text-xs tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all text-center"
                >
                  🛍️ View All Products
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
