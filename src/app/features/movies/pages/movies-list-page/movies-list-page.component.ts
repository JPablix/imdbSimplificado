import { Component } from '@angular/core';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movies-list-page',
  imports: [
    CommonModule,
    MovieCardComponent,
    RouterModule
  ],
  templateUrl: './movies-list-page.component.html',
  styleUrl: './movies-list-page.component.scss'
})
export class MoviesListPageComponent {
  public movies: Movie[] = [];
  public paginatedMovies: Movie[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public pageSizeOptions: number[] = [5, 10, 15, 20, 50];

  constructor(
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    console.log('MoviesListPageComponent initialized');
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
      this.totalItems = movies.length;
      this.updatePaginatedMovies();
    });
  }

  updatePaginatedMovies(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMovies = this.movies.slice(startIndex, endIndex);
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(selectElement.value);
    this.currentPage = 1;  // Volver a la primera página
    this.updatePaginatedMovies();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedMovies();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
