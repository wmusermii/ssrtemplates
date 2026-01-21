import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { LocalstorageService } from '../../../../../guard/ssr/localstorage/localstorage.service';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-audittrail',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, ChipModule,TagModule, ToggleSwitchModule, DividerModule,PasswordModule, SelectModule],
  templateUrl: './audittrail.html',
  styleUrl: './audittrail.css'
})
export class Audittrail implements OnInit {
   currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  loading: boolean = false;
  cols!: Column[];
  rows = 50;
  aclMenublob: any[] = [];
  isBrowser = false;
  constructor(private router: Router, private ssrStorage: LocalstorageService,@Inject(PLATFORM_ID) private platformId: Object,private cdr: ChangeDetectorRef) {
     this.isBrowser = isPlatformBrowser(platformId);
  }
  async ngOnInit(): Promise<void> {
      this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    //##########################################################
    // console.log("USER INFO ", this.userInfo);
    this.cols = [
      { field: 'username', header: 'User' },
      { field: 'fullname', header: 'Fullname' },
      { field: 'groupname', header: 'Permission' },
      { field: 'email', header: 'Email' },
      { field: 'status', header: 'Status' }
    ];
    this.breaditems = [{ label: 'Reports' }, { label: 'Audit Trails' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    //##########################################################
    await this._refreshACLMenu();
    if (this.aclMenublob.includes("rd")) {
      //******************** Untuk Refresh data *************/
    }
  }
  async _refreshACLMenu(): Promise<void> {
        const payload: any = { routeUrl: this.currentUrl };
        this.loading = true;
        try {
          const res = await fetch('/v2/auth/aclattrb', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${this.token}`,
              'x-client': 'angular-ssr'
            },
            body: JSON.stringify(payload)
          });
          // console.log("Response dari API /v2/auth/aclattrb", res);
          const data = await res.json();
          // console.log("Response dari API /v2/auth/aclattrb", data);
          this.loading = false;
          if (data.code === 20000) {
            const dataRecordsMenu: any = cloneDeep(data.data);
            this.aclMenublob = dataRecordsMenu.roles;
          } else {
            this.aclMenublob = [];
          }
        } catch (err) {
          console.log("Response Error Catch /v2/auth/aclattrb", err);
          this.aclMenublob = [];
          this.loading = false;
        }
      }
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
