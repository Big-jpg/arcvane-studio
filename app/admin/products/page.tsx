// app/admin/products/page.tsx
// The editable product catalogue lives at /admin-lite/products.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  redirect("/admin-lite/products");
}
