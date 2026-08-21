"use client";

import Link from "next/link";

type BreadcrumbsProps = {
  routes?: string[];
};

export function Breadcrumbs({ routes = [] }: BreadcrumbsProps) {
  if (routes.length === 0) {
    // Return a default Home link or null if no routes are provided
    return (
      <nav aria-label="breadcrumb">
        <ol className="flex items-center space-x-1 text-sm">
          <li>
            <Link href="/" className="text-gray-500 hover:underline">
              Home
            </Link>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <Link href="/" className="text-gray-500 hover:underline">
            Home
          </Link>
        </li>
        {routes.map((route, index) => {
          const isLast = index === routes.length - 1;
          // Ensure path starts with a slash if it's not just the root
          const pathSegments = routes.slice(0, index + 1);
          const path = `/${pathSegments.join("/")}`;
          const displayName = route.charAt(0).toUpperCase() + route.slice(1);

          return (
            <li key={route} className="flex items-center">
              <span className="mx-1 text-gray-400">/</span>
              {isLast ? (
                <span className="font-medium text-gray-700">
                  {displayName}
                </span>
              ) : (
                <Link href={path} className="text-gray-500 hover:underline">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
