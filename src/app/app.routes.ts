import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { guestGuard } from './guard/guest.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        loadComponent: () => import('./layouts/navigations/nonavi/nonavi').then((m) => m.Nonavi),
        children: [
            {
                path: 'login',
                canActivate: [guestGuard],
                loadComponent: () => import('./pages/screen/auths/login/login').then((m) => m.Login),
                data: { title: 'Login - Admin Template' },
            },
            {
                path: 'registration',
                loadComponent: () => import('./pages/screen/auths/registration/registration').then((m) => m.Registration),
                data: { title: 'Registration - Admin Template' },
            },
        ],
    },
    {
        path: '',
        loadComponent: () => import('./layouts/navigations/sidenavi/sidenavilayout/sidenavilayout').then((m) => m.Sidenavilayout),
        children: [
            {
                path: 'dashboard',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/screen/dashboard/dashboard').then((m) => m.Dashboard),
                data: { title: 'Dashboard - Admin Template' },
            },
            {
                path: 'general',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/screen/managements/generalmanagement/generalmanagement').then((m) => m.Generalmanagement),
                data: { title: 'General Management - Admin Template' },
            },
            {
                path: 'user',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/screen/managements/usermanagement/usermanagement').then((m) => m.Usermanagement),
                data: { title: 'User Management - Admin Template' },
            },
            {
                path: 'menus',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/screen/managements/menumanagement/menumanagement').then((m) => m.Menumanagement),
                data: { title: 'Menu Management - Admin Template' },
            },
            {
                path: 'group',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/screen/managements/groupmanagement/groupmanagement').then((m) => m.Groupmanagement),
                data: { title: 'Group Management - Admin Template' },
            },
            {
                path: 'role',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/screen/managements/rolemanagement/rolemanagement').then((m) => m.Rolemanagement),
                data: { title: 'Role Management - Admin Template' },
            },
            {
                path: 'profile',
                canActivate: [authGuard],
                loadComponent: () => import('./pages/screen/myprofile/myprofile').then((m) => m.Myprofile),
                data: { title: 'My Profile - Admin Template' },
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
