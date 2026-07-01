import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapAdminProduct } from "@/lib/map-product";
import ProductDashboard from "@/components/admin/products";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, subCategory: true, brand: true },
  });

  return <ProductDashboard initialProducts={products.map(mapAdminProduct)} />;
}
