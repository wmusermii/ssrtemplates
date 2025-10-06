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
    path: '',
    loadComponent: () =>
      import("./layouts/navigations/nonavi/nonavi").then(m => m.Nonavi),
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import("./pages/screen/auths/login/login").then(m => m.Login),
        data: { title: 'Login - Flowable Simulator' }
      },
      {
        path: 'registration',
        loadComponent: () => import("./pages/screen/auths/registration/registration").then(m => m.Registration),
        data: { title: 'Registration - Flowable Simulator' }
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import("./layouts/navigations/sidenavi/sidenavilayout/sidenavilayout").then(m => m.Sidenavilayout),
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/dashboard/dashboard").then(m => m.Dashboard),
        data: { title: 'Dashboard - Flowable Simulator' }
      },
      {
        path: 'management/general',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/generalmanagement/generalmanagement").then(m => m.Generalmanagement),
        data: { title: 'General Management - Flowable Simulator' }
      },
      {
        path: 'management/user',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/usermanagement/usermanagement").then(m => m.Usermanagement),
        data: { title: 'User Management - Flowable Simulator' }
      },
      {
        path: 'management/menus',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/menumanagement/menumanagement").then(m => m.Menumanagement),
        data: { title: 'Menu Management - Flowable Simulator' }
      },
      {
        path: 'management/group',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/groupmanagement/groupmanagement").then(m => m.Groupmanagement),
        data: { title: 'Group Management - Flowable Simulator' }
      },
      {
        path: 'management/role',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/rolemanagement/rolemanagement").then(m => m.Rolemanagement),
        data: { title: 'Role Management - Flowable Simulator' }
      },
      {
        path: 'privacy/profile',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/myprofile/myprofile").then(m => m.Myprofile),
        data: { title: 'My Profile - Flowable Simulator' }
      },
      {
        path: 'flowable/taskmanager',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/tasklist/tasklist").then(m => m.Tasklist),
        data: { title: 'Task List - Flowable Simulator' }
      },
      {
        path: 'channels/loanrequest',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/loanrequest/loanrequest").then(m => m.Loanrequest),
        data: { title: 'Task List - Flowable Simulator' }
      }
    ]
  },
  // fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
