export interface Movie {
  title: string;
  description?: string;
  genre: string[]; // Array de géneros
  director?: string;
  releaseYear?: number;
  rating?: number;
  mainImage: string; // URL de la imagen principal
  images: string[]; // Arreglo de URLs de imágenes
  cast?: string[]; // Arreglo de actores
}