import { getSingleton } from '@/lib/singleton';

export default function SingletonPage() {
  const value = getSingleton();
  return (
    <div>
      <h1>singleton value: {String(value)}</h1>
      {value === null ? <p id="broken">BROKEN: layout module state was lost</p> : <p id="ok">OK</p>}
    </div>
  );
}
