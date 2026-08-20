import { CarouselButton } from "@segments/carousel";
import styles from "./teaser.module.css";

export const Teaser = () => (
  <div className={styles.teaser}>
    <h2>Teaser Component</h2>
    <CarouselButton className={styles.teaserCarouselButton} />
  </div>
);
