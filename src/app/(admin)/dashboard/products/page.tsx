import { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapAdminProduct } from "@/lib/map-product";
import ProductDashboard from "@/components/admin/products";

export const metadata: Metadata = {
  title: "Vendor | Product Page",
  description:
    "Securely access your Swiftsoko account to manage orders and checkout.",
};

export default async function AdminProductPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const products = session
    ? await prisma.product.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { category: true, subCategory: true },
      })
    : [];

  return (
    <div className="relative min-h-screen flex flex-col border-red-500">
      <ProductDashboard initialProducts={products.map(mapAdminProduct)} />
    </div>
  );
}
