export interface Actor {
  name: string;
  dateOfBirth?: string;
  biography?: string;
  mainImage: string; // URL de la imagen principal
  images: string[]; // Arreglo de URLs de imágenes
  movies?: string[]; // Arreglo de peliculas
}