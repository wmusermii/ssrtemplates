import { Component, OnInit } from '@angular/core';
import { Tasklistmanager } from "../../../flowabledirective/tasklistmanager/tasklistmanager";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { MenuItem } from 'primeng/api';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';
import { FlowableConfig } from '../../../flowabledirective/taskservice/taskservice';

@Component({
  selector: 'app-tasklist',
  imports: [Tasklistmanager,CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, TreeModule, DragDropModule, TabsModule, DividerModule, ToggleSwitchModule, PasswordModule, SelectModule],
  templateUrl: './tasklist.html',
  styleUrl: './tasklist.css'
})
export class Tasklist implements OnInit {
  baseUrl?:string;
  username?:string;
  password?:string = 'manage';
  loading: boolean = false;
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
    constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  ngOnInit(): void {
    console.log("*** TaskList Component ");
     this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
     this.breaditems = [{ label: 'Flowable' }, { label: 'Task List' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    console.log("User Info : ",this.userInfo);
    this.username = this.userInfo.username;
    this.baseUrl= `/flowable-task/process-api/runtime/tasks?candidateGroup=${this.userInfo.groupname}&includeProcessVariables=true`

    //       {
//     "iduser": "725705062",
//     "username": "riskcontrol",
//     "fullname": "Risk Controll",
//     "mobile": "20",
//     "email": "wmusermii@gmail.com",
//     "idgroup": "123402",
//     "groupname": "rcgroup",
//     "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
//     "ip": "::ffff:172.20.32.1"
// }



  }
  onRowSelected(event:any) {
      console.log("Row ", event);
  }
}
