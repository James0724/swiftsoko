import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapAdminProduct } from "@/lib/map-product";
import ProductDashboard from "@/components/admin/products";

export const metadata: Metadata = {
  title: "Admin | Products",
  description: "Manage all products listed on Swiftsoko.",
};

export default async function AdminProductPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, subCategory: true, brand: true },
  });

  return (
    <div className="relative min-h-screen flex flex-col border-red-500">
      <ProductDashboard initialProducts={products.map(mapAdminProduct)} />
    </div>
  );
}
