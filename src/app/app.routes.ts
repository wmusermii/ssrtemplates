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
    loadComponent: () => import("./layouts/navigations/nonavi/nonavi").then(m => m.Nonavi),
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import("./pages/screen/auths/login/login").then(m => m.Login),
        data: { title: 'Login - Admin Template' }
      },
      {
        path: 'registration',
        loadComponent: () => import("./pages/screen/auths/registration/registration").then(m => m.Registration),
        data: { title: 'Registration - Admin Template' }
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
        data: { title: 'Dashboard - Admin Template' }
      },
      {
        path: 'management/general',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/generalmanagement/generalmanagement").then(m => m.Generalmanagement),
        data: { title: 'General Management - Admin Template' }
      },
      {
        path: 'management/user',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/usermanagement/usermanagement").then(m => m.Usermanagement),
        data: { title: 'User Management - Admin Template' }
      },
      {
        path: 'management/menus',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/menumanagement/menumanagement").then(m => m.Menumanagement),
        data: { title: 'Menu Management - Admin Template' }
      },
      {
        path: 'management/group',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/groupmanagement/groupmanagement").then(m => m.Groupmanagement),
        data: { title: 'Group Management - Admin Template' }
      },
      {
        path: 'management/role',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/managements/rolemanagement/rolemanagement").then(m => m.Rolemanagement),
        data: { title: 'Role Management - Admin Template' }
      },
      {
        path: 'siapubp/companylist',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/simulatorhub/siapubp/companylist/companylist").then(m => m.Companylist),
        data: { title: 'Simulator - Company List' }
      },
      {
        path: 'siapubp/configurations/parameterlist',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/simulatorhub/siapubp/parameterlist/parameterlist").then(m => m.Parameterlist),
        data: { title: 'Simulator - Parameter List' }
      },
      {
        path: 'siapubp/configurations/properties',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/simulatorhub/siapubp/properties/properties").then(m => m.Properties),
        data: { title: 'Simulator - Properties' }
      },
      {
        path: 'bifast/bisnislist',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/simulatorhub/bifast/bisnislist/bisnislist").then(m => m.Bisnislist),
        data: { title: 'Simulator - foblex' }
      },
      {
        path: 'bifast/bisnislist/graph',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/foblex/flowcanvasapi/flowcanvasapi").then(m => m.Flowcanvasapi),
        data: { title: 'Simulator - foblex' }
      },{
        path: 'cimb/komiconfiguration',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/poc/cimb/komiconfiguration/komiconfiguration").then(m => m.Komiconfiguration),
        data: { title: 'CIMB - Komi Config' }
      },{
        path: 'cimb/abcsconfiguration',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/poc/cimb/abcsconfiguration/abcsconfiguration").then(m => m.Abcsconfiguration),
        data: { title: 'CIMB - ABCS Config' }
      },{
        path: 'cimb/mbaseconfiguration',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/poc/cimb/mbaseconfiguration/mbaseconfiguration").then(m => m.Mbaseconfiguration),
        data: { title: 'CIMB - MBASE Config' }
      },
      {
        path: 'privacy/profile',
        canActivate: [authGuard],
        loadComponent: () => import("./pages/screen/myprofile/myprofile").then(m => m.Myprofile),
        data: { title: 'My Profile - Admin Template' }
      }
    ]
  },
  // fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
