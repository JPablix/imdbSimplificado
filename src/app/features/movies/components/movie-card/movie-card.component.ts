import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input()
  public movie!: Movie;

  public mainImage = '';

  constructor() { }

  ngOnInit(): void {
    // Buscar en el arreglo de imagenes la que tenga el atributo 'main' en true
    if (!this.movie.mainImage) {
      this.mainImage = 'no-movie-image.jpg';
      return;
    }
    this.mainImage = this.movie.mainImage ? `movies/${this.movie.mainImage}`: 'no-movie-image.jpg';

    // const mainImage = this.movie.images.find(image => image.isMain);
    // this.mainImage = this.movie.images.find(image => image.isMain)?.url ? `public/movies/${this.movie.images.find(image => image.isMain)?.url}` : 'no-movie-image.jpg';
  }
}
