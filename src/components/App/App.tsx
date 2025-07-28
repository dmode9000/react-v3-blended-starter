import { useState, useEffect } from "react";

import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import toast, { Toaster } from "react-hot-toast";
import { getPhotos } from "../../services/photos";
import type { Photo } from "../../types/photo";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";

interface ModalContent {
  src: string;
  alt: string;
}

export default function App() {
  //const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getPhotos(searchQuery);
      if (response.length === 0) {
        toast.error("No images found for your query.");
      }
      setPhotos(response);
      console.log(response);
    } catch (error) {
      setIsError(true);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (src: string, alt: string) => {
    setModalContent({ src, alt });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSearch} />
          {isLoading && <Loader />}
          {photos.length > 0 && <PhotosGallery photos={photos} openModal={openModal} />}
          {modalContent && (
            <Modal onClose={closeModal}>
              <img src={modalContent.src} alt={modalContent.alt} />
            </Modal>
          )}
        </Container>
      </Section>
      <Toaster position="top-right" />
    </>
  );
}
