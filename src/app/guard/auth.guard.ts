// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { LocalstorageService } from './ssr/localstorage/localstorage.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const ssrStorage = inject(LocalstorageService)
//   const isLoggedIn = ssrStorage.getItem('C_INFO');
//   console.log("[authGuard]", { isLoggedIn, route: state.url });
//   if (!isLoggedIn) {
//     router.navigate(['/login']);
//     return false;
//   }
//   return true;
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from './ssr/localstorage/localstorage.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const ssrStorage = inject(LocalstorageService)
  const router = inject(Router);
  try {
    const useLogin = ssrStorage.getItem('USE_LOGIN');

    
    // if (useLogin == 'true') {
    // }
    console.log('PAKE LOGIN INI BRO');
    // console.log("[authGuard]", "FETCHING ATTRB");
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
      return router.createUrlTree(['/login']);
    }
    
    const data = await res.json();
    if (data.code === 20000) {
      // console.log("[authGuard] Data", data);
      const blobMenu = btoa(JSON.stringify(data.data))
      ssrStorage.setItem("blob",blobMenu)
      return true
    } else {
      // return true;
      return router.createUrlTree(['/login']);
    }
    

    return true;
  } catch (err) {
    console.log('Error cek token:', err);
    return true;
  }
};
