import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Actor } from '../../../shared/interfaces/actor.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private url = environment.baseUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getActors(): Observable<Actor[]> {
    return this.httpClient.get<Actor[]>(`${this.url}/actors`);
  }

  getActorByName(name: string): Observable<Actor | undefined>{
    return this.httpClient.get<Actor>(`${this.url}/actors/${name}`)
      .pipe(
        catchError( err =>  of(undefined))
        )
      ;
  }

  createActor(actorData: any): Observable<Actor> {
    const formData = new FormData();

    // Añadir datos principales
    formData.append('name', actorData.name);
    formData.append('dateOfBirth', actorData.dateOfBirth);
    formData.append('biography', actorData.biography || '');
    formData.append('movies', JSON.stringify(actorData.movies));

    // Subir imagen principal
    if (actorData.mainImage && actorData.mainImage[0]) {
      formData.append('mainImage', actorData.mainImage[0]);
    }

    // Subir otras imágenes
    if (actorData.images && actorData.images.length) {
      actorData.images.forEach((image: File) => {
        formData.append('images', image);
      });
    }

    return this.httpClient.post<Actor>(`${this.url}/actors`, formData);
  }

  // Actualizar actor
  updateActor(actorData: any, originalName: string): Observable<Actor> {
    const formData = new FormData();

    // Añadir datos principales
    formData.append('name', actorData.name);
    formData.append('dateOfBirth', actorData.dateOfBirth);
    formData.append('biography', actorData.biography || '');
    formData.append('movies', JSON.stringify(actorData.movies));

    // Subir imagen principal
    if (actorData.mainImage && actorData.mainImage[0]) {
      formData.append('mainImage', actorData.mainImage[0]);
    }

    // Subir otras imágenes
    if (actorData.images && actorData.images.length) {
      actorData.images.forEach((image: File) => {
        formData.append('images', image);
      });
    }

    return this.httpClient.put<Actor>(`${this.url}/actors/${originalName}`, formData);
  }

  // Eliminar actor
  deleteActor(name: string): Observable<Actor> {
    return this.httpClient.delete<Actor>(`${this.url}/actors/${name}`);
  }
}
