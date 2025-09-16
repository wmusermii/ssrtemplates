import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule,ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import cloneDeep from 'lodash-es/cloneDeep';
import { MessageModule } from 'primeng/message';
@Component({
  standalone:true,
  selector: 'app-rolemanagement',
  imports: [CommonModule, FormsModule,ReactiveFormsModule, ButtonModule, InputGroupModule,InputGroupAddonModule,InputTextModule,TextareaModule, TableModule, BreadcrumbModule, MessageModule],
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
  idRoleOld:string ="";
  roles!: RoleField[];
  totalRoles:number = 0;
  allRoles!: RoleField[];
  globalFilter:string ='';
  selectedRole: RoleField = {};
  showDetailForm:any = {show:false, action:"add"};
  showDetailDelete:boolean = false;
  showErrorPage:any = {show:false, message:"undefined"};
  errorMessage:any = {error:false, severity:"error", message:"ini test", icon:"pi pi-exclamation-circle"};
  roleForm = new FormGroup({
      idRole: new FormControl('', [Validators.required]),
      roleName: new FormControl('', [Validators.required]),
      roleDescription: new FormControl(''),
  });
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  // Helper getter untuk akses kontrol form di template
  get f() {
    return this.roleForm.controls;
  }
  _changeError(){
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
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
            'Authorization': `Bearer ${this.token}`,
            'x-client': 'angular-ssr'
          }
        })
          .then(res => {
            console.log("Response dari API  /v2/admin/get_roles", res);
            // if (!res.ok) throw new Error('get get_roles Gagal');
            // if (!res.ok){
            //   this.showErrorPage = {show:true, message:res}
            // }
            return res.json();
          })
          .then(data => {
            console.log("Response dari API /v2/admin/get_roles", data);
            this.loading=false;
            this.roles=[];this.allRoles=[];
            if (data.code === 20000) {
              const dataRecordsTemp = cloneDeep(data.data);
              this.roles = dataRecordsTemp;
              this.allRoles=this.roles;
              this.totalRoles = this.allRoles.length;
              this.loading=false;
            } else {
              this.roles = [];
              this.totalRoles = this.roles.length;
              this.loading=false;
              this.showErrorPage = {show:true, message:data.message}
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
      [item.idRole,item.roleName, item.roleDescription]
        .some(field => field?.toLowerCase().includes(term))
    );
  }
  }
  onRowSelect(event: any) {
    console.log('Selected Role:', event.data);
    const dataObj = event.data
    this.idRoleOld = dataObj.idRole
    this.roleForm.patchValue({
        "idRole": dataObj.idRole,
        "roleName": dataObj.roleName,
        "roleDescription": dataObj.roleDescription
      }
    )
    this.showDetailForm = {show:true, action:"edit"};
  }

  async _addRole(){
    this.roleForm.patchValue({
        "idRole": null,
        "roleName": null,
        "roleDescription": null
      }
    )
    this.showDetailForm = {show:true, action:"add"};
  }
  async _delRole(event:any){
    this.selectedRole = event;
    this.showDetailDelete= true;
  }

  onSubmit() {
    if (this.roleForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    this.loading = true;
    const objPayload = this.roleForm.value;
    console.log("Payload form ", objPayload);
    if(this.showDetailForm.action == "add") {
      this._saveAddData(objPayload)
    } else {
      this._saveEditData(objPayload,this.idRoleOld)
    }
    // const payload = {credential:btoa(`${objPayload.username}:${objPayload.password}`)}
    // const credential = btoa(`${objPayload.username}:${objPayload.password}`);

  }
  onCancel(){
      this.showDetailForm = {show:false, action:"add"};
  }
  async onOkDelete() {
    this.loading=true;
    console.log("data to delete ",this.selectedRole);
    await this._saveDeleteData(this.selectedRole);
    this.showDetailDelete=false;
  }
  onCancelDelete(){
      this.showDetailDelete=false;
  }
  _saveAddData(payload:any) {
    fetch('/v2/admin/add_role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API DATA ", JSON.parse(data));
        console.log("Response dari API DATA ", data);
        this.loading=false;
        if(data.code === 20000) {
          this.showDetailForm = {show:false, action:"add"};
          this._refreshListData();
        } else {
          this.errorMessage = {error:true, severity:"error", message:`${data.message}`, icon:"pi pi-times"}
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = {error:true, severity:"error", message:`${err}`, icon:"pi pi-times"}
      });
  }
  _saveEditData(payload:any, idRoleOld:string) {

    payload = {...payload, ...{idRoleOld:idRoleOld}}

    fetch('/v2/admin/upd_role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error update data');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API DATA ", JSON.parse(data));
        console.log("Response dari API DATA ", data);
        this.loading=false;
        if(data.code === 20000) {
          this.showDetailForm = {show:false, action:"add"};
          this._refreshListData();
        } else {
          this.errorMessage = {error:true, severity:"error", message:`${data.message}`, icon:"pi pi-times"}
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = {error:true, severity:"error", message:`${err}`, icon:"pi pi-times"}
      });
  }
  async _saveDeleteData(payload:any) {
    fetch('/v2/admin/del_role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(async data => {
        // console.log("Response dari API DATA ", JSON.parse(data));
        console.log("Response dari API DATA ", data);
        // this.loading=false;
        if(data.code === 20000) {
          await this._refreshListData();
        } else {
          this.errorMessage = {error:true, severity:"error", message:`${data.message}`, icon:"pi pi-times"}
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = {error:true, severity:"error", message:`${err}`, icon:"pi pi-times"}
      });
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
