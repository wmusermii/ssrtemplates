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

@Component({
  standalone:true,
  selector: 'app-generalmanagement',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, TreeModule, DragDropModule, TabsModule,DividerModule],
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

   generalForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      cookietime: new FormControl('', [Validators.required]),
      maxloginattempt: new FormControl(100, [Validators.required]),
      userMinLength: new FormControl(6, [Validators.required]),
      minLength:new FormControl(8, [Validators.required]),
      requireUppercase:new FormControl(true),
      requireNumber:new FormControl(true),
      requireSpecialChar:new FormControl(true),
      allowedSpecialChars:new FormControl('!@#$%^&*()_+[]{}|;:,.?~-'),
  });



  errorMessage: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" }
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  ngOnInit(): void {
    this.breaditems = [{ label: 'Management' }, { label: 'General' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  _generalOnSubmit(){

  }
  _smtpOnSubmit(){

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
