export default function MainGroupPage() {
  return (
    <div>
      <h1 className="text-lg font-bold">Welcome to the (Main) Group Home Page!</h1>
      <p>This page is at the root of the (main) group.</p>
      <p>The route for this page is effectively `/main-group-page` due to how Next.js handles route groups and index pages, or just `/` if it's the only content.</p>
      <p>For this repro, we'll assume it maps to `/main-group-page` for clarity in links.</p>
    </div>
  );
}

// To make this page accessible at /main-group-page,
// we might need a rewrite or ensure no other page.tsx is at the root of (main)
// or structure it as (main)/main-group-page/page.tsx.
// For simplicity of the repro, we'll link to /main-group-page and assume
// Next.js resolves (main)/page.tsx to it if no other conflicting route exists.
// Or, more robustly, create (main)/main-group-page/page.tsx
