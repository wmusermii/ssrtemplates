import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loanrequest',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, SelectModule],
  templateUrl: './loanrequest.html',
  styleUrl: './loanrequest.css'
})
export class Loanrequest implements OnInit {
  errorMessage: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" };
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  allMethod: any[] = [{ key: 'GET', label: 'GET' }, { key: 'POST', label: 'POST' }, { key: 'PUT', label: 'PUT' }, { key: 'DEL', label: 'DEL' }]
  loading: boolean = false;
  loanForm = new FormGroup({
    urlFlowable: new FormControl('', [Validators.required]),
    methodReqObj: new FormControl(null, [Validators.required]),
    methodReq: new FormControl(''),
    jsonBody: new FormControl('', [Validators.required])
  });
  get f() {
    return this.loanForm.controls;
  }

  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    this.breaditems = [{ label: 'Channel' }, { label: 'Loan Request' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    await this._refreshurlFlowable();
  }
  _changeError() {
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
  async onSubmit() {
    if (this.loanForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    let payloadTemp: any = this.loanForm.value;
    payloadTemp.methodReq = payloadTemp.methodReqObj.key;
    delete payloadTemp.methodReqObj;
    payloadTemp.jsonBody = JSON.parse(payloadTemp.jsonBody);
    this.loading = true;
    await this._submitTask(payloadTemp);
  }

  async _submitTask(payload:any): Promise<void>{
      this.loading=true;
    fetch('/v2/app/createflowableTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'x-client': 'angular-ssr'
      }, body: JSON.stringify(payload)
    })
      .then(res => {
       console.log("Response dari API  /v2/app/createflowableTask", res);
        if (!res.ok) throw new Error('get create Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/app/createflowableTask", data);
        // this.loading=false;
        if (data.code === 20000) {
          this.loading=false;
        } else {
          this.loading=false;
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/app/getflowableparambygrp", err);
      });
  }


  async _refreshurlFlowable(): Promise<void> {

    const payload = { fa_group: "FLOWTASK", fa_key: "createtaskurl" }
    fetch('/v2/app/getflowableparambygrp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'x-client': 'angular-ssr'
      }, body: JSON.stringify(payload)
    })
      .then(res => {
       console.log("Response dari API  /v2/admin/getflowableparambygrp", res);
        if (!res.ok) throw new Error('get Title Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/getflowableparambygrp", data);
        // this.loading=false;
        if (data.code === 20000) {
          const dataList = data.data;
          const jsontmp:any = dataList.find((d: { fa_key: string; }) => d.fa_key === "bodyjson")?.fa_value;
          const jsonstr = JSON.parse(jsontmp);
          const formattedJson = JSON.stringify(jsonstr, null, 2); // format rapi 2 spasi
          this.loanForm.patchValue({
            urlFlowable: dataList.find((d: { fa_key: string; }) => d.fa_key === "createtaskurl")?.fa_value,
            jsonBody: formattedJson
          })
        } else {

        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/app/getflowableparambygrp", err);
      });
  }

}
