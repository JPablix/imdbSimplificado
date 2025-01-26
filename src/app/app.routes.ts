import { Routes } from '@angular/router';
import { MoviesListPageComponent } from './features/movies/pages/movies-list-page/movies-list-page.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { ActorsListPageComponent } from './features/actors/pages/actors-list-page/actors-list-page.component';
import { MoviesDetailPageComponent } from './features/movies/pages/movies-detail-page/movies-detail-page.component';
import { ActorsDetailPageComponent } from './features/actors/pages/actors-detail-page/actors-detail-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'movies',
                component: MoviesListPageComponent,
            },
            {
                path: 'movies/new-movie',
                component: MoviesDetailPageComponent
            },
            {
                path: 'movies/edit/:title',
                component: MoviesDetailPageComponent
            },
            {
                path: 'actors',
                component: ActorsListPageComponent
            },
            {
                path: 'actors/new-actor',
                component: ActorsDetailPageComponent
            },
            {
                path: 'actors/edit/:name',
                component: ActorsDetailPageComponent
            },
            {
                path: '**',
                redirectTo: 'movies',
                pathMatch: 'full'
            }
        ]
    },
];
