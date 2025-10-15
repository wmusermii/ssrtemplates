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
import { RoleEnumService } from '../services/role-enum-service';
import { LocalstorageService } from './ssr/localstorage/localstorage.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const ssrStorage = inject(LocalstorageService);
    const roleEnumService = inject(RoleEnumService);
    const router = inject(Router);
    try {
        // console.log("[authGuard]", "FETCHING ATTRB");
        const res = await fetch('/v2/auth/attrb', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-client': 'angular-ssr',
            },
            credentials: 'include', // pastikan cookie dikirim bersama request
        });
        if (!res.ok) {
            // Token tidak valid atau error, izinkan akses guest
            return router.createUrlTree(['/login']);
        }
        const data = await res.json();
        if (data.code === 20000) {
            // console.log("[authGuard] Data", data);
            const blobMenu = btoa(JSON.stringify(data.data));
            ssrStorage.setItem('blob', blobMenu);
            if (Object.keys(RoleEnumService.getRoleEnum()).length === 0) {
                await roleEnumService.loadEnums();
            }
            return true;
        } else {
            // return true;
            return router.createUrlTree(['/login']);
        }
    } catch (err) {
        console.log('Error cek token:', err);
        return true;
    }
};
