import { Breadcrumbs } from "@/components/breadcrumbs";

type Props = {
  params: Promise<{
    catchAll: string[];
  }>;
};

export default async function CatchAllBreadcrumbPage({ params }: Props) {
  const { catchAll } = await params;
  const routes = Array.isArray(catchAll) ? catchAll : [catchAll];
  console.log(`Rendering @breadcrumb/[...catchAll]/page.tsx for: ${routes.join("/")}`);
  return <Breadcrumbs routes={routes} />;
}
