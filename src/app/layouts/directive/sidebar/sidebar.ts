import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone:true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, PanelMenuModule, ButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit, OnDestroy {
  loading: boolean = true;
  token: string | null | undefined = undefined;
  dropdownClicked = false;
  openDropdownId: string | null = null;
  showLogoutDialog = false;
  showConfirmDialog = false;
  isMobileMenuOpen = false;
  items: MenuItem[] | undefined;
  listMenu: any[] = [];
  message: any = { title: "Expired Session", icon: "pi pi-exclamation-circle", message: "EXP token please login again." }
  // Simulasi status login user (ganti sesuai logika aplikasi Anda)
  isUserLoggedIn = false;
  user = {
    name: 'undefined'
  };
  @Output() userChange = new EventEmitter<{name: string}>();
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  ngOnInit(): void {
    this.token = this.ssrStorage.getItem('token')
    if (!this.token) {
      console.log("TOKEN KOSONG : ", this.token);
      // this.router.navigate(['/login']);
    } else {
      console.log("TOKEN ISI : ", "this.token");
      this._getAttribute()
    }
  }
  ngOnDestroy(): void {

  }
  async _getAttribute() {
    fetch('/v2/auth/attrb', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      }
    })
      .then(async res => {
        console.log("Response dari API  /auth/attrb", res);
        // if (!res.ok) throw new Error('Attrb Gagal');
        if(!res.ok) {
          await this.ssrStorage.clear();
          setTimeout(() => {
            console.log("sidebar 1 tiba tiba");
            this.router.navigate(['/login']);
          }, 1000);
          return;
        }
        return res.json();
      })
      .then(async data => {
        console.log("Response dari API /auth/attrb ", data);
        if (data.code === 20000) {
          this.loading=false;
          this.user={name:data.data.fullname};
          this.userChange.emit(this.user);
          const datamenuString = data.data.menublob;
          if (datamenuString) {
            this.listMenu = JSON.parse(datamenuString);
            this.replaceLogoutWithCommand(this.listMenu);
            this.expandAllPanelMenu(this.listMenu);
          }
        } else {
          this.listMenu = [];
        }
      })
      .catch(err => {
        this.loading=false;
        console.log("Response Error Catch /auth/attrb", err);
        this.showConfirmDialog = true;
      });
  }
  // helper recursive function
  replaceLogoutWithCommand(items: any[]) {
  for (const item of items) {
    if (item.label === 'Logout') {
      // RouterLink dummy supaya PrimeNG tetap render icon
      item.routerLink = '/';

      // Tetapkan command tanpa event
      item.command = () => {
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
expandAllPanelMenu(items: any[]) {
  for (const item of items) {
    item.expanded = true; // set expanded
    if (item.items && item.items.length > 0) {
      this.expandAllPanelMenu(item.items); // recursive untuk submenu
    }
  }
}

  openLogoutDialog() {
    console.log("LOGING OUT");
    this.showLogoutDialog = true;
  }
  openConfirmDialog() {
    console.log("LOGING OUT");
    this.showLogoutDialog = true;
  }
  closeDropdown() {
    this.openDropdownId = null;
    this.isMobileMenuOpen=false;
  }
  cancelLogout() {
    this.showLogoutDialog = false;
  }

  async confirmLogout() {
    this.loading = true;
    this.showLogoutDialog = false;
    this.showConfirmDialog = false;
    try {
      await this.ssrStorage.clear();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 50);
    } catch (error) {
      console.error('Error saat clear storage:', error);
      // Tetap navigasi meskipun error
      console.log("sidebar Error saat clear storage tiba tiba");
      this.router.navigate(['/login']);
    }
  }
}
