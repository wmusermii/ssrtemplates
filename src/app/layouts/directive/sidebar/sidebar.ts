import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';

@Component({
    standalone: true,
    selector: 'app-sidebar',
    imports: [CommonModule, RouterModule, PanelMenuModule, ButtonModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
    loading: boolean = true;

    token: string | null | undefined = undefined;
    dropdownClicked = false;
    openDropdownId: string | null = null;
    showLogoutDialog = false;
    showConfirmDialog = false;
    isMobileMenuOpen = false;
    errorMessage: any = { error: false, severity: 'info', message: 'ini test', icon: 'pi pi-times' };
    items: MenuItem[] | undefined;
    listMenu: any[] = [
        {
            label: 'Privacy & Security',
            items: [
                { label: 'Profile', icon: 'pi pi-user', routerLink: '/privacy/profile' },
                { label: 'Logout', icon: 'pi pi-sign-out', routerLink: [] },
            ],
        },
    ];
    message: any = { title: 'Expired Session', icon: 'pi pi-exclamation-circle', message: 'EXP token please login again.' };
    // Simulasi status login user (ganti sesuai logika aplikasi Anda)
    isUserLoggedIn = false;
    user = {
        name: 'undefined',
    };
    @Output() userChange = new EventEmitter<{ name: string }>();
    constructor(private router: Router, private ssrStorage: LocalstorageService) {}
    async ngOnInit(): Promise<void> {
        this.token = this.ssrStorage.getItem('blob');
        if (!this.token) {
            console.log('TOKEN KOSONG : ', this.token);
            // this.router.navigate(['/login']);
        } else {
            console.log('TOKEN ISI : ', 'this.token');
            await this._getAttribute();
        }
    }
    ngOnDestroy(): void {}

    async _getAttribute(): Promise<void> {
        try {
            this.loading = true;
            const attrbstring = atob(this.token!);
            const attrbObj: any = JSON.parse(attrbstring);
            this.user = { name: attrbObj.fullname };
            this.userChange.emit(this.user);
            if (attrbObj.isAdmin === 1) {
                const menuAdmin = [
                    {
                        label: 'Management',
                        items: [
                            { label: 'General', routerLink: '/management/general', icon: 'pi pi-cog', roles: ['cr', 'rd', 'vw', 'up', 'dl'] },
                            { label: 'Users', routerLink: '/management/user', icon: 'pi pi-users', roles: ['cr', 'rd', 'vw', 'up', 'dl'] },
                            { label: 'Menus', routerLink: '/management/menus', icon: 'pi pi-bars', roles: ['cr', 'rd', 'vw', 'up', 'dl'] },
                            { label: 'Groups', routerLink: '/management/group', icon: 'pi pi-box', roles: ['cr', 'rd', 'vw', 'up', 'sm', 'dl'] },
                            { label: 'Role', routerLink: '/management/role', icon: 'pi pi-microchip', roles: ['cr', 'rd', 'vw', 'up', 'dl'] },
                        ],
                    },
                ];
                this.listMenu = [...menuAdmin, ...this.listMenu];
            } else {
                const datamenuString = attrbObj.menublob;
                if (datamenuString) {
                    this.listMenu = [...JSON.parse(datamenuString), ...this.listMenu];
                }
            }
            await this.replaceLogoutWithCommand(this.listMenu);
            await this.expandAllPanelMenu(this.listMenu);
            this.loading = false;
        } catch (error) {
            console.log('ERROR getAttribute ', error);
        }
    }

    // helper recursive function
    async replaceLogoutWithCommand(items: any[]): Promise<void> {
        for (const item of items) {
            if (item.label === 'Logout') {
                // RouterLink dummy supaya PrimeNG tetap render icon
                // Tetapkan command tanpa event
                item.command = (event?: any) => {
                    if (event && event.originalEvent) {
                        event.originalEvent.preventDefault(); // cegah navigasi
                        event.originalEvent.stopPropagation(); // cegah bubbling
                    }
                    this.openLogoutDialog(); // jalankan dialog logout
                };
                // Pastikan icon tetap ada
                item.icon = item.icon || 'pi pi-sign-out';
                // console.log('LOGOUT ITEM:', item);
            }

            // Recursive untuk submenu
            if (item.items && item.items.length > 0) {
                this.replaceLogoutWithCommand(item.items);
            }
        }

        // Trigger re-render menu
        this.listMenu = [...this.listMenu];
    }
    async expandAllPanelMenu(items: any[]): Promise<void> {
        for (const item of items) {
            item.expanded = true; // set expanded
            if (item.items && item.items.length > 0) {
                this.expandAllPanelMenu(item.items); // recursive untuk submenu
            }
        }
    }

    openLogoutDialog() {
        console.log('LOGING OUT');
        this.showLogoutDialog = true;
    }
    openConfirmDialog() {
        console.log('LOGING OUT');
        this.showLogoutDialog = true;
    }
    closeDropdown() {
        this.openDropdownId = null;
        this.isMobileMenuOpen = false;
    }
    cancelLogout() {
        this.showLogoutDialog = false;
    }

    async confirmLogout() {
        this.loading = true;
        fetch('/v2/auth/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-client': 'angular-ssr',
            },
        })
            .then(async (res) => {
                // console.log("Response dari API  /auth/logout", res);
                if (!res.ok) throw new Error('Logout Gagal');
                return res.json();
            })
            .then(async (data) => {
                // console.log("Response dari API /auth/logout ", data);
                if (data.code === 20000) {
                    await this.ssrStorage.clear();
                    this.showLogoutDialog = false;
                    this.showConfirmDialog = false;
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 50);
                } else {
                    this.errorMessage = { error: false, severity: 'error', message: 'Unable to logout', icon: 'pi pi-times' };
                }
            })
            .catch((err) => {
                this.loading = false;
                console.log('Response Error Catch /auth/attrb', err);
                this.showConfirmDialog = true;
            });
    }
}
