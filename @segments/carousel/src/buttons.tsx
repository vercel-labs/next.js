import styles from "./button.module.css";

export const CarouselButton = ({ className = "" }) => (
  <button className={styles.button + (className ? ` ${className}` : "")}>
    Carousel Button
  </button>
);
