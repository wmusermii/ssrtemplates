import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-bisnislist',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, SelectModule],
  templateUrl: './bisnislist.html',
  styleUrl: './bisnislist.css'
})
export class Bisnislist implements OnInit {

  currentUrl: string = '';
  aclMenublob: any[] = [];
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  loading: boolean = false;
  cols!: Column[];
  datas!: any[];
  alldatas!: any[];
  selectedData: any = {};
  rows = 50;
  globalFilter: string = '';
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'title', header: 'Title' },
      { field: 'description', header: 'Description' },
      { field: 'created_at', header: 'Created At' },
      { field: 'updated_at', header: 'Updated At' }
    ];
    await this._refreshACLMenu();
    console.log("*** Menu ACL ", this.aclMenublob);
    if (this.aclMenublob.includes("rd")) {
       await this._refreshListData();
    }
    this.breaditems = [{ label: 'Siap-UBP' }, { label: 'Company List' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
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
  async _refreshListData(): Promise<void> {
      this.loading = true;
      fetch('/v2/siapbifast/get_bisnislist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        }
      })
        .then(res => {
          // console.log("Response dari API  /v2/admin/get_users", res);
          if (!res.ok) throw new Error('get get_users Gagal');
          // if (!res.ok){
          //   this.showErrorPage = {show:true, message:res}
          // }
          return res.json();
        })
        .then(data => {
          // console.log("Response dari API /v2/admin/get_users", data);
          // this.loading = false;
          // this.users = []; this.allUser = [];
          // if (data.code === 20000) {
          //   const dataRecordsTemp = cloneDeep(data.data);
          //   this.users = dataRecordsTemp;
          //   this.allUser = this.users;
          //   this.totalUsers = this.allUser.length;
          //   this.loading = false;
          // } else {
          //   this.users = [];
          //   this.totalUsers = this.users.length;
          //   this.loading = false;
          //   // this.showErrorPage = { show: true, message: data.message }
          // }
        })
        .catch(err => {
          console.log("Response Error Catch /v2/admin/get_users", err);
        });
    }




}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
