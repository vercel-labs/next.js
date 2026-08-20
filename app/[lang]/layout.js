export function generateStaticParams() {
  return ['en', 'de'].map((lang) => ({ lang }));
}

export default function LangLayout({ children }) {
  return children;
}
