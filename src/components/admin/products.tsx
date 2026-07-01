"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Briefcase, ShoppingCart, Settings,
  PackageSearch, Pencil, Trash2,
  Star, MessageSquare, Eye, Check,
  X, AlertCircle, Clock, Package, RefreshCcw,
  Search, DollarSign, Upload, Loader2, Tag, Globe, MapPin,
  Calendar, Power, ImagePlus,
} from "lucide-react";
import { toast } from "sonner";
import { AddProductModal } from "../modals/product-form-modal";
import { PRODUCT_SECTIONS } from "@/lib/product-sections";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { CategoryCascadeSelect } from "@/components/ui/category-cascade-select";
import { BrandAutocomplete, type BrandOption } from "@/components/ui/brand-autocomplete";
import { countWords, SHORT_DESCRIPTION_MAX_WORDS } from "@/lib/sanitize-html";
import type { AdminProduct } from "@/lib/map-product";

const MAX_GALLERY_IMAGES = 4;

// ─── Mock data (orders/reviews are not part of the product CRUD fix) ─────────
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
const ProductDashboard = ({ initialProducts }: { initialProducts: AdminProduct[] }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("all");
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const handleDeleteProduct = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json.error ?? "Failed to delete product");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
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
      case "Products":  return (
        <ProductsSection
          products={products}
          onDelete={(id: string) => setDeleteConfirm(id)}
          onEdit={setEditingProduct}
          deleteConfirm={deleteConfirm}
          deleting={deleting}
          onConfirmDelete={handleDeleteProduct}
          onCancelDelete={() => setDeleteConfirm(null)}
          onCreated={(p: AdminProduct) => setProducts((prev) => [p, ...prev])}
        />
      );
      case "Brands":    return <BrandsSection />;
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
            { label: "Brands",    icon: <Tag size={22} strokeWidth={3} />,             color: "bg-orange-300" },
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
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updated) => {
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingProduct(null);
          }}
        />
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
const DashboardOverview = ({ products }: { products: AdminProduct[] }) => {
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
          { label: "Featured",   value: products.filter(p => p.sections?.includes("FEATURED")).length,  icon: <Star size={28} strokeWidth={3} />,        color: "bg-purple-300", change: "Shown on homepage" },
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
            {products.length === 0 ? (
              <p className="px-6 py-8 text-center font-bold text-sm text-gray-400 uppercase">No products yet</p>
            ) : (
              products.filter(p => p.stock < 10).slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="font-black text-sm">{p.name}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase">{p.sku || "—"}</p>
                  </div>
                  <div className={`px-3 py-1 border-2 border-black font-black text-xs ${p.stock < 3 ? "bg-red-300" : "bg-orange-200"}`}>
                    {p.stock} left
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Products Section ─────────────────────────────────────────────────────────
const ProductsSection = ({ products, onDelete, onEdit, deleteConfirm, deleting, onConfirmDelete, onCancelDelete, onCreated }: any) => {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p: AdminProduct) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Products</h1>
          <p className="font-bold text-sm text-gray-500 uppercase">{products.length} total products</p>
        </div>
        <AddProductModal onCreated={onCreated} />
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
                  {["Product", "SKU", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 font-black uppercase text-[10px] tracking-widest border-r border-indigo-800 last:border-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filtered.map((product: AdminProduct) => (
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
                            {product.sections?.includes("FEATURED") && <span className="bg-purple-300 text-[8px] font-black uppercase px-1.5 py-0.5 border border-black">FEATURED</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold text-xs text-gray-500 uppercase">{product.sku || "—"}</td>
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
                    <td className="px-5 py-3">
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => onConfirmDelete(product.id)} disabled={deleting === product.id} className="bg-red-500 text-white px-3 py-1.5 border-2 border-black font-black text-xs uppercase hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1">
                            {deleting === product.id && <Loader2 size={12} className="animate-spin" />}
                            Confirm
                          </button>
                          <button onClick={onCancelDelete} disabled={deleting === product.id} className="bg-white px-3 py-1.5 border-2 border-black font-black text-xs uppercase hover:bg-gray-100 transition-colors disabled:opacity-50">Cancel</button>
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
const EditProductModal = ({ product, onClose, onSave }: { product: AdminProduct; onClose: () => void; onSave: (p: AdminProduct) => void }) => {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice ?? "",
    stock: product.stock,
    sku: product.sku,
    shortDescription: product.shortDescription,
    description: product.description,
    sections: product.sections ?? [],
    categorySlug: product.categorySlug,
    subCategorySlug: product.subCategorySlug,
    brandId: product.brandId ?? "",
  });
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [keptGallery, setKeptGallery] = useState(product.galleryImages);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((d) => setBrands(d.brands ?? []))
      .catch(() => {});
  }, []);

  const shortDescriptionWords = countWords(form.shortDescription ?? "");
  const shortDescriptionError =
    shortDescriptionWords === 0
      ? "Short description is required"
      : shortDescriptionWords > SHORT_DESCRIPTION_MAX_WORDS
      ? `Short description must be ${SHORT_DESCRIPTION_MAX_WORDS} words or fewer`
      : null;

  const gallerySlotsLeft = MAX_GALLERY_IMAGES - keptGallery.length - newGalleryFiles.length;

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files).slice(0, gallerySlotsLeft);
    setNewGalleryFiles((prev) => [...prev, ...fileArray]);
    setNewGalleryPreviews((prev) => [...prev, ...fileArray.map((f) => URL.createObjectURL(f))]);
  };

  const removeKeptImage = (publicId: string) => {
    setKeptGallery((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const removeNewImage = (index: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (shortDescriptionError) {
      toast.error(shortDescriptionError);
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", String(form.name ?? ""));
      formData.append("price", String(form.price ?? ""));
      formData.append("originalPrice", String(form.originalPrice ?? ""));
      formData.append("stock", String(form.stock ?? ""));
      formData.append("sku", String(form.sku ?? ""));
      formData.append("shortDescription", String(form.shortDescription ?? ""));
      formData.append("description", String(form.description ?? ""));
      formData.append("sections", JSON.stringify(form.sections ?? []));
      if (form.categorySlug) formData.append("categorySlug", form.categorySlug);
      if (form.subCategorySlug) formData.append("subCategorySlug", form.subCategorySlug);
      if (form.brandId) formData.append("brandId", form.brandId);
      if (coverFile) formData.append("cover", coverFile);
      formData.append("galleryTouched", "1");
      keptGallery.forEach((img) => formData.append("keepImage", img.publicId));
      newGalleryFiles.forEach((file) => formData.append("images", file));

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
      onSave(json.product as AdminProduct);
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
          {([["name","Product Name","text"],["price","Price (KSh)","number"],["originalPrice","Original Price (KSh)","number"],["stock","Stock Level","number"],["sku","SKU","text"]] as [keyof typeof form, string, string][]).map(([field, label, type]) => (
            <div key={field} className="space-y-1">
              <label className="font-black uppercase text-xs">{label}</label>
              <input type={type} value={(form as any)[field] ?? ""} onChange={(e) => handleChange(field, type === "number" ? Number(e.target.value) : e.target.value)} className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50" />
            </div>
          ))}

          <div className="space-y-1">
            <label className="font-black uppercase text-xs">Category</label>
            <CategoryCascadeSelect
              value={{ categorySlug: form.categorySlug, subCategorySlug: form.subCategorySlug }}
              onChange={({ categorySlug, subCategorySlug }) => {
                handleChange("categorySlug", categorySlug);
                handleChange("subCategorySlug", subCategorySlug ?? "");
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="font-black uppercase text-xs">Brand <span className="text-red-500">*</span></label>
            <BrandAutocomplete
              brands={brands}
              value={form.brandId}
              onChange={(id) => handleChange("brandId", id)}
            />
          </div>

          <div className="space-y-1">
            <label className="font-black uppercase text-xs">Short Description</label>
            <textarea
              value={form.shortDescription ?? ""}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
              placeholder="A short tagline or highlights..."
              className="w-full min-h-20 p-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50"
            />
            <div className="flex items-center justify-between">
              {shortDescriptionError ? (
                <p className="text-red-600 font-bold text-[10px] italic">{shortDescriptionError}</p>
              ) : (
                <span />
              )}
              <p className="font-bold text-[10px] uppercase opacity-60">
                {shortDescriptionWords}/{SHORT_DESCRIPTION_MAX_WORDS} words
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-black uppercase text-xs">Description</label>
            <RichTextEditor
              value={form.description ?? ""}
              onChange={(html) => handleChange("description", html)}
              placeholder="Describe the product features or marketing write up..."
              minHeightClass="min-h-37.5"
            />
          </div>

          {/* Cover image */}
          <div className="space-y-2">
            <label className="font-black uppercase text-xs">Cover Image</label>
            <div className="flex gap-3 items-start">
              <div className="w-24 h-24 border-2 border-black overflow-hidden shrink-0">
                <img src={coverPreview ?? product.image} alt="cover" className="w-full h-full object-cover" />
              </div>
              <label className="flex-1 flex items-center gap-3 cursor-pointer border-4 border-dashed border-black px-4 py-3 hover:bg-cyan-50 transition-colors">
                <Upload size={18} strokeWidth={3} />
                <span className="font-bold text-sm uppercase">
                  {coverFile ? "New cover selected" : "Click to replace cover"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
              </label>
            </div>
          </div>

          {/* Gallery images */}
          <div className="space-y-2">
            <label className="font-black uppercase text-xs">Gallery Images (up to {MAX_GALLERY_IMAGES})</label>
            <div className="grid grid-cols-4 gap-2">
              {keptGallery.map((img) => (
                <div key={img.publicId} className="relative aspect-square border-2 border-black overflow-hidden">
                  <img src={img.url} alt="gallery" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeKeptImage(img.publicId)} className="absolute -top-2 -right-2 bg-red-500 border-2 border-black p-0.5">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
              {newGalleryPreviews.map((src, i) => (
                <div key={i} className="relative aspect-square border-2 border-black overflow-hidden">
                  <img src={src} alt="new gallery" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)} className="absolute -top-2 -right-2 bg-red-500 border-2 border-black p-0.5">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
              {gallerySlotsLeft > 0 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center border-4 border-dashed border-black bg-gray-50 hover:bg-cyan-50 transition-colors">
                  <Upload size={20} strokeWidth={3} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-black uppercase text-xs">Homepage Sections</label>
            <div className="flex flex-wrap gap-4">
              {PRODUCT_SECTIONS.map((section) => (
                <label key={section.value} className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sections.includes(section.value)}
                    onChange={(e) =>
                      handleChange(
                        "sections",
                        e.target.checked
                          ? [...form.sections, section.value]
                          : form.sections.filter((s) => s !== section.value)
                      )
                    }
                    className="w-4 h-4 border-2 border-black"
                  />
                  {section.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t-4 border-black bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} disabled={submitting} className="px-6 py-3 border-4 border-black font-black uppercase text-sm hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
          <button
            onClick={handleSave}
            disabled={submitting || !!shortDescriptionError}
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

// ─── Brands Section ───────────────────────────────────────────────────────────
interface BrandRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  country: string | null;
  foundedYear: number | null;
  isActive: boolean;
  logo: { url: string; publicId: string } | null;
  createdAt: string;
}

const EMPTY_BRAND_FORM = {
  name: "",
  description: "",
  website: "",
  country: "",
  foundedYear: "",
  isActive: true,
};

const BrandsSection = () => {
  const [brands, setBrands] = useState<BrandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((d) => setBrands(d.brands ?? []))
      .catch(() => toast.error("Failed to load brands"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? "Failed to delete brand"); return; }
      setBrands((prev) => prev.filter((b) => b.id !== id));
      toast.success("Brand deleted");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Brands</h1>
          <p className="font-bold text-sm text-gray-500 uppercase">{brands.length} total brands</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-8 py-4 font-black uppercase border-2 border-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
        >
          Add New Brand
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={36} className="animate-spin" />
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-16 text-center">
          <Tag size={60} strokeWidth={3} className="mx-auto mb-4 opacity-30" />
          <p className="font-black uppercase text-xl">No brands yet</p>
          <p className="font-bold text-sm text-gray-400 uppercase mt-1">Add your first brand to get started</p>
        </div>
      ) : (
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-950 text-white text-left">
                  {["Brand", "Country", "Founded", "Website", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 font-black uppercase text-[10px] tracking-widest border-r border-indigo-800 last:border-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {brand.logo ? (
                          <div className="w-10 h-10 border-2 border-black shrink-0 overflow-hidden bg-gray-50">
                            <img src={brand.logo.url} alt={brand.name} className="w-full h-full object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 border-2 border-black shrink-0 bg-orange-100 flex items-center justify-center">
                            <Tag size={16} strokeWidth={3} className="text-orange-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-black text-sm">{brand.name}</p>
                          {brand.description && (
                            <p className="text-xs text-gray-400 font-bold truncate max-w-48">{brand.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold text-xs text-gray-500 uppercase">{brand.country || "—"}</td>
                    <td className="px-5 py-3 font-bold text-xs text-gray-500">{brand.foundedYear || "—"}</td>
                    <td className="px-5 py-3 font-bold text-xs">
                      {brand.website ? (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-32 block">
                          {brand.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 border-2 border-black font-black text-[10px] uppercase ${brand.isActive ? "bg-green-200" : "bg-gray-200"}`}>
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {deleteConfirm === brand.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(brand.id)} disabled={deleting === brand.id} className="bg-red-500 text-white px-3 py-1.5 border-2 border-black font-black text-xs uppercase hover:bg-red-700 disabled:opacity-50 flex items-center gap-1">
                            {deleting === brand.id && <Loader2 size={12} className="animate-spin" />}
                            Confirm
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} disabled={deleting === brand.id} className="bg-white px-3 py-1.5 border-2 border-black font-black text-xs uppercase hover:bg-gray-100 disabled:opacity-50">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => setEditingBrand(brand)} className="p-2 border-2 border-black hover:bg-cyan-300 transition-colors"><Pencil size={14} strokeWidth={3} /></button>
                          <button onClick={() => setDeleteConfirm(brand.id)} className="p-2 border-2 border-black hover:bg-red-300 transition-colors"><Trash2 size={14} strokeWidth={3} /></button>
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

      {showAddModal && (
        <BrandFormModal
          onClose={() => setShowAddModal(false)}
          onSave={(b) => { setBrands((prev) => [b, ...prev]); setShowAddModal(false); }}
        />
      )}
      {editingBrand && (
        <BrandFormModal
          brand={editingBrand}
          onClose={() => setEditingBrand(null)}
          onSave={(b) => { setBrands((prev) => prev.map((x) => x.id === b.id ? b : x)); setEditingBrand(null); }}
        />
      )}
    </div>
  );
};

// ─── Brand Form Modal ─────────────────────────────────────────────────────────
const BrandFormModal = ({
  brand,
  onClose,
  onSave,
}: {
  brand?: BrandRecord;
  onClose: () => void;
  onSave: (b: BrandRecord) => void;
}) => {
  const isEdit = !!brand;
  const [form, setForm] = useState({
    name: brand?.name ?? "",
    description: brand?.description ?? "",
    website: brand?.website ?? "",
    country: brand?.country ?? "",
    foundedYear: brand?.foundedYear ? String(brand.foundedYear) : "",
    isActive: brand?.isActive ?? true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(brand?.logo?.url ?? null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setRemoveLogo(false);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setNameError("Brand name is required"); return; }
    setNameError("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description ?? "");
      formData.append("website", form.website ?? "");
      formData.append("country", form.country ?? "");
      formData.append("foundedYear", form.foundedYear ?? "");
      formData.append("isActive", String(form.isActive));
      if (logoFile) formData.append("logo", logoFile);
      if (isEdit && removeLogo) formData.append("removeLogo", "true");

      const url = isEdit ? `/api/brands/${brand.id}` : "/api/brands";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, body: formData });
      const json = await res.json();

      if (!res.ok) { toast.error(json.error ?? "Failed to save brand"); return; }
      toast.success(isEdit ? "Brand updated" : "Brand created");
      onSave(json.brand as BrandRecord);
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="bg-orange-300 border-b-4 border-black px-8 py-5 flex items-center justify-between sticky top-0">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            {isEdit ? "Edit Brand" : "New Brand"}
          </h2>
          <button onClick={onClose} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          {/* Logo */}
          <div className="space-y-2">
            <label className="font-black uppercase text-xs">Brand Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-4 border-black bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview && !removeLogo ? (
                  <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImagePlus size={28} className="text-gray-300" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer border-4 border-dashed border-black px-4 py-2 hover:bg-cyan-50 transition-colors font-bold text-xs uppercase">
                  <Upload size={14} strokeWidth={3} />
                  {logoFile ? "Change Logo" : isEdit && brand?.logo ? "Replace Logo" : "Upload Logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
                {(logoPreview || brand?.logo) && !removeLogo && (
                  <button
                    type="button"
                    onClick={() => { setLogoFile(null); setLogoPreview(null); setRemoveLogo(true); }}
                    className="text-xs font-black text-red-500 uppercase hover:underline text-left"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="font-black uppercase text-xs">Brand Name <span className="text-red-500">*</span></label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50"
              placeholder="e.g. Nike, Samsung, Safaricom"
            />
            {nameError && <p className="text-red-600 font-bold text-[10px] italic">{nameError}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-black uppercase text-xs">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full min-h-16 px-4 py-3 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50 resize-none"
              placeholder="Short brand description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Country */}
            <div className="space-y-1">
              <label className="font-black uppercase text-xs flex items-center gap-1"><MapPin size={10} /> Country</label>
              <input
                value={form.country ?? ""}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50"
                placeholder="e.g. Kenya"
              />
            </div>
            {/* Founded Year */}
            <div className="space-y-1">
              <label className="font-black uppercase text-xs flex items-center gap-1"><Calendar size={10} /> Founded Year</label>
              <input
                type="number"
                value={form.foundedYear ?? ""}
                onChange={(e) => handleChange("foundedYear", e.target.value)}
                className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50"
                placeholder="e.g. 1990"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-1">
            <label className="font-black uppercase text-xs flex items-center gap-1"><Globe size={10} /> Website</label>
            <input
              value={form.website ?? ""}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full h-12 px-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50"
              placeholder="https://brand.com"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-4 border-4 border-black">
            <Power size={18} strokeWidth={3} className={form.isActive ? "text-green-600" : "text-gray-400"} />
            <div className="flex-1">
              <p className="font-black uppercase text-xs">Brand Status</p>
              <p className="text-xs font-bold text-gray-500">{form.isActive ? "Active — visible in filters and product forms" : "Inactive — hidden from selection"}</p>
            </div>
            <button
              type="button"
              onClick={() => handleChange("isActive", !form.isActive)}
              className={`px-4 py-2 border-2 border-black font-black text-xs uppercase transition-colors ${form.isActive ? "bg-green-300 hover:bg-green-400" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {form.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        </div>

        <div className="px-8 py-5 border-t-4 border-black bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} disabled={submitting} className="px-6 py-3 border-4 border-black font-black uppercase text-sm hover:bg-gray-200 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 bg-orange-300 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Brand"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
