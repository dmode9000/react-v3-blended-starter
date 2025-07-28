import axios from "axios";

const API_KEY = "563492ad6f9170000100000108dc2880626e4436b3634ce1cf6b4d74";
axios.defaults.baseURL = "https://api.pexels.com/v1/";
axios.defaults.headers.common["Authorization"] = API_KEY;
axios.defaults.params = {
  orientation: "landscape",
};

// У відповіді від API приходить масив об'єктів, в яких тобі цікаві лише наступні властивості.
interface Photo {
  id: string; // унікальний ідентифікатор
  avg_color: string; // колір фотографії,
  alt: string; // опис фото,
  src: {
    // об'єкт з розмірами картинок, нам цікаві розміри large та original.
    large: string;
    original: string;
  };
}

export const getPhotos = async (query: string): Promise<Photo[]> => {
  const response = await axios.get(`search?query=${query}`);

  return response.data.photos;
};
