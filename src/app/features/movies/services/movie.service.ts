import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Movie } from '../../../shared/interfaces/movie.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private url = environment.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getMovies(): Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(`${this.url}/movies`);
  }

  getMovieByTitle(title: string): Observable<Movie | undefined>{
    return this.httpClient.get<Movie>(`${this.url}/movies/${title}`)
      .pipe(
        catchError( err =>  of(undefined))
        )
      ;
  }

  createMovie(movieData: any): Observable<Movie> {
    const formData = new FormData();

    // Añadir datos principales
    formData.append('title', movieData.title);
    formData.append('description', movieData.description || '');
    formData.append('genre', JSON.stringify(movieData.genre));
    formData.append('director', movieData.director || '');
    formData.append('releaseYear', movieData.releaseYear.toString());
    formData.append('rating', movieData.rating.toString());
    formData.append('cast', JSON.stringify(movieData.cast));

    // Subir imagen principal
    if (movieData.mainImage && movieData.mainImage[0]) {
      formData.append('mainImage', movieData.mainImage[0]);
    }

    // Subir otras imágenes
    if (movieData.images && movieData.images.length) {
      movieData.images.forEach((image: File) => {
        formData.append('images', image);
      });
    }

    return this.httpClient.post<Movie>(`${this.url}/movies`, formData);
  }

  updateMovie(movieData: any, originalTitle: string): Observable<Movie> {
    const formData = new FormData();

    // Añadir datos principales
    formData.append('title', movieData.title);
    formData.append('description', movieData.description || '');
    formData.append('genre', JSON.stringify(movieData.genre));
    formData.append('director', movieData.director || '');
    formData.append('releaseYear', movieData.releaseYear.toString());
    formData.append('rating', movieData.rating.toString());
    formData.append('cast', JSON.stringify(movieData.cast));

    // Subir imagen principal
    if (movieData.mainImage && movieData.mainImage[0]) {
      formData.append('mainImage', movieData.mainImage[0]);
    }

    // Subir otras imágenes
    if (movieData.images && movieData.images.length) {
      movieData.images.forEach((image: File) => {
        formData.append('images', image);
      });
    }

    return this.httpClient.put<Movie>(`${this.url}/movies/${originalTitle}`, formData);
  }


  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image); // El campo debe coincidir con el backend

    return this.httpClient.post(`${this.url}/movies/upload`, formData);
  }

  getImageUrl(filename: string): string {
    return `${this.url}/uploads/movies/${filename}`;
  }

  uploadMovie(movieData: { movie: Movie; images: File[] }): Observable<Movie> {
    const formData = new FormData();
  
    // Agregar campos al FormData
    Object.keys(movieData.movie).forEach((key) => {
      if (key === 'images' || key === 'mainImage') return; // Las imágenes se manejan aparte
      formData.append(key, JSON.stringify(movieData.movie[key as keyof Movie]));
    });
  
    // Agregar la imagen principal
    if (movieData.images.length > 0) {
      formData.append('mainImage', movieData.images[0]); // Usar la primera imagen como principal
    }
  
    // Agregar las demás imágenes
    movieData.images.slice(1).forEach((image) => {
      formData.append('images', image);
    });
  
    return this.httpClient.post<Movie>(`${this.url}/movies`, formData);
  }

  deleteMovie(title: string): Observable<Movie> {
    return this.httpClient.delete<Movie>(`${this.url}/movies/${title}`);
  }

}
