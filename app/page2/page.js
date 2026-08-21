import CookieSetter from '../cookie-setter';
import BackButton from '../back-button';

export default function Page2() {
  return (
    <div style={{ height: 2000, background: 'linear-gradient(#fff, #ccf)' }}>
      <h1 id="page2-title">Page2 (2000px tall)</h1>
      <CookieSetter />
      <BackButton />
    </div>
  );
}
