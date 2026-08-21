import { Breadcrumbs } from "@/components/breadcrumbs";

export default function DefaultBreadcrumb() {
  console.log("Rendering @breadcrumb/default.tsx");
  // Return a minimal breadcrumb, e.g., just "Home"
  return <Breadcrumbs routes={[]} />;
}
