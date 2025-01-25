import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-movies-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './movies-detail-page.component.html',
  styleUrl: './movies-detail-page.component.scss'
})
export class MoviesDetailPageComponent {
  
  movieForm: FormGroup;

  constructor(
    private movieService: MovieService,
    private fb: FormBuilder
  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      genre: ['', Validators.required], // Separado por comas
      director: [''],
      releaseYear: [null, [Validators.min(1900), Validators.max(new Date().getFullYear())]],
      rating: [null, [Validators.min(0), Validators.max(10)]],
      mainImage: [null, Validators.required], // Imagen principal
      images: [null], // Otras imágenes
      cast: [''], // Actores separados por comas
    });
  }

  onImageSelect(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.movieForm.patchValue({ [field]: Array.from(input.files) });
    }
  }

  onSubmit(): void {
    const movieData = { ...this.movieForm.value };
    movieData.genre = movieData.genre.split(',').map((g: string) => g.trim());
    movieData.cast = movieData.cast.split(',').map((c: string) => c.trim());
    console.log(movieData); // Aquí puedes integrar con tu servicio para enviar el formulario

    this.movieService.createMovie(movieData).subscribe({
      next: (response) => console.log('Película creada:', response),
      error: (error) => console.error('Error al crear la película:', error),
    });
    
  }
}
