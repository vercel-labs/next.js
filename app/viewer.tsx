'use client';
import { useEffect } from 'react';

export default function Viewer() {
  useEffect(() => {
    import('cesium').then((Cesium) => {
      console.log('cesium loaded', Object.keys(Cesium).length, 'exports');
    });
  }, []);
  return <div id="cesiumContainer" />;
}
