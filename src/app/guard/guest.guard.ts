// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { LocalstorageService } from './ssr/localstorage/localstorage.service';
// export const guestGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const ssrStorage = inject(LocalstorageService)
//   const isLoggedIn = ssrStorage.getItem('token');
//   console.log("[guestGuard]", { isLoggedIn, route: state.url });
//   if (isLoggedIn) {
//     router.navigate(['/dashboard']);
//     return false;
//   }
//   return true;
// };

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  try {
    const res = await fetch('/v2/auth/attrb', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr',
      },
      credentials: 'include' // pastikan cookie dikirim bersama request
    });
    if (!res.ok) {
      // Token tidak valid atau error, izinkan akses guest
      return true;
    }
    const data = await res.json();
    if (data.code === 20000) {
      console.log("GUEST GUARD CHECK ",data);
      // Token valid, redirect ke dashboard
      return router.createUrlTree(['/dashboard']);
      // return true
    } else {
      return true;
    }
  } catch (err) {
    console.log('Error cek token:', err);
    return true;
  }
};
