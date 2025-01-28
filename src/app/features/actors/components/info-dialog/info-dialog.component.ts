import { Component, Inject } from '@angular/core';
import { ActorImagePipe } from '../../pipes/actor-image.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actor } from '../../../../shared/interfaces/actor.interfaces';

@Component({
  selector: 'app-info-dialog',
  imports: [
    ActorImagePipe,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Actor
  ) {
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
