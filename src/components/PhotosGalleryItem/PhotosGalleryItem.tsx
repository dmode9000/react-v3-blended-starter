import GridItem from "../GridItem/GridItem";

import styles from "./PhotosGalleryItem.module.css";

export default function PhotosGalleryItem({ src, alt, avgColor, onClick }) {
  return (
    // <GridItem>
    <>
      <div
        className={styles.thumb}
        style={{
          backgroundColor: avgColor,
          borderColor: avgColor,
        }}
        onClick={onClick}
      >
        <img src={src} alt={alt} />
      </div>
    </>
    // </GridItem>
  );
}
