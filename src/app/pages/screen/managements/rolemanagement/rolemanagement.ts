import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import cloneDeep from 'lodash-es/cloneDeep';
@Component({
  standalone:true,
  selector: 'app-rolemanagement',
  imports: [CommonModule, FormsModule, ButtonModule, InputGroupModule,InputGroupAddonModule,InputTextModule, DatePickerModule, ChipModule, TableModule, BreadcrumbModule],
  templateUrl: './rolemanagement.html',
  styleUrl: './rolemanagement.css'
})
export class Rolemanagement implements OnInit {
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  loading: boolean = false;
  cols!: Column[];
  rows = 50;
  roles!: RoleField[];
  totalRoles:number = 0;
  allRoles!: RoleField[];
  globalFilter:string ='';
  showDetailForm:any = {show:false, action:"add"};

  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    console.log("USER INFO ", this.userInfo);
    this.cols = [
        { field: 'idRole', header: 'Id Role' },
        { field: 'roleName', header: 'Name' },
        { field: 'roleDescription', header: 'Description' }
    ];
    this.breaditems = [{ label: 'Management' }, { label: 'Role' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    await this._refreshListData();
  }
  async _refreshListData(){
    this.loading=true;
        fetch('/v2/admin/get_roles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })
          .then(res => {
            console.log("Response dari API  /v2/admin/get_roles", res);
            if (!res.ok) throw new Error('get QShopee Gagal');
            return res.json();
          })
          .then(data => {
            console.log("Response dari API /v2/admin/get_roles", data);
            this.loading=false;
            if (data.code === 20000) {
              // this.showProcedPostDialog = true;
              const dataRecordsTemp = cloneDeep(data.data);
              console.log("HARUSNYA ",data.data);

              console.log("Data View ", dataRecordsTemp.data);
              this.roles = dataRecordsTemp.data;
              this.loading=false;
            } else {
              this.roles = [];
              this.loading=false;
            }
          })
          .catch(err => {
            console.log("Response Error Catch /v2/admin/get_roles", err);
          });
  }
  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
  const term = this.globalFilter.trim().toLowerCase();
  if (term === '') {
    this.roles = [...this.allRoles];
  } else {
    this.roles = this.allRoles.filter(item =>
      [item.roleName, item.roleDescription]
        .some(field => field?.toLowerCase().includes(term))
    );
  }
  }
  async _manualSearch(){

  }
  async _addRole(){

  }
}
interface RoleField {
  idRole?: string | null;
  roleName?: string | null;
  roleDescription?: string | null;
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
