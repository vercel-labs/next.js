import Cycler from "@/app/cycler";

export default function Dog() {
  return <Cycler />;
}

export function generateStaticParams() {
  return [1, 2, 3].map((slug) => ({ slug: String(slug) }));
}
