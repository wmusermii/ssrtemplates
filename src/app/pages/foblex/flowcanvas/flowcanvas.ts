import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
// import { Flow, FlowModule, FlowNode, FlowConnection } from '@foblex/flow';
import { ButtonModule } from 'primeng/button';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';
import { FFlowModule } from '@foblex/flow';
@Component({
  selector: 'app-flowcanvas',
  imports: [
    CommonModule,
    BreadcrumbModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FFlowModule
  ],
  templateUrl: './flowcanvas.html',
  styleUrls: ['./flowcanvas.css']
})
export class Flowcanvas implements OnInit {
//  @ViewChild('flowCanvas', { static: true }) flowCanvas!: ElementRef;
  breaditems: MenuItem[] = [];
  home: MenuItem | undefined;



  constructor(private router: Router, private ssrStorage: LocalstorageService,
    @Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    this.breaditems = [{ label: 'Flowdiagram' }, { label: 'Foblex Sample' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }



}

