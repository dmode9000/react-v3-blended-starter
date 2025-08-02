// React
import { useState, useCallback } from "react";

// Libraries
import { BarLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

// Components
import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";

// Services
import { getPhotos } from "../../services/photos";

// Types
import type { Photo } from "../../types/photo";

// Styles
import appStyles from "./App.module.css";

/**
 * @interface ModalContent
 * @description Визначає структуру об'єкта, що передається в модальне вікно.
 * @property {string} src - URL повнорозмірного зображення.
 * @property {string} alt - Текстовий опис зображення.
 */
interface ModalContent {
  src: string;
  alt: string;
}

// Головний компонент застосунку
export default function App() {
  // --- Секція стану (State) ---
  // Стан для індикатора завантаження. `true`, коли йде запит до API.
  const [isLoading, setIsLoading] = useState(false);
  // Стан для відстеження помилок. `true`, якщо запит до API завершився помилкою.
  const [isError, setIsError] = useState(false);
  // Зберігає текстове повідомлення про помилку для показу користувачу.
  const [errorMessage, setErrorMessage] = useState("");
  // Основний стан, де зберігається масив об'єктів із фотографіями, отриманими від API.
  const [photos, setPhotos] = useState<Photo[]>([]);
  // Стан для модального вікна. Містить дані для показу (src, alt) або `null`, якщо вікно закрите.
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  // Стан, що відповідає за показ спінера в модальному вікні, поки завантажується велике зображення.
  const [isModalLoading, setIsModalLoading] = useState(false);

  // --- Секція функцій-обробників ---
  /**
   * @function handleSearch
   * @description Асинхронна функція для пошуку зображень. Викликається при відправці форми.
   * @param {string} searchQuery - Пошуковий запит, введений користувачем.
   */
  const handleSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true); // Показати індикатор завантаження
    setIsError(false); // Скинути попередній стан помилки

    try {
      // Виклик функції сервісу для отримання фото
      const response: Photo[] = await getPhotos(searchQuery);
      // Якщо API не повернуло результатів, повідомити користувача
      if (response.length === 0) {
        toast.error("Зображень за вашим запитом не знайдено.");
      }
      // Оновити стан з отриманими фото
      setPhotos(response);
    } catch (error) {
      // У разі помилки, оновити відповідні стани
      setIsError(true);
      toast.error("Щось пішло не так. Спробуйте ще раз.");
      // Перевіряю, чи є `error` екземпляром класу `Error`, щоб безпечно отримати `message`
      setErrorMessage(error instanceof Error ? error.message : "Сталася невідома помилка.");
    } finally {
      // У будь-якому випадку, прибрати індикатор завантаження після завершення запиту
      setIsLoading(false);
    }
  }, []);

  /**
   * @function openModal
   * @description Відкрию модальне вікно, передаючи в стан дані зображення.
   * @param {string} src - URL великого зображення.
   * @param {string} alt - Опис зображення.
   */
  const openModal = useCallback((src: string, alt: string) => {
    setModalContent({ src, alt });
    setIsModalLoading(true); // Вмикаю спінер, поки зображення не завантажиться
  }, []);

  /**
   * @function closeModal
   * @description Закриває модальне вікно, очищуючи його стан.
   */
  const closeModal = useCallback(() => {
    setModalContent(null);
  }, []);

  /**
   * @function handleModalImageLoad
   * @description Викликається, коли зображення в модальному вікні повністю завантажилось.
   */
  const handleModalImageLoad = useCallback(() => {
    setIsModalLoading(false); // Вимикаю спінер
  }, []);

  // --- Секція рендерингу (JSX) ---
  return (
    <>
      <Section>
        <Container>
          {/* Форма пошуку, яка при відправці викликає handleSearch */}
          <Form onSubmit={handleSearch} />

          {/* Умовний рендеринг: показую Loader, тільки коли isLoading === true */}
          {isLoading && <Loader />}

          {/* Показую повідомлення про помилку, тільки коли isError === true */}
          {isError && (
            <Text textAlign="center" marginBottom="20">
              ❌ {errorMessage}
            </Text>
          )}

          {/* Показую галерею, тільки якщо масив photos не порожній */}
          {photos.length > 0 && <PhotosGallery photos={photos} openModal={openModal} />}

          {/* Показую модальне вікно, тільки якщо в modalContent є дані */}
          {modalContent && (
            <Modal onClose={closeModal}>
              <div className={appStyles.modalContentWrapper}>
                {/* Поки завантажується велике фото, показую спінер */}
                {isModalLoading && (
                  <div className={appStyles.spinnerOverlay}>
                    <BarLoader color={"#ffffff"} />
                  </div>
                )}
                <img
                  src={modalContent.src}
                  alt={modalContent.alt}
                  onLoad={handleModalImageLoad} // Викликаю функцію після завантаження
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            </Modal>
          )}
        </Container>
      </Section>

      {/* Компонент для відображення спливаючих повідомлень (тостів) */}
      <Toaster position="top-right" />
    </>
  );
}
