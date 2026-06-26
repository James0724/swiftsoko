import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";

const NAV_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "New Drops", href: "/shop?sort=newest" },
  { label: "Flash Deals", href: "/shop?sale=true" },
  { label: "My Orders", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Returns & Refunds", href: "/returns" },
];

const SUPPORT_LINKS = [
  { label: "Contact Support", href: "mailto:support@jijengeswiftsoko.co.ke" },
  { label: "WhatsApp Orders", href: "https://wa.me/254700000000" },
  { label: "Track Your Order", href: "/orders" },
  { label: "FAQ", href: "/returns#faq" },
];

const LEGAL_LINKS = [
  { label: "Privacy Protocol", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-indigo-950 text-white border-t-8 border-yellow-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

        {/* Brand */}
        <div className="md:col-span-4 space-y-6">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="bg-indigo-800 p-2 border-2 border-yellow-300 shadow-[3px_3px_0px_0px_rgba(253,224,71,1)] transition-all group-hover:shadow-none group-hover:translate-x-0.75 group-hover:translate-y-0.75">
              <Zap className="h-5 w-5 text-yellow-300 fill-current" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-black tracking-tighter text-white uppercase italic">Jijenge</span>
              <span className="text-[9px] font-black tracking-[0.22em] text-yellow-300 uppercase">Swiftsoko</span>
            </div>
          </Link>

          <p className="max-w-xs text-gray-400 font-bold uppercase text-xs tracking-widest leading-relaxed">
            Kenya's bold marketplace for high-performance essentials. Limited drops. Fast delivery across Nairobi.
          </p>

          <div className="flex gap-3">
            {[
              { label: "TW", href: "#" },
              { label: "IG", href: "#" },
              { label: "FB", href: "#" },
              { label: "TK", href: "#" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="w-10 h-10 border-2 border-white/30 flex items-center justify-center font-black text-xs hover:bg-yellow-300 hover:text-black hover:border-yellow-300 transition-all"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="pt-2 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contact Us</p>
            <a href="mailto:support@jijengeswiftsoko.co.ke" className="block text-xs font-bold text-gray-400 hover:text-white transition-colors">support@jijengeswiftsoko.co.ke</a>
            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="block text-xs font-bold text-gray-400 hover:text-white transition-colors">+254 700 000 000</a>
          </div>
        </div>

        {/* Shop */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-black uppercase text-yellow-300 tracking-tighter text-base underline decoration-2">Shop</h4>
          <ul className="space-y-2.5">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="font-bold uppercase text-xs text-gray-400 hover:text-white hover:translate-x-1 inline-flex transition-all tracking-wide">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-black uppercase text-yellow-300 tracking-tighter text-base underline decoration-2">Support</h4>
          <ul className="space-y-2.5">
            {SUPPORT_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="font-bold uppercase text-xs text-gray-400 hover:text-white hover:translate-x-1 inline-flex transition-all tracking-wide">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-black uppercase text-yellow-300 tracking-tighter text-base underline decoration-2">
            Drop Alerts
          </h4>
          <p className="text-[10px] font-bold uppercase text-gray-400 leading-relaxed">
            Join the protocol. Get notified on new drops, flash deals, and restocks — straight to your inbox. No spam, ever.
          </p>
          <div className="flex">
            <input
              className="bg-transparent border-2 border-white/30 rounded-none p-2.5 flex-1 font-bold text-xs focus:outline-none focus:border-yellow-300 focus:bg-white/5 transition-all placeholder:text-gray-600 placeholder:uppercase"
              placeholder="your@email.com"
            />
            <button className="bg-yellow-300 text-black p-2.5 border-y-2 border-r-2 border-yellow-300 font-black hover:bg-yellow-400 transition-colors px-4">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Payment badges */}
          <div className="pt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">We Accept</p>
            <div className="flex gap-2 flex-wrap">
              {["M-Pesa", "Visa", "Mastercard"].map((p) => (
                <span key={p} className="px-3 py-1 border border-white/20 text-[9px] font-black uppercase tracking-wider text-gray-400">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          ©2026 Jijenge Swiftsoko. All Rights Reserved. Nairobi, Kenya.
        </p>
        <div className="flex gap-6 font-mono text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className="hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
