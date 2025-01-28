import { Component, OnInit } from '@angular/core';
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
import { map, Observable, startWith, switchMap } from 'rxjs';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MovieImagePipe } from '../../pipes/movie-image.pipe';
import { Actor } from '../../../../shared/interfaces/actor.interfaces';
import { ActorService } from '../../../actors/services/actor.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
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
    MovieImagePipe,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './movies-detail-page.component.html',
  styleUrl: './movies-detail-page.component.scss'
})
export class MoviesDetailPageComponent implements OnInit {

  public formMode: 'new' | 'edit' = 'new';
  public movieExist: Movie | any;

  movieForm: FormGroup;
  actorsControl = new FormControl();
  filteredActors: Observable<Actor[]> | undefined;
  selectedActors: Actor[] = [];
  allActors: Actor[] = [];


  constructor(
    private movieService: MovieService,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private actorService: ActorService,
    private dialog: MatDialog



  ) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      genre: ['', Validators.required], // Separado por comas
      director: [''],
      releaseYear: [null, [Validators.min(1900), Validators.max(new Date().getFullYear()), Validators.required]],
      rating: [null, [Validators.min(0), Validators.max(10), Validators.required]],
      mainImage: [null, Validators.required], // Imagen principal
      images: [null], // Otras imágenes
      cast: ['', Validators.required], // Actores separados por comas
    });
  }

  get currentMovie(): Movie {
    const movie = this.movieForm.value as Movie;
    return movie;
  }

  ngOnInit(): void {
    // Se obtiene la lista de actores
    this.actorService.getActors().subscribe(actors => {
      this.allActors = actors;
      this.filteredActors = this.actorsControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterActors(value || ''))
      );
    });

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

        // Recuperar los actores seleccionados
        this.selectedActors = movie.cast.map(actorName => {
          return this.allActors.find(actor => actor.name === actorName);
        }).filter(actor => actor !== undefined); // Filtrar actores no encontrados

        this.updateCastInForm(); // Actualizar el formulario con los actores seleccionados

        console.log('Película cargada:', movie);
        console.log('Actores seleccionados:', this.selectedActors);
      });
  }

  filterActors(value: string): Actor[] {
    const filterValue = value.toLowerCase() || '';
    return this.allActors.filter(actor => actor.name.toLowerCase().includes(filterValue));
  }

  displayActorName(actor: Actor): string {
    return actor?.name || '';
  }

  onActorSelect(actorName: string): void {
    if (actorName && !this.selectedActors.some(actor => actor.name === actorName)) {
      const selectedActor = this.allActors.find(actor => actor.name === actorName);
      if (selectedActor) {
        this.selectedActors.push(selectedActor);
        this.updateCastInForm();
        this.actorsControl.setValue(''); // Limpiar el campo de entrada
      }
    }
  }

  isActorSelected(actor: Actor): boolean {
    return this.selectedActors.includes(actor);
  }

  removeActor(actor: Actor): void {
    this.selectedActors = this.selectedActors.filter(selected => selected !== actor);
    this.updateCastInForm();
  }

  updateCastInForm(): void {
    const actorNames = this.selectedActors.map(actor => actor.name);
    this.movieForm.get('cast')?.setValue(actorNames);
  }

  // Maneja el evento de selección de imagen y actualiza el formulario con las imágenes seleccionadas.
  onImageSelect(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.movieForm.patchValue({ [field]: Array.from(input.files) });
    }
  };

  onSubmit(): void {
    const movieData = { ...this.movieForm.value };

    movieData.genre = (movieData.genre || '').split(',').map((g: string) => g.trim());
    //movieData.cast = (movieData.cast || '').split(',').map((c: string) => c.trim());
    movieData.cast = this.selectedActors.map(actor => actor.name);


    if (this.formMode === 'new') {
      // Revisar si el título de la película ya existe
      this.movieService.getMovieExists(movieData.title).subscribe(exists => {
        if (exists) {
          this.snackbar.open('El título de la película ya existe', 'Cerrar', {
            duration: 3000,
          });
          return;
        }
        this.movieService.createMovie(movieData).subscribe({
          next: (response) => {
            this.snackbar.open('Película creada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['/movies']);
          },
          error: (error) => console.error('Error al crear la película:', error),
        });
      });
    } else {
      const originalTitle = this.activatedRoute.snapshot.params['title'];
      // Revisar si el título de la película ya existe
      this.movieService.getMovieExists(movieData.title).subscribe(exists => {
        if (exists && movieData.title !== originalTitle) {
          this.snackbar.open('El título de la película ya existe', 'Cerrar', {
            duration: 3000,
          });
          return;
        }
        this.movieService.updateMovie(movieData, originalTitle).subscribe({
          next: (response) => {
            this.snackbar.open('Película actualizada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['/movies']);
          },
          error: (error) => console.error('Error al actualizar la película:', error),
        });
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
