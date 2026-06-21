import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapAdminProduct } from "@/lib/map-product";
import ProductDashboard from "@/components/admin/products";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const products = session
    ? await prisma.product.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { category: true, subCategory: true },
      })
    : [];

  return <ProductDashboard initialProducts={products.map(mapAdminProduct)} />;
}
