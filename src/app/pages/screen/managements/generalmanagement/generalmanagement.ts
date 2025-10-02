import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-generalmanagement',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, TreeModule, DragDropModule, TabsModule, DividerModule, ToggleSwitchModule, PasswordModule, SelectModule],
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
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    this.breaditems = [{ label: 'Management' }, { label: 'General' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    await this._refreshGeneralData();
    await this._refreshPasswordData();
    await this._refreshSMTPData();
  }
  _onChangeListener() {
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
      console.log("database Test : ", this.databaseForm.value);
      this.loading = true;
      let payloadConfig: any = this.databaseForm.value;
      payloadConfig.client = payloadConfig?.clientObj?.key
      delete payloadConfig.clientObj;
      console.log("Payload Test : ", payloadConfig);
      await this._testDatabaseConnection(payloadConfig);
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
        console.log("Response dari API  /v2/admin/test_database", res);
        // if (!res.ok) throw new Error('get Test Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/test_database", data);
        this.loading = false;
        if (data.code === 20000) {
          this.loading = false;
        } else {
          this.loading = false;
        }
      })
      .catch(err => {
        this.loading = false;
        console.log("Response Error Catch /v2/admin/test_database", err);
      });
  }

  async _databaseMigration(): Promise<void> {

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
        console.log("Response dari API  /v2/admin/get_parambygroup", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/get_parambygroup", data);
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
        console.log("Response dari API  /v2/admin/get_parambygroup", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/get_parambygroup", data);
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
        console.log("Response dari API  /v2/admin/get_parambygroup", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/get_parambygroup", data);
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
        console.log("Response dari API  /v2/admin/upd_parambygroup", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/upd_parambygroup", data);
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
