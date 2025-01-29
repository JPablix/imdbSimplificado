import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Actor } from '../../interfaces/actor.interfaces';
import { Movie } from '../../interfaces/movie.interfaces';
import { MovieService } from '../../../features/movies/services/movie.service';
import { ActorService } from '../../../features/actors/services/actor.service';
import { map, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActorCardComponent } from '../../../features/actors/components/actor-card/actor-card.component';
import { MovieCardComponent } from '../../../features/movies/components/movie-card/movie-card.component';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ActorCardComponent,
    MovieCardComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchForm: FormGroup;
  searchTypeOptions: string[] = ['Actores', 'Películas'];
  filteredActors: Observable<Actor[]> | undefined;
  filteredMovies: Observable<Movie[]> | undefined;
  filteredGenres: Observable<string[]> | undefined;
  filteredRatings: Observable<number[]> | undefined;
  filteredYears: Observable<number[]> | undefined;

  directActor: Actor | undefined;
  directMovie: Movie | undefined;
  someMovies: Movie[] = [];

  actors: Actor[] = [];
  movies: Movie[] = [];
  genres: string[] = [];
  ratings: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private actorService: ActorService
  ) {
    this.searchForm = this.fb.group({
      searchType: ['Actores'], // Por defecto, buscará actores
      actorName: [''],
      movieName: [''],
      movieGenre: [''],
      movieRating: [''],
      movieYear: ['']
    });
  }

  ngOnInit(): void {
    // Obtener actores y películas al iniciar
    this.actorService.getActors().subscribe((actors) => (this.actors = actors));
    this.movieService.getMovies().subscribe((movies) => {
      this.movies = movies;
      this.genres = this.extractGenres(movies);
    });
    

    // Filtros para actores
    this.filteredActors = this.searchForm.get('actorName')!.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterActors(value))
    );

    // Filtros para películas por nombre
    this.filteredMovies = this.searchForm.get('movieName')!.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterMovies(value))
    );

    // Filtros para géneros
    this.filteredGenres = this.searchForm.get('movieGenre')!.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterGenres(value))
    );

    // Escuchar cambios en el campo de año
    this.searchForm.get('movieYear')!.valueChanges.subscribe((year) => {
      if (year) {
        this.onYearSelected(year);
      }
    });
  }

  // Filtra actores por nombre
  filterActors(value: string): Actor[] {
    const filterValue = value.toLowerCase();
    return this.actors.filter((actor) =>
      actor.name.toLowerCase().includes(filterValue)
    );
  }

  // Filtra películas por nombre
  filterMovies(value: string): Movie[] {
    const filterValue = value.toLowerCase();
    return this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(filterValue)
    );
  }

  // Filtra géneros
  filterGenres(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.genres.filter((genre) =>
      genre.toLowerCase().includes(filterValue)
    );
  }


    
  

  // Extrae géneros únicos de las películas
  extractGenres(movies: Movie[]): string[] {
    const genres = new Set<string>();
    movies.forEach((movie) => movie.genre.forEach((g) => genres.add(g)));
    return Array.from(genres);
  }

  // Selecciona un actor
  onActorSelected(actor: Actor): void {
    this.clearFiltered();
    console.log('Actor seleccionado:', actor);
    this.directActor = actor;
  }

  // Selecciona una película
  onMovieSelected(movie: Movie): void {
    this.clearFiltered(['movieGenre', 'movieRating', 'movieYear']);
    this.clearFiltered();
    console.log('Película seleccionada:', movie);
    this.directMovie = movie;
  }

  // Selecciona un género como filtro 
  onGenreSelected(genre: string): void {
    this.clearFiltered(['movieName', 'movieRating', 'movieYear']);
    console.log('Género seleccionado:', genre);
    this.someMovies = this.movies.filter((movie) => movie.genre.includes(genre));
  }

  // Selecciona un rating como filtro
  onRatingSelected(rating: number): void {
    this.clearFiltered(['movieName', 'movieGenre', 'movieYear']);
    console.log('Rating seleccionado:', rating);
    this.someMovies = this.movies.filter((movie) =>
      movie.rating && (movie.rating)! === rating);
  }

  // Selecciona un año como filtro
  onYearSelected(year: number): void {
    this.clearFiltered(['movieName', 'movieGenre', 'movieRating']);
    console.log('Año seleccionado:', year);
    this.someMovies = this.movies.filter((movie) => movie.releaseYear === year);
  }

  // Limpia las películas filtradas
  clearFiltered(filters?: string[]): void {
    this.someMovies = [];
    this.directActor = undefined;
    this.directMovie = undefined;
    if (filters) {
      filters.forEach((f) => this.searchForm.get(f)!.setValue(''));
    }
  }

  get actorNameControl(): FormControl {
    return this.searchForm.get('actorName') as FormControl;
  }
  
  get movieNameControl(): FormControl {
    return this.searchForm.get('movieName') as FormControl;
  }
  
  get movieGenreControl(): FormControl {
    return this.searchForm.get('movieGenre') as FormControl;
  }
  
  get movieRatingControl(): FormControl {
    return this.searchForm.get('movieRating') as FormControl;
  }

  get searchTypeControl(): FormControl {
    return this.searchForm.get('searchType') as FormControl;
  }

  get movieYearControl(): FormControl {
    return this.searchForm.get('movieYear') as FormControl;
  }
}
