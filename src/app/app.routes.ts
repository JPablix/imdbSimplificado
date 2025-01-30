import { Routes } from '@angular/router';
import { MoviesListPageComponent } from './features/movies/pages/movies-list-page/movies-list-page.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { ActorsListPageComponent } from './features/actors/pages/actors-list-page/actors-list-page.component';
import { MoviesDetailPageComponent } from './features/movies/pages/movies-detail-page/movies-detail-page.component';
import { ActorsDetailPageComponent } from './features/actors/pages/actors-detail-page/actors-detail-page.component';
import { SearchComponent } from './shared/components/search/search.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { AdminGuard } from './features/auth/guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { 
                path: 'auth',
                loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
            },
            {
                path: 'movies',
                component: MoviesListPageComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'movies/new-movie',
                component: MoviesDetailPageComponent,
                canActivate: [AuthGuard, AdminGuard]
            },
            {
                path: 'movies/edit/:title',
                component: MoviesDetailPageComponent,
                canActivate: [AuthGuard, AdminGuard]
            },
            {
                path: 'actors',
                component: ActorsListPageComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'actors/new-actor',
                component: ActorsDetailPageComponent,
                canActivate: [AuthGuard, AdminGuard]
            },
            {
                path: 'actors/edit/:name',
                component: ActorsDetailPageComponent,
                canActivate: [AuthGuard, AdminGuard]
            },
            {
                path: 'search',
                component: SearchComponent,
                canActivate: [AuthGuard]
            },
            {
                path: '**',
                redirectTo: 'movies',
                pathMatch: 'full'
            }
        ]
    },
];