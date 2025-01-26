import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MatDialogRef } from '@angular/material/dialog';
import { MovieImagePipe } from '../../pipes/movie-image.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-info-dialog',
  imports: [
    MovieImagePipe,
    MatCardModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
