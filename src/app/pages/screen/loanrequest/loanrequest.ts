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
  imports: [CommonModule,TooltipModule, FormsModule,ReactiveFormsModule, ButtonModule, InputGroupModule,InputGroupAddonModule,InputTextModule,TextareaModule, TableModule, BreadcrumbModule, MessageModule,SelectModule],
  templateUrl: './loanrequest.html',
  styleUrl: './loanrequest.css'
})
export class Loanrequest implements OnInit {
  errorMessage:any = {error:false, severity:"error", message:"ini test", icon:"pi pi-exclamation-circle"};
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  allMethod:any[] = [{key:'GET', label:'GET'},{key:'POST', label:'POST'},{key:'PUT', label:'PUT'},{key:'DEL', label:'DEL'}]

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
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    this.breaditems = [{ label: 'Channel' }, { label: 'Loan Request' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
   _changeError(){
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
   onSubmit() {
    if (this.loanForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    let payloadTemp:any = this.loanForm.value;
    payloadTemp.methodReq = payloadTemp.methodReqObj.key;
    delete payloadTemp.methodReqObj;
    this.loading = true;
    this.ssrStorage.setItem("urlflowable", payloadTemp.urlFlowable);
    this.ssrStorage.setItem("methodReq", payloadTemp.methodReq);
    this.ssrStorage.setItem("jsonBody", payloadTemp.jsonBody);
    console.log("Payload Body ",payloadTemp );
  }
}
