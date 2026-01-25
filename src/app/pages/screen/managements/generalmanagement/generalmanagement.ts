import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DragDropModule } from 'primeng/dragdrop';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';
import { TreeModule } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import cloneDeep from 'lodash-es/cloneDeep';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';

@Component({
  standalone: true,
  selector: 'app-generalmanagement',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, TreeModule, DragDropModule, TabsModule, DividerModule, ToggleSwitchModule, PasswordModule, SelectModule,ChipModule,TagModule],
  templateUrl: './generalmanagement.html',
  styleUrl: './generalmanagement.css'
})
export class Generalmanagement implements OnInit {
  loading: boolean = false;
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  cols!: Column[];
  rows = 50;
  params!: ParamField[];
  allParams!: ParamField[];
  selectedParam: ParamField = {};
  idParamOld: string = "";
  totalParam: number = 0;
  showDetailForm: any = { show: false, action: "add" };
  showDetailDelete: boolean = false;
  showErrorPage: any = { show: false, message: "undefined" };
  errorMessage: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" };
  aclMenublob: any[] = [
          "cr",
          "rd",
          "vw",
          "up",
          "dl"
        ];
  paramForm = new FormGroup({
    paramgroup: new FormControl('', [Validators.required]),
    paramkey: new FormControl('', [Validators.required]),
    paramvalue: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });
  globalFilter: string = '';
  //##########################################################
  listClass: any[] = [{ key: 'pg', label: 'Postgres' }, { key: 'mysql2', label: 'MySQL' }, { key: 'mssql', label: 'Microsoft SQL' }, { key: 'oracledb', label: 'ORACLE' }]
  readyMigrate: boolean = false;
  generalForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    cookietime: new FormControl('', [Validators.required]),
    maxloginattempt: new FormControl(0, [Validators.required]),
    userMinLength: new FormControl(0, [Validators.required]),
    minLength: new FormControl(0, [Validators.required]),
    requireUppercase: new FormControl(false),
    requireNumber: new FormControl(false),
    requireSpecialChar: new FormControl(false),
    allowedSpecialChars: new FormControl(''),
  });

  smtpForm = new FormGroup({
    service: new FormControl('', [Validators.required]),
    smtp: new FormControl('', [Validators.required]),
    usermail: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    port: new FormControl('', [Validators.required]),
  });

  databaseForm = new FormGroup({
    client: new FormControl(''),
    clientObj: new FormControl(null, [Validators.required]),
    condatabase: new FormControl('', [Validators.required]),
    conhost: new FormControl('', [Validators.required]),
    conport: new FormControl(5432, [Validators.required]),
    conuser: new FormControl('', [Validators.required]),
    conpassword: new FormControl('', [Validators.required]),
    conoption: new FormControl({}),
  });

  errorMessageG: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" }
  errorMessageS: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" }
  errorMessageD: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" }
  constructor(private router: Router, private ssrStorage: LocalstorageService,private cdr: ChangeDetectorRef) { }
  async ngOnInit(): Promise<void> {
    this.breaditems = [{ label: 'Settings' }, { label: 'Configuration' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    // console.log("USER INFO ", this.userInfo);
    this.cols = [
      { field: 'paramgroup', header: 'Group' },
      { field: 'paramkey', header: 'Key' },
      { field: 'paramvalue', header: 'Value' },
      { field: 'description', header: 'Description' }
    ];
    // await this._refreshACLMenu();
    await this._refreshGeneralData();
    await this._refreshPasswordData();
    await this._refreshParamData();
    await this._refreshSMTPData();
  }
  onChangeListener(event: Event) {
    console.log('Change detected, readyMigrate:', this.readyMigrate);
    this.readyMigrate = false;
  }
  async _generalOnSubmit() {
    if (this.generalForm.valid) {
      console.log("General value : ", this.generalForm.value);
      let payload: any = this.generalForm.value;
      this.loading = true
      payload = { ...payload, ...{ paramgroup: 'GENERAL' } }
      await this._updateGeneralData(payload);
    }
  }
  async _smtpOnSubmit() {
    if (this.smtpForm.valid) {
      console.log("SMTP value : ", this.smtpForm.value);
      let payload: any = this.smtpForm.value;
      this.loading = true
      payload = { ...payload, ...{ paramgroup: 'SMTPATTRB' } }
      await this._updateGeneralData(payload);
    }
  }
  async _databaseOnTestConnection() {
    if (this.databaseForm.valid) {
      this.loading = true;
      let payloadConfig: any = this.databaseForm.value;
      payloadConfig.client = payloadConfig?.clientObj?.key
      // delete payloadConfig.clientObj;
      console.log("Payload Test : ", payloadConfig);
      await this._testDatabaseConnection(payloadConfig);
    }
  }
  async _databaseOnMigrate() {
    if (this.databaseForm.valid) {
      this.loading = true;
      let payloadConfig: any = this.databaseForm.value;
      payloadConfig.client = payloadConfig?.clientObj?.key
      // delete payloadConfig.clientObj;
      console.log("Payload Migration Test : ", payloadConfig);
      await this._databaseMigration(payloadConfig);
    }
  }
  async _addParam() {

    this.paramForm.patchValue({
      "paramgroup": null,
      "paramkey": null,
      "paramvalue": null,
      "description": null
    }
    )
    // this.setCreateMode();

    this.showDetailForm = { show: true, action: "add" };
  }
  async _delParam(event: any) {
    this.selectedParam = event;
    this.showDetailDelete = true;
  }
   async onOkDelete() {
    this.loading = true;
    console.log("data to delete ", this.selectedParam);
    await this._saveDeleteParamData(this.selectedParam);
    this.showDetailDelete = false;
  }
  onCancelDelete() {
    this.showDetailDelete = false;
  }
  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
    const term = this.globalFilter.trim().toLowerCase();
    if (term === '') {
      this.params = [...this.allParams];
    } else {
      this.params = this.allParams.filter(item =>
        [item.paramgroup, item.paramkey, item.paramvalue]
          .some(field => field?.toLowerCase().includes(term))
      );
    }
  }
  async _testDatabaseConnection(optionconfig:any): Promise<void> {
    fetch('/v2/admin/test_database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify({config:optionconfig})
    })
      .then(res => {
        // console.log("Response dari API  /v2/admin/test_database", res);
        // if (!res.ok) throw new Error('get Test Gagal');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API /v2/admin/test_database", data);
        this.loading = false;
        if (data.code === 20000) {
          this.errorMessageD ={ error: true, severity: "success", message: data.message, icon: "pi pi-check" }
          this.readyMigrate=true;
          this.loading = false;
        } else {
          this.errorMessageD ={ error: true, severity: "error", message: data.data.message, icon: "pi pi-exclamation-circle" }
          this.loading = false;
        }
      })
      .catch(err => {
        this.loading = false;
        console.log("Response Error Catch /v2/admin/test_database", err);
      });
  }
  async _databaseMigration(optionconfig:any): Promise<void> {
      fetch('/v2/admin/migrate_database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify({config:optionconfig})
    })
      .then(res => {
        // console.log("Response dari API  /v2/admin/migrate_database", res);
        // if (!res.ok) throw new Error('get Test Gagal');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API /v2/admin/migrate_database", data);
        this.loading = false;
        if (data.code === 20000) {
          this.errorMessageD ={ error: true, severity: "success", message: data.message, icon: "pi pi-check" }
          this.readyMigrate=false;
          this.loading = false;
        } else {
          this.errorMessageD ={ error: true, severity: "error", message: data.data.message, icon: "pi pi-exclamation-circle" }
          this.readyMigrate=false;
          this.loading = false;
        }
      })
      .catch(err => {
        this.loading = false;
        console.log("Response Error Catch /v2/admin/migrate_database", err);
      });
  }
  async _refreshGeneralData(): Promise<void> {
    this.loading = true;
    const payload = { paramgroup: "GENERAL" }
    fetch('/v2/admin/get_parambygroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API  /v2/admin/get_parambygroup", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API /v2/admin/get_parambygroup", data);
        this.loading = false;

        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
          this.generalForm.patchValue(
            {
              title: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "title").paramvalue,
              cookietime: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "cookietime").paramvalue,
              maxloginattempt: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "maxloginattempt").paramvalue,
              userMinLength: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "userMinLength").paramvalue,
            }
          )

          this.loading = false;
        } else {

          this.loading = false;
        }
      })
      .catch(err => {
        this.loading = false;
        console.log("Response Error Catch /v2/admin/get_parambygroup", err);
      });
  }
  async _refreshParamData(): Promise<void> {
    this.loading = true;
    fetch('/v2/admin/get_params', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      }
    })
      .then(res => {
        console.log("Response dari API  /v2/admin/get_params", res);
        if (!res.ok) throw new Error('get Params Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/get_params", data);
        this.loading = false;

        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
            this.params = dataRecordsTemp;
            this.allParams = this.params;
            this.totalParam = this.allParams.length;
            this.loading = false;this.cdr.detectChanges();
        } else {
            this.params = [];
            this.allParams = this.params;
            this.totalParam = this.allParams.length;
            this.loading = false;this.cdr.detectChanges();
        }
      })
      .catch(err => {
        this.loading = false;
        console.log("Response Error Catch /v2/admin/get_parambygroup", err);
      });
  }
  async _refreshPasswordData(): Promise<void> {
    this.loading = true;
    const payload = { paramgroup: "PASSATTRB" }
    fetch('/v2/admin/get_parambygroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API  /v2/admin/get_parambygroup", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API /v2/admin/get_parambygroup", data);
        this.loading = false;

        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
          this.generalForm.patchValue(
            {
              minLength: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "minLength").paramvalue,
              requireUppercase: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "requireUppercase").paramvalue === 'true' ? true : false,
              requireNumber: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "requireNumber").paramvalue === 'true' ? true : false,
              requireSpecialChar: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "requireSpecialChar").paramvalue === 'true' ? true : false,
              allowedSpecialChars: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "allowedSpecialChars").paramvalue,
            }
          )

          this.loading = false;
        } else {

          this.loading = false;
        }
      })
      .catch(err => {
        this.loading = false;
        console.log("Response Error Catch /v2/admin/get_parambygroup", err);
      });
  }
  async _refreshSMTPData() {
    this.loading = true;
    const payload = { paramgroup: "SMTPATTRB" }
    fetch('/v2/admin/get_parambygroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API  /v2/admin/get_parambygroup", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API /v2/admin/get_parambygroup", data);
        this.loading = false;

        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
          this.smtpForm.patchValue(
            {
              service: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "service").paramvalue,
              smtp: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "smtp").paramvalue,
              usermail: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "usermail").paramvalue,
              password: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "password").paramvalue,
              port: dataRecordsTemp.find((item: { paramkey: any; }) => item.paramkey === "port").paramvalue
            }
          )
          this.loading = false;
        } else {

          this.loading = false;
        }
      })
      .catch(err => {
        this.loading = false;
        console.log("Response Error Catch /v2/admin/get_parambygroup", err);
      });
  }
  // Helper getter untuk akses kontrol form di template
  get gf() {
    return this.generalForm.controls;
  }
  get sf() {
    return this.smtpForm.controls;
  }
  get df() {
    return this.databaseForm.controls;
  }
  async _updateGeneralData(payload: any): Promise<void> {
    this.loading = true;
    // const payload = {paramgroup: "SMTPATTRB"}
    fetch('/v2/admin/upd_parambygroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API  /v2/admin/upd_parambygroup", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API /v2/admin/upd_parambygroup", data);
        this.loading = false;
        if (data.code === 20000) {
          // const dataRecordsTemp = cloneDeep(data.data);
          this.loading = false;
        } else {
          this.loading = false;
        }
      })
      .catch(err => {
        this.loading = false;
        console.log("Response Error Catch /v2/admin/upd_parambygroup", err);
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
              // 'Authorization': `Bearer ${this.token}`,
              'x-client': 'angular-ssr'
            },
            body: JSON.stringify(payload)
          });
          // console.log("Response dari API /v2/auth/aclattrb", res);
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
  onRowSelect(event: any) {
    console.log('Selected Param:', event.data);
     const dataObj = event.data
    this.idParamOld = dataObj.id
    this.paramForm.patchValue({
      "paramgroup": dataObj.paramgroup,
      "paramkey": dataObj.paramkey,
      "paramvalue": dataObj.paramvalue,
      "description": dataObj.description
    }
    )
    this.showDetailForm = { show: true, action: "edit" };this.cdr.detectChanges();
  }

  _changeError() {
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
  onCancel() {
    this.showDetailForm = { show: false, action: "add" };
  }
  async onSubmitParams() {
    if (this.paramForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    this.loading = true;
    let objPayload = this.paramForm.value;
    if (this.showDetailForm.action == "add") {
      await this._saveParamData(objPayload)

    } else {
      console.log("IdUserOLD : ", this.idParamOld);
      this._saveEditParamData(objPayload, this.idParamOld)
    }
  }
  async _saveParamData(payload:any): Promise<void> {
    this.loading = true;
    // let payloadObjec = {payload:payload}
    fetch('/v2/admin/add_param', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(async data => {
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          await this._refreshParamData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }
  async _saveEditParamData(payload: any, idParam: string): Promise<void> {
    payload = { ...payload, ...{ id: idParam } };
    console.log("Payload Edit ", payload);
    fetch('/v2/admin/upd_param', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error update data');
        return res.json();
      })
      .then(data => {
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          this._refreshParamData()
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
  async _saveDeleteParamData(payload:any): Promise<void> {
    this.loading = true;
    // let payloadObjec = {payload:payload}
    fetch('/v2/admin/del_param', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(async data => {
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          await this._refreshParamData();
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
interface dataField {
  id?: number | null;
  paramgroup?: string | null;
  paramkey?: string | null;
  paramvalue?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
interface ParamField {
  id?: number | null;
  paramgroup?: string | null;
  paramkey?: string | null;
  paramvalue?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  for_app?: number | null;
  description?: string | null;
}
