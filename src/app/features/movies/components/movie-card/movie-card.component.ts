import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MovieImagePipe } from '../../pipes/movie-image.pipe';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-movie-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MovieImagePipe,
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input()
  public movie!: Movie;

  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
  ) { }

  onMoreInfo(): void {
    this.dialog.open( InfoDialogComponent, {
      data: this.movie
    })
   }


}
