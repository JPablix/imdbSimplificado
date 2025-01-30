import { Component } from '@angular/core';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-movies-list-page',
  imports: [
    CommonModule,
    MovieCardComponent,
    RouterModule,
    MatIconModule
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
  public sortOrder: 'asc' | 'desc' = 'asc';
  private sortBy: keyof Movie = 'title';

  constructor(
    private movieService: MovieService,
    public authService: AuthService,
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

  sortMovies(by: keyof Movie): void {
    this.sortBy = by;
    this.movies.sort((a, b) => {
      // Obtener los valores de las propiedades
      const valueA = a[by];
      const valueB = b[by];

      // Comprobar si los valores son undefined
      if (valueA === undefined || valueB === undefined) {
        return 0; // O el comportamiento que prefieras si hay undefined
      }

      // Comparar los valores
      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    this.updatePaginatedMovies();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    if (this.sortBy) {
      this.sortMovies(this.sortBy);
    }
  }
}
