import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActorCardComponent } from '../../components/actor-card/actor-card.component';
import { ActorService } from '../../services/actor.service';
import { Actor } from '../../../../shared/interfaces/actor.interfaces';
@Component({
  selector: 'app-actors-list-page',
  imports: [
    CommonModule,
    ActorCardComponent
  ],
  templateUrl: './actors-list-page.component.html',
  styleUrl: './actors-list-page.component.scss'
})
export class ActorsListPageComponent {
  public actors: Actor[] = [];

  constructor(
    private actorService: ActorService
  ) {}

  ngOnInit(): void {
    console.log('ActorsListPageComponent initialized');
    this.actorService.getActors()
    .subscribe(actors => this.actors = actors);
  }
}
