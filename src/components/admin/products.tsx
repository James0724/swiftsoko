"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, Briefcase, ShoppingCart, Settings,
  PackageSearch, Pencil, Trash2,
  Star, MessageSquare, Eye, Check,
  X, AlertCircle, Clock, Package, RefreshCcw,
  Search, DollarSign, Upload, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { AddProductModal } from "../modals/product-form-modal";
import { PRODUCTS, type Product } from "@/lib/data/products";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: "ORD-001", customer: "James Kahoro", email: "james@example.com", items: 3, total: 12450, status: "delivered", payment: "M-Pesa", date: "2026-06-10", products: ["T-01 Modular Bag", "Ghost Shell Jacket"] },
  { id: "ORD-002", customer: "Amina Ochieng", email: "amina@example.com", items: 1, total: 4200, status: "processing", payment: "Card", date: "2026-06-11", products: ["Swift Runner X1"] },
  { id: "ORD-003", customer: "David Mwangi", email: "david@example.com", items: 2, total: 8900, status: "shipped", payment: "M-Pesa", date: "2026-06-11", products: ["Core Series Hoodie", "T-01 Modular Bag"] },
  { id: "ORD-004", customer: "Grace Njeri", email: "grace@example.com", items: 1, total: 1850, status: "pending", payment: "M-Pesa", date: "2026-06-12", products: ["Utility Field Cap"] },
  { id: "ORD-005", customer: "Kevin Otieno", email: "kevin@example.com", items: 4, total: 18750, status: "cancelled", payment: "Card", date: "2026-06-09", products: ["Ghost Shell Jacket", "Swift Runner X1"] },
  { id: "ORD-006", customer: "Sylvia Wanjiku", email: "sylvia@example.com", items: 2, total: 6300, status: "delivered", payment: "M-Pesa", date: "2026-06-08", products: ["Tac-Grid Shorts", "Core Compression Top"] },
];

const MOCK_REVIEWS = [
  { id: "R-001", product: "T-01 Modular Bag", customer: "James K.", rating: 5, comment: "Excellent build quality! The modular system is ingenious. Delivery was fast and packaging was premium.", date: "2026-06-10", status: "approved" },
  { id: "R-002", product: "Ghost Shell Jacket", customer: "Amina O.", rating: 4, comment: "Great jacket, fits perfectly. The water resistance is top notch. Would love more colour options.", date: "2026-06-09", status: "approved" },
  { id: "R-003", product: "Swift Runner X1", customer: "David M.", rating: 3, comment: "Good shoes but slightly narrow. Sizing runs small, recommend going half a size up.", date: "2026-06-08", status: "pending" },
  { id: "R-004", product: "Core Series Hoodie", customer: "Grace N.", rating: 5, comment: "Best hoodie I've ever worn. The fabric is thick and the stitching is very clean.", date: "2026-06-07", status: "approved" },
  { id: "R-005", product: "Utility Field Cap", customer: "Kevin O.", rating: 2, comment: "Cap is decent but the sizing is off. Too large even on the tightest strap setting.", date: "2026-06-11", status: "flagged" },
];

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pending:    { color: "bg-yellow-300 text-black",   label: "Pending",    icon: <Clock size={10} /> },
  processing: { color: "bg-blue-200 text-blue-900",   label: "Processing", icon: <RefreshCcw size={10} /> },
  shipped:    { color: "bg-indigo-200 text-indigo-900",label: "Shipped",   icon: <Package size={10} /> },
  delivered:  { color: "bg-green-200 text-green-900", label: "Delivered",  icon: <Check size={10} /> },
  cancelled:  { color: "bg-red-200 text-red-900",     label: "Cancelled",  icon: <X size={10} /> },
};

// ─── Main component ───────────────────────────────────────────────────────────
const ProductDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("all");
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const filteredOrders = MOCK_ORDERS.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredReviews = reviews.filter((r) =>
    reviewStatusFilter === "all" || r.status === reviewStatusFilter
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <DashboardOverview products={products} />;
      case "Products":  return <ProductsSection products={products} onDelete={(id: string) => setDeleteConfirm(id)} onEdit={setEditingProduct} deleteConfirm={deleteConfirm} onConfirmDelete={handleDeleteProduct} onCancelDelete={() => setDeleteConfirm(null)} />;
      case "Orders":    return <OrdersSection orders={filteredOrders} search={orderSearch} onSearch={setOrderSearch} statusFilter={orderStatusFilter} onStatusFilter={setOrderStatusFilter} />;
      case "Reviews":   return <ReviewsSection reviews={filteredReviews} statusFilter={reviewStatusFilter} onStatusFilter={setReviewStatusFilter} onUpdateStatus={(id: string, status: string) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F0F0] font-mono">
      <aside className="w-72 bg-white border-r-4 border-black flex flex-col p-6">
        <div className="mb-10 p-4 border-4 border-black bg-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-black text-2xl uppercase tracking-tighter">Store Admin</h2>
          <p className="text-xs font-bold uppercase mt-1 opacity-70">Control Panel</p>
        </div>

        <nav className="space-y-4 flex-1">
          {[
            { label: "Dashboard", icon: <LayoutDashboard size={22} strokeWidth={3} />, color: "bg-cyan-300" },
            { label: "Products",  icon: <Briefcase size={22} strokeWidth={3} />,       color: "bg-lime-400" },
            { label: "Orders",    icon: <ShoppingCart size={22} strokeWidth={3} />,    color: "bg-yellow-400" },
            { label: "Reviews",   icon: <MessageSquare size={22} strokeWidth={3} />,   color: "bg-purple-400" },
          ].map(({ label, icon, color }) => (
            <SidebarItem key={label} icon={icon} label={label} active={activeTab === label} onClick={() => setActiveTab(label)} activeColor={color} />
          ))}
        </nav>

        <div className="pt-6 border-t-4 border-black">
          <SidebarItem icon={<Settings size={22} strokeWidth={3} />} label="Settings" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} activeColor="bg-gray-300" />
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {renderContent()}
      </main>

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={(updated) => { setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p)); setEditingProduct(null); }} />
      )}
    </div>
  );
};

// ─── Sidebar item ─────────────────────────────────────────────────────────────
const SidebarItem = ({ icon, label, active, onClick, activeColor }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 border-4 border-black transition-all font-black uppercase text-sm ${active ? `${activeColor} translate-x-1 translate-y-1 shadow-none` : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// ─── Dashboard Overview ───────────────────────────────────────────────────────
const DashboardOverview = ({ products }: { products: Product[] }) => {
  const totalRevenue = MOCK_ORDERS.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const totalOrders = MOCK_ORDERS.length;
  const pendingOrders = MOCK_ORDERS.filter(o => o.status === "pending" || o.status === "processing").length;
  const lowStock = products.filter(p => p.stock < 5).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Dashboard</h1>
          <p className="font-bold text-sm text-gray-500 uppercase tracking-widest">Overview — June 2026</p>
        </div>
        <div className="bg-indigo-950 text-yellow-300 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs">
          Live Data
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `KSh ${totalRevenue.toLocaleString()}`, icon: <DollarSign size={28} strokeWidth={3} />, color: "bg-green-300", change: "+12% this week" },
          { label: "Total Orders",  value: totalOrders,   icon: <ShoppingCart size={28} strokeWidth={3} />, color: "bg-cyan-300",   change: `${pendingOrders} pending` },
          { label: "Products Live", value: products.length, icon: <Briefcase size={28} strokeWidth={3} />,  color: "bg-yellow-300", change: `${lowStock} low stock` },
          { label: "Avg Rating",   value: "4.4★",         icon: <Star size={28} strokeWidth={3} />,        color: "bg-purple-300", change: "Based on 5 reviews" },
        ].map(({ label, value, icon, color, change }) => (
          <div key={label} className={`${color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5`}>
            <div className="flex items-start justify-between mb-3">
              <p className="font-black uppercase text-xs tracking-widest">{label}</p>
              {icon}
            </div>
            <p className="text-3xl font-black">{value}</p>
            <p className="text-xs font-bold uppercase mt-1 opacity-70">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-indigo-950 text-white px-6 py-4 border-b-4 border-black">
            <h3 className="font-black uppercase tracking-tight">Recent Orders</h3>
          </div>
          <div className="divide-y-2 divide-black">
            {MOCK_ORDERS.slice(0, 4).map((o) => {
              const cfg = STATUS_CONFIG[o.status];
              return (
                <div key={o.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="font-black text-sm">{o.customer}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase">{o.id} · {o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm">KSh {o.total.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-yellow-300 px-6 py-4 border-b-4 border-black">
            <h3 className="font-black uppercase tracking-tight">Low Stock Alert</h3>
          </div>
          <div className="divide-y-2 divide-black">
            {products.filter(p => p.stock < 10).slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="font-black text-sm">{p.name}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">{p.sku}</p>
                </div>
                <div className={`px-3 py-1 border-2 border-black font-black text-xs ${p.stock < 3 ? "bg-red-300" : "bg-orange-200"}`}>
                  {p.stock} left
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Products Section ─────────────────────────────────────────────────────────
const ProductsSection = ({ products, onDelete, onEdit, deleteConfirm, onConfirmDelete, onCancelDelete }: any) => {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Products</h1>
          <p className="font-bold text-sm text-gray-500 uppercase">{products.length} total products</p>
        </div>
        <AddProductModal />
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 stroke-[3px]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="w-full pl-10 pr-4 h-12 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-16 text-center">
          <PackageSearch size={60} strokeWidth={3} className="mx-auto mb-4 opacity-30" />
          <p className="font-black uppercase text-xl">No products found</p>
        </div>
      ) : (
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-950 text-white text-left">
                  {["Product", "SKU", "Category", "Price", "Stock", "Rating", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 font-black uppercase text-[10px] tracking-widest border-r border-indigo-800 last:border-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filtered.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 border-2 border-black shrink-0 overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-sm leading-tight">{product.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {product.isNew && <span className="bg-cyan-300 text-[8px] font-black uppercase px-1.5 py-0.5 border border-black">NEW</span>}
                            {product.isOnSale && <span className="bg-red-300 text-[8px] font-black uppercase px-1.5 py-0.5 border border-black">SALE</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold text-xs text-gray-500 uppercase">{product.sku}</td>
                    <td className="px-5 py-3 font-bold text-xs uppercase">{product.category}</td>
                    <td className="px-5 py-3">
                      <p className="font-black text-sm">KSh {product.price.toLocaleString()}</p>
                      {product.originalPrice && <p className="text-xs font-bold text-gray-400 line-through">KSh {product.originalPrice.toLocaleString()}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 border-2 border-black font-black text-xs ${product.stock < 3 ? "bg-red-300" : product.stock < 10 ? "bg-orange-200" : "bg-green-200"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-bold text-sm">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {product.rating} ({product.reviews})
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => onConfirmDelete(product.id)} className="bg-red-500 text-white px-3 py-1.5 border-2 border-black font-black text-xs uppercase hover:bg-red-700 transition-colors">Confirm</button>
                          <button onClick={onCancelDelete} className="bg-white px-3 py-1.5 border-2 border-black font-black text-xs uppercase hover:bg-gray-100 transition-colors">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => onEdit(product)} className="p-2 border-2 border-black hover:bg-cyan-300 transition-colors"><Pencil size={14} strokeWidth={3} /></button>
                          <button onClick={() => onDelete(product.id)} className="p-2 border-2 border-black hover:bg-red-300 transition-colors"><Trash2 size={14} strokeWidth={3} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Orders Section ───────────────────────────────────────────────────────────
const OrdersSection = ({ orders, search, onSearch, statusFilter, onStatusFilter }: any) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-4xl font-black uppercase italic tracking-tighter">Orders</h1>
      <p className="font-bold text-sm text-gray-500 uppercase">{MOCK_ORDERS.length} total orders</p>
    </div>

    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-48">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 stroke-[3px]" />
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 h-12 border-4 border-black font-bold text-sm focus:outline-none" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
          <button key={s} onClick={() => onStatusFilter(s)} className={`px-4 py-2 border-2 border-black font-black uppercase text-xs transition-all ${statusFilter === s ? "bg-indigo-950 text-white translate-x-0.5 translate-y-0.5" : "bg-white hover:bg-yellow-300"}`}>{s}</button>
        ))}
      </div>
    </div>

    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-950 text-white text-left">
              {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Action"].map((h) => (
                <th key={h} className="px-5 py-4 font-black uppercase text-[10px] tracking-widest border-r border-indigo-800 last:border-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {orders.map((o: any) => {
              const cfg = STATUS_CONFIG[o.status];
              return (
                <tr key={o.id} className="hover:bg-yellow-50 transition-colors">
                  <td className="px-5 py-3 font-black text-sm">{o.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-black text-sm">{o.customer}</p>
                    <p className="text-xs font-bold text-gray-500">{o.email}</p>
                  </td>
                  <td className="px-5 py-3 font-bold text-sm">{o.items}</td>
                  <td className="px-5 py-3 font-black text-sm">KSh {o.total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 border-2 border-black font-black text-[10px] uppercase ${o.payment === "M-Pesa" ? "bg-green-200" : "bg-blue-200"}`}>{o.payment}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 border-2 border-black font-black text-[10px] uppercase ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                  </td>
                  <td className="px-5 py-3 font-bold text-xs text-gray-500">{o.date}</td>
                  <td className="px-5 py-3">
                    <button className="flex items-center gap-1 px-3 py-1.5 border-2 border-black font-black text-xs uppercase hover:bg-yellow-300 transition-colors">
                      <Eye size={12} strokeWidth={3} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="font-black uppercase text-xl opacity-30">No orders match filters</p>
        </div>
      )}
    </div>

    {/* Order Stats */}
    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
      {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
        const count = MOCK_ORDERS.filter(o => o.status === status).length;
        return (
          <div key={status} className={`${cfg.color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 text-center`}>
            <p className="text-2xl font-black">{count}</p>
            <p className="font-black uppercase text-[10px] tracking-widest">{cfg.label}</p>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Reviews Section ──────────────────────────────────────────────────────────
const ReviewsSection = ({ reviews, statusFilter, onStatusFilter, onUpdateStatus }: any) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-4xl font-black uppercase italic tracking-tighter">Reviews</h1>
      <p className="font-bold text-sm text-gray-500 uppercase">{reviews.length} reviews shown</p>
    </div>

    <div className="flex gap-2 flex-wrap">
      {["all", "pending", "approved", "flagged"].map((s) => (
        <button key={s} onClick={() => onStatusFilter(s)} className={`px-4 py-2 border-2 border-black font-black uppercase text-xs transition-all ${statusFilter === s ? "bg-indigo-950 text-white" : "bg-white hover:bg-yellow-300"}`}>{s}</button>
      ))}
    </div>

    <div className="space-y-4">
      {reviews.map((r: any) => (
        <div key={r.id} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-950 flex items-center justify-center border-2 border-black">
                <span className="text-yellow-300 font-black text-sm">{r.customer[0]}</span>
              </div>
              <div>
                <p className="font-black text-sm">{r.customer}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">{r.product} · {r.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} size={14} className={star <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className={`px-2 py-1 border-2 border-black font-black text-[9px] uppercase ${r.status === "approved" ? "bg-green-200" : r.status === "flagged" ? "bg-red-200" : "bg-yellow-200"}`}>
                {r.status}
              </span>
            </div>
          </div>
          <div className="px-6 py-4 flex items-start justify-between gap-4">
            <p className="font-bold text-sm text-gray-700 flex-1">"{r.comment}"</p>
            <div className="flex gap-2 shrink-0">
              {r.status !== "approved" && <button onClick={() => onUpdateStatus(r.id, "approved")} className="p-2 border-2 border-black bg-green-200 hover:bg-green-400 transition-colors"><Check size={14} strokeWidth={3} /></button>}
              {r.status !== "flagged"  && <button onClick={() => onUpdateStatus(r.id, "flagged")}  className="p-2 border-2 border-black bg-red-200 hover:bg-red-400 transition-colors"><AlertCircle size={14} strokeWidth={3} /></button>}
              {r.status !== "pending"  && <button onClick={() => onUpdateStatus(r.id, "pending")}  className="p-2 border-2 border-black bg-yellow-200 hover:bg-yellow-400 transition-colors"><Clock size={14} strokeWidth={3} /></button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Edit Product Modal ───────────────────────────────────────────────────────
const EditProductModal = ({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (p: Product) => void }) => {
  const [form, setForm] = useState({ ...product });
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof Product, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    setNewImageFiles(fileArray);
    setNewPreviews(fileArray.map((f) => URL.createObjectURL(f)));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", String(form.name ?? ""));
      formData.append("price", String(form.price ?? ""));
      formData.append("stock", String(form.stock ?? ""));
      formData.append("sku", String(form.sku ?? ""));
      formData.append("description", String(form.description ?? ""));
      newImageFiles.forEach((file) => formData.append("images", file));

      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Failed to update product");
        return;
      }

      toast.success("Product updated successfully");
      onSave(form);
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="bg-cyan-300 border-b-4 border-black px-8 py-5 flex items-center justify-between sticky top-0">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Edit Product</h2>
          <button onClick={onClose} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"><X size={18} strokeWidth={3} /></button>
        </div>

        <div className="p-8 space-y-5">
          {([["name","Product Name","text"],["price","Price (KSh)","number"],["originalPrice","Original Price (KSh)","number"],["stock","Stock Level","number"],["sku","SKU","text"],["brand","Brand","text"]] as [keyof Product, string, string][]).map(([field, label, type]) => (
            <div key={field} className="space-y-1">
              <label className="font-black uppercase text-xs">{label}</label>
              <input type={type} value={(form as any)[field] ?? ""} onChange={(e) => handleChange(field, type === "number" ? Number(e.target.value) : e.target.value)} className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50" />
            </div>
          ))}

          <div className="space-y-1">
            <label className="font-black uppercase text-xs">Description</label>
            <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} className="w-full px-4 py-3 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50 resize-none" />
          </div>

          {/* Image update section */}
          <div className="space-y-2">
            <label className="font-black uppercase text-xs">Replace Images</label>
            <label className="flex items-center gap-3 cursor-pointer border-4 border-dashed border-black px-4 py-3 hover:bg-cyan-50 transition-colors">
              <Upload size={18} strokeWidth={3} />
              <span className="font-bold text-sm uppercase">
                {newImageFiles.length > 0
                  ? `${newImageFiles.length} new image(s) selected`
                  : "Click to select replacement images"}
              </span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {newPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {newPreviews.map((src, i) => (
                  <div key={i} className="aspect-square border-2 border-black overflow-hidden">
                    <img src={src} alt="new preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {newPreviews.length === 0 && form.image && (
              <div className="flex gap-2 mt-2">
                <div className="w-16 h-16 border-2 border-black overflow-hidden">
                  <img src={form.image} alt="current" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase self-center">Current image — upload new to replace</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
              <input type="checkbox" checked={!!form.isNew} onChange={(e) => handleChange("isNew", e.target.checked)} className="w-4 h-4 border-2 border-black" />
              Mark as New
            </label>
            <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
              <input type="checkbox" checked={!!form.isOnSale} onChange={(e) => handleChange("isOnSale", e.target.checked)} className="w-4 h-4 border-2 border-black" />
              On Sale
            </label>
            <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
              <input type="checkbox" checked={!!form.isFeatured} onChange={(e) => handleChange("isFeatured", e.target.checked)} className="w-4 h-4 border-2 border-black" />
              Featured
            </label>
          </div>
        </div>

        <div className="px-8 py-5 border-t-4 border-black bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} disabled={submitting} className="px-6 py-3 border-4 border-black font-black uppercase text-sm hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="px-8 py-3 bg-cyan-300 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
