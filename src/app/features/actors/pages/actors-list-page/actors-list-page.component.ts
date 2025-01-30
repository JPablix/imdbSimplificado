import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActorCardComponent } from '../../components/actor-card/actor-card.component';
import { ActorService } from '../../services/actor.service';
import { Actor } from '../../../../shared/interfaces/actor.interfaces';
import { RouterModule } from '@angular/router';
import { Movie } from '../../../../shared/interfaces/movie.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-actors-list-page',
  imports: [
    CommonModule,
    ActorCardComponent,
    RouterModule,
    MatIconModule 
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
  public sortOrder: 'asc' | 'desc' = 'asc';
  private sortBy: keyof Actor = 'name';

  constructor(
    private actorService: ActorService,
    public authService: AuthService,
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

  sortActors(by: keyof Actor): void {
    this.sortBy = by;
    this.actors.sort((a, b) => {
      const valueA = a[by];
      const valueB = b[by];
  
      if (valueA === undefined || valueB === undefined) {
        return 0;
      }
  
      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    this.updatePaginatedActors();
  }
  
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    if (this.sortBy) {
      this.sortActors(this.sortBy);
    }
  }
}
