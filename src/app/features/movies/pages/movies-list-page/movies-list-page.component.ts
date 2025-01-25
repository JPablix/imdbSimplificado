import { Component } from '@angular/core';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-movies-list-page',
  imports: [
    CommonModule,
    MovieCardComponent
  ],
  templateUrl: './movies-list-page.component.html',
  styleUrl: './movies-list-page.component.scss'
})
export class MoviesListPageComponent {
  public movies: Movie[] = [];

  constructor(
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    console.log('MoviesListPageComponent initialized');
    this.movieService.getMovies()
    .subscribe(movies => this.movies = movies);
  }
}
