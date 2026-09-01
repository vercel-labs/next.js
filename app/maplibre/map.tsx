'use client';
import { useEffect, useRef, useState } from 'react';
import { Map as MlMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapView() {
  const ref = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<string[]>([]);
  useEffect(() => {
    if (!ref.current) return;
    const log = (e: string) => setEvents((p) => (p.includes(e) ? p : [...p, e]));
    const map = new MlMap({
      container: ref.current,
      style: {
        version: 8,
        sources: {},
        layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#88c' } }],
      },
      center: [0, 0],
      zoom: 2,
    });
    for (const ev of ['style.load', 'load', 'idle', 'render'] as const) map.on(ev, () => log(ev));
    map.on('error', (e) => log('error: ' + String((e as any)?.error?.message)));
    return () => map.remove();
  }, []);
  return (
    <>
      <div ref={ref} style={{ width: 600, height: 400 }} />
      <pre id="events">{events.join('\n')}</pre>
    </>
  );
}
