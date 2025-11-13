import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-bisnislist',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, SelectModule,DividerModule],
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
  idDataOld: string = "";
  loading: boolean = false;
  cols!: Column[];
  totalDatas: number = 0;
  datas!: any[];
  alldatas!: any[];
  showDetailForm: any = { show: false, action: "add" };
  showDetailDelete: boolean = false;
  showErrorPage: any = { show: false, message: "undefined" };
  errorMessage: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" };
  selectedData: any = {};
  rows = 50;
  globalFilter: string = '';
  dataForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });
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
    this.breaditems = [{ label: 'Siap-BIFAST' }, { label: 'Flow Bussines List' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  get f() {
    return this.dataForm.controls;
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
          console.log("Response dari API  /v2/siapbifast/get_bisnislist", res);
          if (!res.ok) throw new Error('get get_users Gagal');
          // if (!res.ok){
          //   this.showErrorPage = {show:true, message:res}
          // }
          return res.json();
        })
        .then(data => {
          console.log("Response dari API /v2/siapbifast/get_bisnislist", data);
          this.loading = false;
          // this.users = []; this.allUser = [];
          if (data.code === 20000) {
            const dataRecordsTemp = cloneDeep(data.data);
            this.datas = dataRecordsTemp;
            this.alldatas = this.datas;
            this.totalDatas = this.alldatas.length;
            this.loading = false;
          } else {
            this.datas = [];
            this.alldatas = [];
            this.loading = false;
            this.totalDatas = 0;
          // //   // this.showErrorPage = { show: true, message: data.message }
          }
        })
        .catch(err => {
          console.log("Response Error Catch /v2/siapbifast/get_bisnislist", err);
        });
  }
  onRowSelect(event: any) {
    console.log('Selected User:', event.data);
    const dataObj = event.data
    this.idDataOld = dataObj.id
      this.dataForm.patchValue({
      "id": this.idDataOld,
      "title": dataObj.title,
      "description": dataObj.description
      })
    this.showDetailForm = { show: true, action: "edit" };
  }
  _addData(){
      this.dataForm.patchValue({
      "id": null,
      "title": null,
      "description": null
    }
    )
    this.showDetailForm = { show: true, action: "add" };
  }
  _delData(event:any){
      console.log('Selected User:', event);
    const dataObj = event
    this.selectedData= dataObj;
    this.idDataOld = dataObj.id
      this.dataForm.patchValue({
      "id": this.idDataOld,
      "title": dataObj.title,
      "description": dataObj.description
      })
    this.showDetailDelete = true;
  }

  _graphData(){
    console.log("GRAPH");
    // setTimeout(() => {
        this.router.navigate(['/bifast/bisnislist/graph']);
      // }, 50);
  }
   _jsonData(){

  }
  onSubmit() {
    if (this.dataForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    this.loading = true;
    let objPayload = this.dataForm.value;
    console.log("Payload form ", objPayload);
    if (this.showDetailForm.action == "add") {
        this._saveAddData(objPayload);
    } else {
      console.log("Id Data Old : ", this.idDataOld);
      this._saveEditData(objPayload, this.idDataOld)
    }
  }
  _changeError() {
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
    const term = this.globalFilter.trim().toLowerCase();
    if (term === '') {
      this.datas = [...this.alldatas];
    } else {
      this.datas = this.alldatas.filter(item =>
        [item.title, item.description]
          .some(field => field?.toLowerCase().includes(term))
      );
    }
  }
  onCancel() {
    this.showDetailForm = { show: false, action: "add" };
  }
  async onOkDelete() {
    this.loading=true;
    console.log("data to delete ",this.selectedData);
    await this._saveDeleteData(this.selectedData);
    this.showDetailDelete=false;
  }
  onCancelDelete(){
      this.showDetailDelete=false;
  }
   _saveAddData(payload: any) {
    fetch('/v2/siapbifast/add_bisnislist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API  /v2/siapbifast/add_bisnislist", res);
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(async data => {
       console.log("Response dari API  /v2/siapbifast/add_bisnislist", data);
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          await this._refreshListData();
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
  _saveEditData(payload: any, idUser: string) {
    // payload = { ...payload, ...{ id: idUser } };
    // delete payload.password;
    console.log("Payload Edit ", payload);
    fetch('/v2/siapbifast/upd_bisnislist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error update data');
        return res.json();
      })
      .then(data => {
        // // console.log("Response dari API DATA ", JSON.parse(data));
        // // console.log("Response dari API DATA ", data);
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
    fetch('/v2/siapbifast/del_bisnislist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(async data => {
        // // console.log("Response dari API DATA ", JSON.parse(data));
        // // console.log("Response dari API DATA ", data);
        // this.loading=false;
        if (data.code === 20000) {
          await this._refreshListData();
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
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
