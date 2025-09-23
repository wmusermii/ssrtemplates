import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';
import cloneDeep from 'lodash-es/cloneDeep';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone:true,
  selector: 'app-menumanagement',
  imports: [CommonModule,TooltipModule, FormsModule,ReactiveFormsModule, ButtonModule, InputGroupModule,InputGroupAddonModule,InputTextModule,TextareaModule, TableModule, BreadcrumbModule, MessageModule,SelectModule],
  templateUrl: './menumanagement.html',
  styleUrl: './menumanagement.css'
})
export class Menumanagement implements OnInit {
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  loading: boolean = false;
  cols!: Column[];
  rows = 50;
  idMenuOld:string ="";
  menus!: MenuField[];
  allicons!:any[]
  totalMenus:number = 0;
  allMenus!: MenuField[];
  globalFilter:string ='';
  selectedMenu: MenuField = {};
  showDetailForm:any = {show:false, action:"add"};
  showDetailDelete:boolean = false;
  errorMessage:any = {error:false, severity:"error", message:"ini test", icon:"pi pi-exclamation-circle"};
  aclMenublob: any[] = [];
  menuForm = new FormGroup({
      nameMenu: new FormControl('', [Validators.required]),
      pathMenu: new FormControl(''),
      iconMenu: new FormControl(''),
      iconMenuObj: new FormControl({}),
  });
  get f() {
    return this.menuForm.controls;
  }
   _changeError(){
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    this.currentUrl = this.router.url;
    console.log('Current URL:', this.currentUrl);
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    // // console.log("USER INFO ", this.userInfo);
    this.cols = [
        { field: 'idMenu', header: 'Id' },
        { field: 'nameMenu', header: 'Menu' },
        { field: 'pathMenu', header: 'URL Link' },
        { field: 'iconMenu', header: 'iconcode' },
        { field: 'created_at', header: 'Create At' },
        { field: 'updated_at', header: 'Update At' }
    ];
    this.breaditems = [{ label: 'Management' }, { label: 'Menus' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    await this._refreshACLMenu();
    console.log("MENU ACL ", this.aclMenublob);
    if (this.aclMenublob.includes("rd")) {
       await this._refreshIconData();
       await this._refreshListData();
    }

  }
  async _refreshListData():Promise<void>{
      this.loading=true;
          fetch('/v2/admin/get_menus', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`,
              'x-client': 'angular-ssr'
            }
          })
            .then(res => {
              console.log("Response dari API  /v2/admin/get_menus", res);
              if (!res.ok) throw new Error('get QShopee Gagal');
              return res.json();
            })
            .then(data => {
              console.log("Response dari API /v2/admin/get_menus", data);
              this.loading=false;
              this.menus=[];this.allMenus=[];
              if (data.code === 20000) {
                const dataRecordsTemp = cloneDeep(data.data);
                this.menus = dataRecordsTemp;
                this.allMenus=this.menus;
                this.totalMenus = this.allMenus.length;
                this.loading=false;
              } else {
                this.menus = [];
                this.totalMenus = this.menus.length;
                this.loading=false;
              }
            })
            .catch(err => {
              console.log("Response Error Catch /v2/admin/get_roles", err);
            });
  }
  async _refreshACLMenu(): Promise<void> {
      const payload: any = { routeUrl: this.currentUrl };

      this.loading = true;

      try {
        const res = await fetch('/v2/auth/aclattrb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'x-client': 'angular-ssr'
          },
          body: JSON.stringify(payload)
        });

        console.log("Response dari API /v2/auth/aclattrb", res);

        const data = await res.json();
        console.log("Response dari API /v2/auth/aclattrb", data);

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
  async _refreshIconData():Promise<void>{
      this.loading=true;
          fetch('/v2/admin/get_icons', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`,
              'x-client': 'angular-ssr'
            }
          })
            .then(res => {
              console.log("Response dari API  /v2/admin/get_icons", res);
              if (!res.ok) throw new Error('get QShopee Gagal');
              return res.json();
            })
            .then(data => {
              console.log("Response dari API /v2/admin/get_icons", data);
              this.loading=false;
              this.menus=[];this.allMenus=[];
              if (data.code === 20000) {
                const dataRecordsTemp = cloneDeep(data.data);
                this.allicons = dataRecordsTemp;

                this.loading=false;
              } else {
                this.allicons = [];
                this.loading=false;
              }
            })
            .catch(err => {
              console.log("Response Error Catch /v2/admin/get_icons", err);
            });
  }
  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
  const term = this.globalFilter.trim().toLowerCase();
  if (term === '') {
    this.menus = [...this.allMenus];
  } else {
    this.menus = this.allMenus.filter(item =>
      [item.nameMenu, item.iconMenu]
        .some(field => field?.toLowerCase().includes(term))
    );
  }
  }
  onRowSelect(event: any) {
    console.log('Selected Menu:', event.data);
    const dataObj = event.data
    // Cari 1 object berdasarkan code
    let iconObject:any = {}
    this.idMenuOld = dataObj.idMenu;
    if(dataObj.iconMenu) {
      iconObject = this.allicons.find(x => x.code === dataObj.iconMenu);
    }
    this.menuForm.patchValue({
        "nameMenu": dataObj.nameMenu,
        "pathMenu": dataObj.pathMenu,
        "iconMenu": dataObj.iconMenu,
        "iconMenuObj": iconObject
      }
    )
    this.showDetailForm = {show:true, action:"edit"};
  }

  async _addMenu(){
    this.menuForm.patchValue({
        "nameMenu": null,
        "pathMenu": null,
        "iconMenu": null,
        "iconMenuObj": {}
      }
    )
    this.showDetailForm = {show:true, action:"add"};
  }
  async _delMenu(event:any){
    this.selectedMenu = event;
    this.showDetailDelete= true;
  }

  onSubmit() {
    if (this.menuForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    this.loading = true;
    let objPayload:any = this.menuForm.value;
    if(objPayload.iconMenuObj.id) objPayload.iconMenu=objPayload.iconMenuObj.code;
    if(!objPayload.iconMenuObj.id) objPayload.iconMenu=null;
    delete objPayload.iconMenuObj;
    console.log("Payload form ", objPayload);
    if(this.showDetailForm.action == "add") {
      this._saveAddData(objPayload)
    } else {
      objPayload = {...objPayload, ...{idMenu:this.idMenuOld}}
      this._saveEditData(objPayload)
    }


  }
  onCancel(){
      this.showDetailForm = {show:false, action:"add"};
  }
  async onOkDelete() {
    this.loading=true;
    console.log("data to delete ",this.selectedMenu);
    await this._saveDeleteData(this.selectedMenu);
    this.showDetailDelete=false;
  }
  onCancelDelete(){
      this.showDetailDelete=false;
  }
  _saveAddData(payload:any) {
    fetch('/v2/admin/add_menu', {
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
  _saveEditData(payload:any) {

    // payload = {...payload, ...{idRoleOld:idRoleOld}}

    fetch('/v2/admin/upd_menu', {
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
    fetch('/v2/admin/del_menu', {
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
interface MenuField {
  idMenu?: number | null;
  nameMenu?: string | null;
  pathMenu?: string | null;
  idAppMenu?: string | null;
  iconMenu?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
