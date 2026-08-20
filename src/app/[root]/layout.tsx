export interface RootLayoutProps {
  children: React.ReactNode;
  category: React.ReactNode;
  workspace: React.ReactNode;
  params: Promise<{
    root: string;
  }>;
}

export default async function RootLayout({
  category,
  workspace,
  params,
}: RootLayoutProps) {
  const { root } = await params;
  const slug = decodeURIComponent(root);
  return slug[0] === "@" ? workspace : category;
}
