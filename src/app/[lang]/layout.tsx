export const dynamicParams = true;

export function generateStaticParams() {
  return [
    { lang: 'en-US' },
    { lang: 'nl-NL' },
  ];
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
