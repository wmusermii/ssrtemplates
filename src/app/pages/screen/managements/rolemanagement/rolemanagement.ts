import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';

@Component({
  standalone:true,
  selector: 'app-rolemanagement',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, DatePickerModule, ChipModule, TableModule, BreadcrumbModule],
  templateUrl: './rolemanagement.html',
  styleUrl: './rolemanagement.css'
})
export class Rolemanagement implements OnInit {
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  ngOnInit(): void {
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    console.log("USER INFO ", this.userInfo);
    this.breaditems = [{ label: 'Management' }, { label: 'Role' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };

  }
}
