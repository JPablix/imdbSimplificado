import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActorImagePipe } from '../../pipes/actor-image.pipe';
import { ActorService } from '../../services/actor.service';
import { Actor } from '../../../../shared/interfaces/actor.interfaces';
import { switchMap } from 'rxjs';
import { MoviesDetailPageComponent } from '../../../movies/pages/movies-detail-page/movies-detail-page.component';
import { InfoDialogComponent, InfoDialogData } from '../../../../shared/components/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-actors-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    ActorImagePipe
  ],
  templateUrl: './actors-detail-page.component.html',
  styleUrl: './actors-detail-page.component.scss'
})
export class ActorsDetailPageComponent {

  public formMode: 'new' | 'edit' = 'new';
  actorForm: FormGroup;

  constructor(
    private actorService: ActorService,
    private router: Router,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.actorForm = this.fb.group({
      name: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      biography: [''],
      mainImage: [null, Validators.required], // Imagen principal
      images: [null], // Otras imágenes
    });
  }

  get currentActor(): Actor {
    const actor = this.actorForm.value as Actor;
    return actor;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) {
      return;
    }
    this.formMode = 'edit';

    // Estamos en modo edición entonces cargamos los datos del actor
    this.activatedRoute.params
      .pipe(
        switchMap(({ name }) => this.actorService.getActorByName(name))
      )
      .subscribe(actor => {
        if (!actor) {
          this.router.navigateByUrl('/actors');
          return;
        }

        this.actorForm.patchValue({
          ...actor,
          dateOfBirth: actor.dateOfBirth?.split('T')[0]
        });
      });
  }

  onImageSelect(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.actorForm.patchValue({ [field]: Array.from(input.files) });
    }
  };

  onSubmit(): void {
    const actorData = { ...this.actorForm.value };

    console.log(actorData);

    if (this.formMode === 'new') {
      // Revisar si el nombre del actor ya existe
      this.actorService.getActorExists(actorData.name).subscribe(exists => {
        if (exists) {
          this.snackbar.open('El nombre del actor ya existe', 'Cerrar', {
            duration: 3000
          });
          return;
        }
        this.actorService.createActor(actorData).subscribe({
          next: response => {
            this.snackbar.open('Actor creado correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/actors']);
          },
          error: (error) => console.error('Error al crear el actor', error)
        });
      });
    } else {
      const originalName = this.activatedRoute.snapshot.params['name'];
      // Revisar si el nombre del actor ya existe
      this.actorService.getActorExists(actorData.name).subscribe(exists => {
        if (exists && actorData.name !== originalName) {
          this.snackbar.open('El nombre del actor ya existe', 'Cerrar', {
            duration: 3000
          });
          return;
        }
        this.actorService.updateActor(actorData, originalName).subscribe({
          next: actor => {
            this.snackbar.open('Actor actualizado correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigateByUrl('/actors');
          },
          error: (error) => console.error('Error al actualizar el actor', error)
        });
      });
    }
  }


  onDelete(): void {
    const dialogData: InfoDialogData = {
      message: '¿Estás seguro de que deseas eliminar este actor?',
      actions: [
        {
          tag: 'Cancelar',
          action: () => console.log('Cancelado')
        },
        {
          tag: 'Eliminar',
          action: () => {
            const originalName = this.activatedRoute.snapshot.params['name'];
            this.actorService.deleteActor(originalName).subscribe({
              next: (response) => {
                this.snackbar.open('Actor eliminado correctamente', 'Cerrar', {
                  duration: 3000
                });
                this.router.navigateByUrl('/actors');
              },
              error: (error) => console.error('Error al eliminar el actor', error)
            });
          }
        }
      ]
    };
  
    this.dialog.open(InfoDialogComponent, {
      data: dialogData
    });
  }
}
