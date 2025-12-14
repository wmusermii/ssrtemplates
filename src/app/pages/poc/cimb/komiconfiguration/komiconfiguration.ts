import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-komiconfiguration',
  standalone:true,
  imports: [CommonModule, Breadcrumb],
  templateUrl: './komiconfiguration.html',
  styleUrl: './komiconfiguration.css'
})
export class Komiconfiguration implements OnInit {

     currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
   constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    // console.log('Current URL:', this.currentUrl);
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    // // console.log("USER INFO ", this.userInfo);
    this.breaditems = [{ label: 'Komi Configuration' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
