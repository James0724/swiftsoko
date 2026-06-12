import { Metadata } from "next";
import ProductDashboard from "@/components/admin/products";

export const metadata: Metadata = {
  title: "Vendor | Product Page",
  description:
    "Securely access your Swiftsoko account to manage orders and checkout.",
};

export default function AdminProductPage() {
  return (
    <div className="relative min-h-screen flex flex-col border-red-500">
      <ProductDashboard />
    </div>
  );
}
