import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
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
    { name: 'Listado Películas', route: '/movies'},
    { name: 'Listado Actores', route: '/actors'},
  ];

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
