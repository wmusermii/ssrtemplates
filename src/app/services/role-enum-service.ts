import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RoleEnumService {
    private static RoleEnum: Record<string, string> = {};

    constructor() {}

    async loadEnums(): Promise<void> {
        try {
            const res = await fetch('/v2/admin/get_roles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client': 'angular-ssr',
                },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const roles: { roleName: string }[] = await res.json();
            if (roles.length > 0) {
                RoleEnumService.RoleEnum = Object.fromEntries(roles.map((r) => [r.roleName.replace(/\s+/g, '_').toUpperCase(), r.roleName]));
            } else {
                RoleEnumService.RoleEnum = {};
            }
            console.log('✅ RoleEnum initialized:', RoleEnumService.RoleEnum);
        } catch (err) {
            console.error('❌ Failed to load RoleEnum:', err);
            RoleEnumService.RoleEnum = {}; // fallback
        }
    }

    /** Static getter to access RoleEnum anywhere */
    static getRoleEnum(): Record<string, string> {
        return RoleEnumService.RoleEnum;
    }

    /** Optionally get a specific value */
    static getRoleValue(key: string): string | undefined {
        return RoleEnumService.RoleEnum[key];
    }
}
