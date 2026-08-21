import styles from './card.module.css';

export default function Card({ className }: { className?: string }) {
  return <div id="square" className={`${styles.square} ${className ?? ''}`} />;
}
