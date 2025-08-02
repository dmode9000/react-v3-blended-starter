// React
import { memo } from "react";

// Components
import Grid from "../Grid/Grid";
import GridItem from "../GridItem/GridItem";
import PhotosGalleryItem from "../PhotosGalleryItem/PhotosGalleryItem";

// Types
import type { Photo } from "../../types/photo";

interface PhotosGalleryProps {
  photos: Photo[];
  openModal: (src: string, alt: string) => void;
}

function PhotosGallery({ photos, openModal }: PhotosGalleryProps) {
  console.log("PhotosGallery: рендериться");
  return (
    <Grid>
      {photos.map(({ id, src, alt, avg_color }) => (
        <GridItem key={id}>
          <PhotosGalleryItem src={src.small} alt={alt} avgColor={avg_color} onClick={() => openModal(src.large, alt)} />
        </GridItem>
      ))}
    </Grid>
  );
}

export default memo(PhotosGallery);
