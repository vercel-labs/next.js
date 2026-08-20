// `auto` is documented as the default value of the `dynamic` segment config,
// but exporting it explicitly opts the route into dynamic rendering.
export const dynamic = 'auto';

export default function Page() {
  return <p>dynamic = auto</p>;
}