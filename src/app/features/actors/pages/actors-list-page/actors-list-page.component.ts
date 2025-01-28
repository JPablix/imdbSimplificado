import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActorCardComponent } from '../../components/actor-card/actor-card.component';
import { ActorService } from '../../services/actor.service';
import { Actor } from '../../../../shared/interfaces/actor.interfaces';
import { RouterModule } from '@angular/router';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
@Component({
  selector: 'app-actors-list-page',
  imports: [
    CommonModule,
    ActorCardComponent,
    RouterModule  
  ],
  templateUrl: './actors-list-page.component.html',
  styleUrl: './actors-list-page.component.scss'
})
export class ActorsListPageComponent {
  public actors: Actor[] = [];
  public paginatedActors: Actor[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 8;
  public totalItems: number = 0;
  public pageSizeOptions: number[] = [4, 8, 16, 22, 52];

  constructor(
    private actorService: ActorService
  ) {}

  ngOnInit(): void {
    console.log('ActorsListPageComponent initialized');
    this.loadActors();
  }

  loadActors(): void {
    this.actorService.getActors().subscribe(actors => {
      this.actors = actors;
      this.totalItems = actors.length;
      this.updatePaginatedActors();
    });
  }

  updatePaginatedActors(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedActors = this.actors.slice(startIndex, endIndex);
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(selectElement.value);
    this.currentPage = 1; // Volver a la primera página
    this.updatePaginatedActors();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedActors();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
