import { Component, input } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MovieImagePipe } from '../../pipes/movie-image.pipe';

@Component({
  selector: 'app-movies-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MovieImagePipe
  ],
  templateUrl: './movies-detail-page.component.html',
  styleUrl: './movies-detail-page.component.scss'
})
export class MoviesDetailPageComponent {
  
  public formMode : 'new' | 'edit' = 'new';
  movieForm: FormGroup;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
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

  get currentMovie(): Movie {
    const movie = this.movieForm.value as Movie;
    return movie;
  }
  
  ngOnInit(): void {  
    if (!this.router.url.includes('edit')) {
        return;
    }
    this.formMode = 'edit';

    // Estamos en modo edición entonces cargamos la película a editar
    this.activatedRoute.params
        .pipe(
            switchMap(({ title }) => this.movieService.getMovieByTitle(title))
        )
        .subscribe(movie => {
            if (!movie) {
                this.router.navigateByUrl('/');
                return;
            }

            movie.genre = movie.genre || [];
            movie.cast = movie.cast || [];

            this.movieForm.patchValue({
                ...movie,
                genre: movie.genre.join(', '), // Convierte el array a una cadena
                cast: movie.cast.join(', ')      // Convierte el array a una cadena
            });
        });
  }

  onImageSelect(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.movieForm.patchValue({ [field]: Array.from(input.files) });
    }
  };

  onSubmit(): void {
    const movieData = { ...this.movieForm.value };

    movieData.genre = (movieData.genre || '').split(',').map((g: string) => g.trim());
    movieData.cast = (movieData.cast || '').split(',').map((c: string) => c.trim());

    console.log(movieData);

    if (this.formMode === 'edit') {
        const originalTitle = this.activatedRoute.snapshot.params['title'];
        this.movieService.updateMovie(movieData, originalTitle).subscribe({
            next: (response) => {
                this.snackbar.open('Película actualizada con éxito', 'Cerrar', {
                    duration: 3000,
                });
                this.router.navigate(['/movies']);
            },
            error: (error) => console.error('Error al actualizar la película:', error),
        });
    } else {
        this.movieService.createMovie(movieData).subscribe({
            next: (response) => {
                this.snackbar.open('Película creada con éxito', 'Cerrar', {
                    duration: 3000,
                });
                this.router.navigate(['/movies']);
            },
            error: (error) => console.error('Error al crear la película:', error),
        });
    }
  }

  onDelete(): void {
    const originalTitle = this.activatedRoute.snapshot.params['title'];
    this.movieService.deleteMovie(originalTitle).subscribe({
      next: (response) => {
        this.snackbar.open('Película eliminada con éxito', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/movies']);
      },
      error: (error) => console.error('Error al eliminar la película:', error),
    });
  }

}
