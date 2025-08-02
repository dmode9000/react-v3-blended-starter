// React
import { useState } from "react";

// Libraries
import { PuffLoader } from "react-spinners";

// Styles
import styles from "./PhotosGalleryItem.module.css";

interface Props {
  src: string;
  alt: string;
  avgColor: string;
  onClick: () => void;
}

export default function PhotosGalleryItem({ src, alt, avgColor, onClick }: Props) {
  const [isImgLoading, setIsImgLoading] = useState(true);
  const handleImageLoad = () => {
    setIsImgLoading(false);
  };

  return (
    <>
      <div
        className={styles.thumb}
        style={{
          backgroundColor: avgColor,
          borderColor: avgColor,
        }}
        onClick={onClick}
      >
        {isImgLoading && (
          <div className={styles.spinnerOverlay}>
            <PuffLoader color="white" size={60} />
          </div>
        )}
        <img src={src} alt={alt} onLoad={handleImageLoad} loading="lazy" />
      </div>
    </>
  );
}
