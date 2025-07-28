import Grid from "../Grid/Grid";
import GridItem from "../GridItem/GridItem";
import PhotosGalleryItem from "../PhotosGalleryItem/PhotosGalleryItem";
import type { Photo } from "../../types/photo";

interface PhotosGalleryProps {
  photos: Photo[];
  openModal: (src: string, alt: string) => void;
}

export default function PhotosGallery({ photos, openModal }: PhotosGalleryProps) {
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
