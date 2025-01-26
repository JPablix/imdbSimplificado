import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Actor } from '../../../../shared/interfaces/actor.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../../actors/components/info-dialog/info-dialog.component';
import { ActorImagePipe } from '../../pipes/actor-image.pipe';

@Component({
  selector: 'app-actor-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ActorImagePipe
  ],
  templateUrl: './actor-card.component.html',
  styleUrl: './actor-card.component.scss'
})
export class ActorCardComponent {
  @Input()
  public actor!: Actor;

  constructor(
    private dialog: MatDialog
  ) { }

  onMoreInfo(): void {
    this.dialog.open( InfoDialogComponent, {
      data: this.actor
    })
   }
}
