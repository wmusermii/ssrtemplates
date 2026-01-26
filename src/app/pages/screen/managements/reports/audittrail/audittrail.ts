import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { LocalstorageService } from '../../../../../guard/ssr/localstorage/localstorage.service';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-audittrail',
  imports: [
    CommonModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    TextareaModule,
    TableModule,
    BreadcrumbModule,
    MessageModule,
    ChipModule,
    TagModule,
    ToggleSwitchModule,
    DividerModule,
    PasswordModule,
    SelectModule,
    CardModule,
    DatePicker,
    AutoCompleteModule
  ],
  templateUrl: './audittrail.html',
  styleUrl: './audittrail.css'
})
export class Audittrail implements OnInit {
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  loading: boolean = false;
  cols!: Column[];
  rows = 50;
  aclMenublob: any[] = [];
  isBrowser = false;

  // Filter model
  filter = {
    fromDate: null as Date | null,
    toDate: null as Date | null,
    auditType: null as string | null,
    systemName: null as string | null,
    userName: '',
    activity: null as string | null,
    format: 'csv'
  };

  // Dropdown options
  auditTypes = [
    { label: 'All', value: null },
    { label: 'AUDIT_LOG', value: 'AUDIT_LOG' },
    { label: 'SECURITY_LOG', value: 'SECURITY_LOG' }
  ];

  systemNames = [
    { label: 'All', value: null },
    { label: 'Single Application', value: 'Single Application' },
    { label: 'Core Banking', value: 'Core Banking' }
  ];

  activities = [
    { label: 'All', value: null },
    { label: 'LOGIN', value: 'LOGIN' },
    { label: 'LOGOUT', value: 'LOGOUT' },
    { label: 'TRANSFER', value: 'TRANSFER' }
  ];

  formats = [
    { label: 'CSV', value: 'csv' },
    { label: 'Excel (XLSX)', value: 'xlsx' }
  ];

  // History table
  history: any[] = [];

  constructor(private router: Router, private ssrStorage: LocalstorageService, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  async ngOnInit(): Promise<void> {
    this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    //##########################################################
    // console.log("USER INFO ", this.userInfo);
    this.cols = [
      { field: 'username', header: 'User' },
      { field: 'fullname', header: 'Fullname' },
      { field: 'groupname', header: 'Permission' },
      { field: 'email', header: 'Email' },
      { field: 'status', header: 'Status' }
    ];
    this.breaditems = [{ label: 'Reports' }, { label: 'Audit Trails' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    //##########################################################
    await this._refreshACLMenu();
    await this.getHistoryReport();
    this.initializeFilter();
    if (this.aclMenublob.includes("rd")) {
      //******************** Untuk Refresh data *************/
    }
  }
  
  private initializeFilter(): void {
    // Set default fromDate to first day of current month at 00:00:00
    const today = new Date();
    this.filter.fromDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);

    // Set default toDate to last day of current month at 23:59:59
    this.filter.toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
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
      // console.log("Response dari API /v2/auth/aclattrb", data);
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

  async generateReport(): Promise<void> {
    const payload = {
      ...this.filter,
      fromDate: this.filter.fromDate?.toISOString(),
      toDate: this.filter.toDate?.toISOString()
    };
    this.loading = true;
    try {
      const res = await fetch('/v2/report/generate', {
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
      // console.log("Response dari API /v2/auth/aclattrb", data);
      this.loading = false;
      if (data.code === 20000) {
        await this.getHistoryReport();
      }
    } catch (err) {
      console.log("Response Error Catch /v2/report/generate", err);
      this.history = [];
      this.loading = false;
    }
  }

  async getHistoryReport(): Promise<void> {
    this.loading = true;
    try {
      const res = await fetch('/v2/report/getAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        }
      });
      // console.log("Response dari API /v2/auth/aclattrb", res);
      const data = await res.json();
      // console.log("Response dari API /v2/auth/aclattrb", data);
      this.loading = false;
      if (data.code === 20000) {
        const dataRecordshistory: any = cloneDeep(data.data);
        this.history = dataRecordshistory;
      } else {
        this.history = [];
      }
    } catch (err) {
      console.log("Response Error Catch /v2/report/getAll", err);
      this.loading = false;
    }
  }

  searchAuditTypes(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.auditTypes = this.auditTypes.filter(type =>
      type?.value?.toLowerCase().includes(query)
    );
  }

  searchSystemNames(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.systemNames = this.systemNames.filter(name =>
      name?.value?.toLowerCase().includes(query)
    );
  }

  searchActivities(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.activities = this.activities.filter(activity =>
      activity?.value?.toLowerCase().includes(query)
    );
  }

  searchFormats(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.formats = this.formats.filter(format =>
      format?.value?.toLowerCase().includes(query)
    );
  }
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
