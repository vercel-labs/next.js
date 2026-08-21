'use client';
import { useState, useEffect } from 'react';
import styles from './footer.module.css';

export const Footer = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return (
    <div id="footer" className={styles.footer}>
      {isHydrated ? 'hydrated' : 'ssr'} Footer
    </div>
  );
};
