import dynamic from 'next/dynamic';

const ModernHeader = dynamic(() => import('./ModernHeader'));
const MinimalisticHeader = dynamic(() => import('./MinimalisticHeader'));

const theme = process.env.THEME || 'modern';

export default function Header() {
  // Only the "modern" theme component is ever rendered.
  return theme === 'modern' ? <ModernHeader /> : <MinimalisticHeader />;
}
