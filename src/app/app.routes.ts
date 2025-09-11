import { Routes } from '@angular/router';
import { guestGuard } from './guard/guest.guard';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
  },
  {
    path:'',
    loadComponent:() => import("./layouts/navigations/nonavi/nonavi").then(m => m.Nonavi),
    children:[
      {
       path:'login',
       canActivate:[guestGuard],
      loadComponent:() => import("./pages/screen/auths/login/login").then(m => m.Login)
      },
      {
       path:'registration',
      loadComponent:() => import("./pages/screen/auths/registration/registration").then(m => m.Registration)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path:'',
    loadComponent:() => import("./layouts/navigations/sidenavi/sidenavilayout/sidenavilayout").then(m => m.Sidenavilayout),
    children:[
      {
       path:'dashboard',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/dashboard/dashboard").then(m => m.Dashboard)
      },
      {
       path:'tasklist',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/tasklist/tasklist").then(m => m.Tasklist)
      },
      {
        path: '',
        redirectTo: 'tasklist',
        pathMatch: 'full'
      }
    ]
  }
];

