import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public navbarItems = [
    { name: 'Listado Películas', route: '/movies' },
    { name: 'Añadir Películas', route: '/movies/new-movie' },
    { name: 'Listado Actores', route: '/actors' },
    { name: 'Añadir Actores', route: '/actors/new-actor' },
  ];
}
