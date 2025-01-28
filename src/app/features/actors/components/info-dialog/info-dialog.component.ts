import { Component, Inject } from '@angular/core';
import { ActorImagePipe } from '../../pipes/actor-image.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actor } from '../../../../shared/interfaces/actor.interfaces';
import { MovieService } from '../../../movies/services/movie.service';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MovieImagePipe } from '../../../movies/pipes/movie-image.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-dialog',
  imports: [
    CommonModule,
    ActorImagePipe,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MovieImagePipe
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {
  public movies: Movie[] = [];

  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Actor,

    private movieService: MovieService
  ) {
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  }

  ngOnInit(): void {
    this.movieService.getActorStarIn(this.data.name)
      .subscribe(movies => this.movies = movies);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
