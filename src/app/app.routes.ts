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
       path:'shopee',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/inquery/inquery").then(m => m.Inquery)
      },
      {
       path:'packaging',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/packaging/listinvoice/listinvoice").then(m => m.Listinvoice)
      },
      {
        path: 'packaging/detail',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/screen/packaging/listinvoice/detailinvoice/detailinvoice').then(m => m.Detailinvoice),
      },
      {
       path:'management/product',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/product/product.component").then(m => m.ProductComponent)
      },
      {
       path:'management/warehouse',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/warehouselist/warehouselist").then(m => m.Warehouselist)
      },
      {
        path:'management/stockopname',
        canActivate:[authGuard],
        loadComponent:() => import("./pages/screen/stockopname/stockopname").then(m => m.Stockopname)
      },
      {
        path:'management/stockopname/view',
        canActivate:[authGuard],
        loadComponent:() => import("./pages/screen/stockopname/stockopnamedetail/stockopnamedetail").then(m => m.Stockopnamedetail),
        data: { renderMode: 'server' }
      },
      {
        path:'settings/shopee',
        canActivate:[authGuard],
        loadComponent:() => import("./pages/screen/shopeemanagement/shopeemanagement").then(m => m.Shopeemanagement),
        data: { renderMode: 'server' }
      },
      {
        path:'settings/user',
        canActivate:[authGuard],
        loadComponent:() => import("./pages/screen/usermanagement/usermanagement").then(m => m.Usermanagement),
        data: { renderMode: 'server' }
      },
      {
       path:'profile',
       canActivate:[authGuard],
       loadComponent:() => import("./pages/screen/myprofile/myprofile").then(m => m.Myprofile)
      },
      {
       path:'printing',
       loadComponent:() => import("./pages/screen/shopeeprintlist/shopeeprintlist").then(m => m.Shopeeprintlist)
      },
      {
        path: '',
        redirectTo: 'tasklist',
        pathMatch: 'full'
      }
    ]
  }
];

