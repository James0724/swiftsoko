"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Package, Truck, CheckCircle, XCircle, Clock,
  RefreshCcw, ChevronDown, ChevronRight, Eye, ArrowLeft,
  CreditCard, Phone, Calendar, MapPin, Star,
} from "lucide-react";

const MOCK_ORDERS = [
  {
    id: "ORD-20260001",
    date: "2026-06-10",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "M-Pesa",
    paymentRef: "QHJ12KL9",
    total: 12450,
    subtotal: 11500,
    shipping: 350,
    tax: 600,
    deliveryDate: "2026-06-12",
    address: "Apartment 4B, Westlands, Nairobi",
    items: [
      { id: "1", name: "T-01 Modular Bag", sku: "T01-MOD-BAG", qty: 1, price: 5550, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400" },
      { id: "2", name: "Ghost Shell Jacket", sku: "GSJ-002", qty: 1, price: 5950, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400" },
    ],
  },
  {
    id: "ORD-20260002",
    date: "2026-06-11",
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Card",
    paymentRef: "TXN-4821",
    total: 4200,
    subtotal: 3850,
    shipping: 200,
    tax: 150,
    deliveryDate: null,
    address: "Kileleshwa, Nairobi",
    items: [
      { id: "3", name: "Swift Runner X1", sku: "SRX1-003", qty: 1, price: 3850, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400" },
    ],
  },
  {
    id: "ORD-20260003",
    date: "2026-06-12",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "M-Pesa",
    paymentRef: "MPS-88432",
    total: 3650,
    subtotal: 3200,
    shipping: 300,
    tax: 150,
    deliveryDate: null,
    address: "Karen, Nairobi",
    items: [
      { id: "4", name: "Core Series Hoodie", sku: "CSH-004", qty: 1, price: 3200, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=400" },
    ],
  },
  {
    id: "ORD-20260004",
    date: "2026-06-05",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "M-Pesa",
    paymentRef: "MPS-71234",
    total: 1850,
    subtotal: 1600,
    shipping: 150,
    tax: 100,
    deliveryDate: null,
    address: "Parklands, Nairobi",
    items: [
      { id: "5", name: "Utility Field Cap", sku: "UFC-005", qty: 1, price: 1600, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=400" },
    ],
  },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode; step: number }> = {
  pending:    { color: "text-yellow-700", bg: "bg-yellow-200", label: "Pending",    icon: <Clock size={14} />,        step: 0 },
  processing: { color: "text-blue-700",   bg: "bg-blue-200",   label: "Processing", icon: <RefreshCcw size={14} />,   step: 1 },
  shipped:    { color: "text-indigo-700", bg: "bg-indigo-200", label: "Shipped",    icon: <Truck size={14} />,         step: 2 },
  delivered:  { color: "text-green-700",  bg: "bg-green-200",  label: "Delivered",  icon: <CheckCircle size={14} />,   step: 3 },
  cancelled:  { color: "text-red-700",    bg: "bg-red-200",    label: "Cancelled",  icon: <XCircle size={14} />,       step: -1 },
};

const PAYMENT_STATUS: Record<string, { color: string; label: string }> = {
  paid:     { color: "bg-green-200 text-green-800",   label: "Paid" },
  pending:  { color: "bg-yellow-200 text-yellow-800", label: "Awaiting Payment" },
  refunded: { color: "bg-purple-200 text-purple-800", label: "Refunded" },
  failed:   { color: "bg-red-200 text-red-800",       label: "Failed" },
};

export default function MyOrdersPage() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = MOCK_ORDERS.filter((o) => filter === "all" || o.status === filter);

  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20">
      {/* Header */}
      <div className="bg-indigo-950 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Shop
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-300 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ShoppingBag size={28} strokeWidth={3} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">My Orders</h1>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest">{MOCK_ORDERS.length} orders total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", "processing", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 border-4 border-black font-black uppercase text-xs transition-all ${filter === s ? "bg-indigo-950 text-white translate-x-0.5 translate-y-0.5 shadow-none" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"}`}
            >
              {s === "all" ? "All Orders" : s}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-16 text-center">
            <ShoppingBag size={60} strokeWidth={2} className="mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase text-xl mb-2">No orders found</p>
            <p className="font-bold text-sm text-gray-500 uppercase mb-6">You have no orders in this category.</p>
            <Link href="/shop" className="inline-block bg-yellow-300 border-4 border-black px-8 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
              Start Shopping
            </Link>
          </div>
        )}

        {filtered.map((order) => {
          const cfg = STATUS_CONFIG[order.status];
          const paymentCfg = PAYMENT_STATUS[order.paymentStatus];
          const isExpanded = expanded === order.id;

          return (
            <div key={order.id} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* Order header */}
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-yellow-50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : order.id)}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black uppercase text-xs ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </div>
                  <div>
                    <p className="font-black text-sm">{order.id}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                      <Calendar size={10} /> {order.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-black text-lg">KSh {order.total.toLocaleString()}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${paymentCfg.color}`}>{paymentCfg.label}</span>
                  </div>
                  <ChevronDown size={18} strokeWidth={3} className={`shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Order items preview */}
              <div className="px-6 pb-4 flex gap-2">
                {order.items.map((item) => (
                  <div key={item.id} className="w-14 h-14 border-2 border-black overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="flex items-center px-2">
                  <p className="font-bold text-xs text-gray-500 uppercase">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t-4 border-black">
                  {/* Progress tracker */}
                  {order.status !== "cancelled" && (
                    <div className="px-6 py-5 bg-gray-50 border-b-2 border-black">
                      <p className="font-black uppercase text-xs tracking-widest mb-4">Order Progress</p>
                      <div className="flex items-center gap-0">
                        {[
                          { label: "Placed", icon: <ShoppingBag size={16} strokeWidth={3} /> },
                          { label: "Processing", icon: <RefreshCcw size={16} strokeWidth={3} /> },
                          { label: "Shipped", icon: <Truck size={16} strokeWidth={3} /> },
                          { label: "Delivered", icon: <CheckCircle size={16} strokeWidth={3} /> },
                        ].map((step, i) => {
                          const done = cfg.step >= i;
                          return (
                            <div key={step.label} className="flex items-center flex-1">
                              <div className="flex flex-col items-center gap-1">
                                <div className={`w-9 h-9 border-4 border-black flex items-center justify-center font-black ${done ? "bg-green-300" : "bg-white"}`}>
                                  {step.icon}
                                </div>
                                <p className={`text-[9px] font-black uppercase tracking-wide ${done ? "text-black" : "text-gray-400"}`}>{step.label}</p>
                              </div>
                              {i < 3 && <div className={`h-1 flex-1 border-y-2 border-black mx-1 ${done && cfg.step > i ? "bg-green-300" : "bg-gray-200"}`} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="divide-y-2 divide-gray-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                        <div className="w-16 h-16 border-2 border-black overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-sm">{item.name}</p>
                          <p className="text-xs font-bold text-gray-500 uppercase">SKU: {item.sku} · Qty: {item.qty}</p>
                        </div>
                        <p className="font-black text-sm shrink-0">KSh {item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Payment & Delivery info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t-4 border-black">
                    <div className="px-6 py-5 border-r-0 md:border-r-4 border-black border-b-4 md:border-b-0">
                      <p className="font-black uppercase text-xs tracking-widest mb-3">Payment Info</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          {order.paymentMethod === "M-Pesa" ? <Phone size={14} strokeWidth={3} className="text-green-600" /> : <CreditCard size={14} strokeWidth={3} className="text-blue-600" />}
                          {order.paymentMethod}
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Ref: {order.paymentRef}</p>
                        <div className="pt-2 space-y-1 text-xs font-bold border-t border-gray-200">
                          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>KSh {order.subtotal.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>KSh {order.shipping.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Tax (VAT 16%)</span><span>KSh {order.tax.toLocaleString()}</span></div>
                          <div className="flex justify-between font-black text-sm border-t border-gray-200 pt-1"><span>Total</span><span>KSh {order.total.toLocaleString()}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-5">
                      <p className="font-black uppercase text-xs tracking-widest mb-3">Delivery Info</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 font-bold text-sm">
                          <MapPin size={14} strokeWidth={3} className="shrink-0 mt-0.5" />
                          {order.address}
                        </div>
                        {order.deliveryDate && (
                          <div className="flex items-center gap-2 font-bold text-sm text-green-700">
                            <CheckCircle size={14} strokeWidth={3} />
                            Delivered on {order.deliveryDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 border-t-4 border-black bg-gray-50 flex gap-3 flex-wrap">
                    {order.status === "delivered" && (
                      <Link href={`/returns?order=${order.id}`} className="flex items-center gap-2 px-4 py-2.5 border-4 border-black bg-orange-200 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                        <RefreshCcw size={14} strokeWidth={3} /> Request Return
                      </Link>
                    )}
                    {order.status === "delivered" && (
                      <button className="flex items-center gap-2 px-4 py-2.5 border-4 border-black bg-yellow-300 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                        <Star size={14} strokeWidth={3} /> Write Review
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2.5 border-4 border-black bg-white font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                      <Eye size={14} strokeWidth={3} /> Track Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
