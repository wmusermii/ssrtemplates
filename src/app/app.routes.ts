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
       path:'management/general',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/managements/generalmanagement/generalmanagement").then(m => m.Generalmanagement)
      },
      {
       path:'management/user',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/managements/usermanagement/usermanagement").then(m => m.Usermanagement)
      },
      {
       path:'management/menus',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/managements/menumanagement/menumanagement").then(m => m.Menumanagement)
      },
      {
       path:'management/group',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/managements/groupmanagement/groupmanagement").then(m => m.Groupmanagement)
      },
      {
       path:'management/role',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/managements/rolemanagement/rolemanagement").then(m => m.Rolemanagement)
      },
      {
       path:'privacy/profile',
       canActivate:[authGuard],
      loadComponent:() => import("./pages/screen/myprofile/myprofile").then(m => m.Myprofile)
      }
    ]
  },
  // fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

