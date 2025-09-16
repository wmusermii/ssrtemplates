import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import cloneDeep from 'lodash-es/cloneDeep';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  selector: 'app-groupmanagement',
  imports: [CommonModule,TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule],
  templateUrl: './groupmanagement.html',
  styleUrl: './groupmanagement.css'
})
export class Groupmanagement implements OnInit {
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  loading: boolean = false;
  cols!: Column[];
  rows = 50;
  idRoleOld: string = "";
  groups!: GroupField[];
  totalGroups: number = 0;
  allGroups!: GroupField[];
  globalFilter: string = '';
  selectedGroup: GroupField = {};
  showDetailForm: any = { show: false, action: "add" };
  showDetailDelete: boolean = false;
  showErrorPage: any = { show: false, message: "undefined" };
  errorMessage: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" };
  groupForm = new FormGroup({
    idgroup: new FormControl('', [Validators.required]),
    groupname: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  get f() {
    return this.groupForm.controls;
  }
  _changeError(){
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    console.log("USER INFO ", this.userInfo);
    this.cols = [
      { field: 'idgroup', header: 'Id Group' },
      { field: 'groupname', header: 'Name' },
      { field: 'description', header: 'Description' }
    ];
    this.breaditems = [{ label: 'Management' }, { label: 'Groups' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    await this._refreshListData();
  }
  async _refreshListData() {
    this.loading = true;
    fetch('/v2/admin/get_groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      }
    })
      .then(res => {
        console.log("Response dari API  /v2/admin/get_groups", res);
        // if (!res.ok) throw new Error('get get_groups Gagal');
        // if (!res.ok){
        //   this.showErrorPage = {show:true, message:res}
        // }
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/get_groups", data);
        this.loading = false;
        this.groups = []; this.allGroups = [];
        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
          this.groups = dataRecordsTemp;
          this.allGroups = this.groups;
          this.totalGroups = this.allGroups.length;
          this.loading = false;
        } else {
          this.groups = [];
          this.totalGroups = this.groups.length;
          this.loading = false;
          this.showErrorPage = { show: true, message: data.message }
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/admin/get_groups", err);
      });
  }
  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
    const term = this.globalFilter.trim().toLowerCase();
    if (term === '') {
      this.groups = [...this.allGroups];
    } else {
      this.groups = this.allGroups.filter(item =>
        [item.idgroup, item.groupname, item.description]
          .some(field => field?.toLowerCase().includes(term))
      );
    }
  }
  onRowSelect(event: any) {
    console.log('Selected Role:', event.data);
    const dataObj = event.data
    this.idRoleOld = dataObj.idRole

    this.groupForm.patchValue({
      "idgroup": dataObj.idRole,
      "groupname": dataObj.roleName,
      "description": dataObj.roleDescription
    }
    )
    this.showDetailForm = { show: true, action: "edit" };
  }

  async _addGroup() {
    this.groupForm.patchValue({
      "idgroup": null,
      "groupname": null,
      "description": null
    }
    )
    this.showDetailForm = { show: true, action: "add" };
  }
  async _delGroup(event: any) {
    this.selectedGroup = event;
    this.showDetailDelete = true;
  }

  onSubmit() {
    if (this.groupForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    this.loading = true;
    const objPayload = this.groupForm.value;
    console.log("Payload form ", objPayload);
    if (this.showDetailForm.action == "add") {
      this._saveAddData(objPayload)
    } else {
      this._saveEditData(objPayload, this.idRoleOld)
    }
    // const payload = {credential:btoa(`${objPayload.username}:${objPayload.password}`)}
    // const credential = btoa(`${objPayload.username}:${objPayload.password}`);

  }
  onCancel() {
    this.showDetailForm = { show: false, action: "add" };
  }
  async onOkDelete() {
    this.loading = true;
    console.log("data to delete ", this.selectedGroup);
    await this._saveDeleteData(this.selectedGroup);
    this.showDetailDelete = false;
  }
  onCancelDelete() {
    this.showDetailDelete = false;
  }
  _saveAddData(payload: any) {
    fetch('/v2/admin/add_group', {
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
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }
  _saveEditData(payload: any, idRoleOld: string) {

    payload = { ...payload, ...{ idRoleOld: idRoleOld } }

    fetch('/v2/admin/upd_group', {
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
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }
  async _saveDeleteData(payload: any) {
    fetch('/v2/admin/del_group', {
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
        if (data.code === 20000) {
          await this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }
}
interface GroupField {
  idgroup?: string | null;
  groupname?: string | null;
  menublob?: string | null;
  description?: string | null;
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
