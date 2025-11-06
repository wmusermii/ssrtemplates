import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
  standalone: true,
  selector: 'app-companylist',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, SelectModule],
  templateUrl: './companylist.html',
  styleUrl: './companylist.css'
})
export class Companylist implements OnInit {
  currentUrl: string = '';
  aclMenublob: any[] = [];
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  loading: boolean = false;
  cols!: Column[];
  datas!: any[];
  alldatas!: any[];
  selectedData: any = {};
  rows = 50;
  globalFilter: string = '';
  additionalDataText: string = '';
  // ✅ Untuk additionalData
  additionalDataList: { key: any; value: any }[] = [];
  formData: any = {
    data: {},
  };
  showDetailForm: any = { show: false, action: "add" };
  showDetailDelete: boolean = false;
  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
    const term = this.globalFilter.trim().toLowerCase();
    if (term === '') {
      this.datas = [...this.alldatas];
    } else {
      this.datas = this.alldatas.filter(item =>
        [item.companyCode, item.companyName]
          .some(field => field?.toLowerCase().includes(term))
      );
    }
  }
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    await this._refreshACLMenu();
    console.log("*** Menu ACL ", this.aclMenublob);
    if (this.aclMenublob.includes("rd")) {
      //  const dataRecords = await this._refreshListData();
    }
    this.breaditems = [{ label: 'Siap-UBP' }, { label: 'Company List' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    await this._getTableFields();
    await this._getRowTables();
    await this._getFieldModel();
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
  async _getTableFields(): Promise<void> {
    const payload: any = { routeUrl: this.currentUrl };
    this.loading = true;
    try {
      const res = await fetch('/v2/siapubp/get_tablefields', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        }
      });
      console.log("Response dari API /v2/siapubp/get_tablefields", res);
      const data = await res.json();
      console.log("Response dari API/v2/siapubp/get_tablefields", data);
      this.loading = false;
      if (data.code === 20000) {
        const dataRecordsFields: any = cloneDeep(data.data);
        const columns: Column[] = dataRecordsFields.map((f: any) => ({
          field: f,
          header: f,
          class: null,
          cellclass: null
        }));
        this.cols = columns;
        // this.aclMenublob = dataRecordsMenu.roles;
      } else {
        // this.aclMenublob = [];
      }
    } catch (err) {
      console.log("Response Error Catch /v2/siapubp/get_tablefields", err);
      this.aclMenublob = [];
      this.loading = false;
    }
  }
  async _getFieldModel(): Promise<void> {
    const payload: any = { routeUrl: this.currentUrl };
    this.loading = true;
    try {
      const res = await fetch('/v2/siapubp/get_fieldmodel', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        }
      });
      console.log("Response dari API /v2/siapubp/get_fieldmodel", res);
      const data = await res.json();
      console.log("Response dari API/v2/siapubp/get_fieldmodel", data);
      this.loading = false;
      if (data.code === 20000) {
        const dataRecordsFields: any = cloneDeep(data.data);
        // console.log("*** data dari model : ",dataRecordsFields);

        this.formData = { data: dataRecordsFields }
      } else {
        // this.aclMenublob = [];
        this.formData = {}
      }
    } catch (err) {
      console.log("Response Error Catch /v2/siapubp/get_fieldmodel", err);
      this.aclMenublob = [];
      this.loading = false;
    }
  }
  async _getRowTables(): Promise<void> {
    const payload: any = { routeUrl: this.currentUrl };
    this.loading = true;
    try {
      const res = await fetch('/v2/siapubp/get_companies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        }
      });
      console.log("Response dari API /v2/siapubp/get_companies", res);
      const data = await res.json();
      console.log("Response dari API/v2/siapubp/get_companies", data);
      this.loading = false;
      if (data.code === 20000) {
        const dataRecordsFields: any = cloneDeep(data.data);
        this.datas = dataRecordsFields;
        this.alldatas = dataRecordsFields;
      } else {
        this.datas = [];
        this.alldatas = [];
      }
    } catch (err) {
      console.log("Response Error Catch /v2/siapubp/get_companies", err);
      this.aclMenublob = [];
      this.loading = false;
    }
  }

  async _postDataTables(payload: any): Promise<void> {
    // const payload: any = { routeUrl: this.currentUrl };
    this.loading = true;
    try {
      const res = await fetch('/v2/siapubp/add_company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        },
        body: JSON.stringify(payload)
      });
      console.log("Response dari API /v2/siapubp/add_company", res);
      const data = await res.json();
      console.log("Response dari API/v2/siapubp/add_company", data);
      // this.loading = false;
      if (data.code === 20000) {
        this.showDetailForm = { show: false, action: "add" };
         await this._getRowTables();
      } else {
        this.showDetailForm = { show: false, action: "add" };
      }
    } catch (err) {
      console.log("Response Error Catch /v2/siapubp/add_company", err);
      // this.loading = false;
    }
  }

  async _updDataTables(payload: any): Promise<void> {
    // const payload: any = { routeUrl: this.currentUrl };
    this.loading = true;
    try {
      const res = await fetch('/v2/siapubp/upd_company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        },
        body: JSON.stringify(payload)
      });
      console.log("Response dari API /v2/siapubp/upd_company", res);
      const data = await res.json();
      console.log("Response dari API/v2/siapubp/upd_company", data);
      // this.loading = false;
      if (data.code === 20000) {
      } else {
      }
    } catch (err) {
      console.log("Response Error Catch /v2/siapubp/upd_company", err);
      // this.loading = false;
    }
  }

  async _delDataTables(payload: any): Promise<void> {
    // const payload: any = { routeUrl: this.currentUrl };
    this.loading = true;
    try {
      const res = await fetch('/v2/siapubp/del_company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        },
        body: JSON.stringify(payload)
      });
      console.log("Response dari API /v2/siapubp/del_company", res);
      const data = await res.json();
      console.log("Response dari API/v2/siapubp/del_company", data);
      // this.loading = false;
      if (data.code === 20000) {
        // const dataRecordsFields: any = cloneDeep(data.data);
        // this.datas = dataRecordsFields;
        // this.alldatas = dataRecordsFields;
      } else {
        // this.datas = [];
        // this.alldatas = [];
      }
    } catch (err) {
      console.log("Response Error Catch /v2/siapubp/del_company", err);
      // this.loading = false;
    }
  }

  async onOkDelete() {
    const payload = {
      companyCode: this.selectedData.companyCode,
      partnerReferenceNo: "34343243"
    }
    console.log('Payload dikirim:', payload);
    await this._delDataTables(payload);
    await this._getRowTables();
    this.showDetailDelete = false
  }
  async onCancelDelete() {
    this.showDetailDelete = false
  }


  _addData() {
    console.log("Add data");

    // Pastikan additionalData ada dan bertipe object
    if (this.formData?.data?.additionalData) {
      const data = this.formData.data.additionalData;

      // Kalau memang object → buat list dari key-value
      if (typeof data === 'object' && !Array.isArray(data)) {
        this.additionalDataList = Object.entries(data).map(([key, value]) => ({
          key,
          value
        }));

        // Juga buat representasi JSON string (jika butuh)
        this.additionalDataText = JSON.stringify(data, null, 2);
      } else {
        // Kalau bukan object (string kosong misalnya)
        this.additionalDataList = [];
        this.additionalDataText = this.formData.data.additionalData || '';
      }
    } else {
      // Default jika belum ada sama sekali
      this.additionalDataList = [];
      this.additionalDataText = '';
    }

    // Tampilkan form input data
    this.showDetailForm = { show: true, action: 'add' };
  }

  onRowSelect(event: any) {
    console.log('Selected Menu:', event.data);
    const dataObj = event.data
    this.selectedData = dataObj;
    this.showDetailForm = { show: true, action: "view" };
  }
  _delData(payload: any) {
    if (typeof payload.additionalData === 'object') {
      this.additionalDataText = JSON.stringify(payload.additionalData, null, 2);
    } else {
      this.additionalDataText = payload.additionalData || '';
    }
    console.log("del data ", payload);
    this.selectedData = payload
    this.showDetailDelete = true;
  }
  _updData(payload: any) {
  this.showDetailForm = {
    show: true,
    action: 'edit'
  };
  console.log("update data : ", payload);

  this.selectedData = payload;

  // deep clone biar aman, tidak mengubah selectedData reference
  this.formData.data = JSON.parse(JSON.stringify(payload));

  // handle additionalData (convert object → array untuk edit)
  const additional = payload?.additionalData || {};
  this.additionalDataList = Object.entries(additional).map(([key, value]) => ({ key, value: String(value) }));
  console.log("ISI ADDITIONAL DATA ",this.additionalDataList);
}

  /****************************************************** THIS FOR AUTO FORM */
  // Dapatkan semua key dari object
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Format label agar lebih manusiawi
  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  // Cek apakah nilai array
  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  // Cek apakah array primitif (string/number)
  isPrimitiveArray(arr: any[]): boolean {
    return arr.length > 0 && (typeof arr[0] === 'string' || typeof arr[0] === 'number');
  }

  // Cek apakah object (dan bukan array)
  isObject(val: any): boolean {
    return val && typeof val === 'object' && !Array.isArray(val);
  }

  async submitForm() {
    this.loading = true;

    // Konversi array key-value jadi object sebelum dikirim
    if (Array.isArray(this.additionalDataList) && this.additionalDataList.length > 0) {
      // Gabungkan semua pasangan key-value menjadi 1 object
      this.formData.data.additionalData = this.additionalDataList.reduce((acc, item) => {
        if (item.key?.trim()) {
          acc[item.key.trim()] = item.value?.trim() ?? '';
        }
        return acc;
      }, {} as Record<string, string>);
    } else {
      this.formData.data.additionalData = {};
    }

    const payload = {
      partnerReferenceNo: "34343243",
      ...this.formData
    };

    console.log('Payload dikirim:', payload);

    if (this.showDetailForm.action === 'edit') {
      // await this.apiService.updateCompany(payload);
      await this._updDataTables(payload);
    } else {
      // await this.apiService.createCompany(payload);
      await this._postDataTables(payload);
    }

    this.loading = false;
    // this.showDetailForm.show = false;
  }
  trackByIndex(index:number, _item:any):number{
    return index
  }

  toTitle(str: string) {
    return str
      .replace(/([A-Z])/g, ' $1')   // kasih spasi sebelum huruf besar
      .replace(/^./, c => c.toUpperCase()) // kapital huruf pertama
      .trim();
  }


  addBillKey() {
    this.formData.data.billKeys.push({
      key: '',
      mandatory: false,
      labelEn: '',
      labelIdn: ''
    });
  }

  removeBillKey(index: number) {
    this.formData.data.billKeys.splice(index, 1);
  }
  // ✅ Untuk sourceOfFunds
  addSourceOfFund() {
    if (!Array.isArray(this.formData.data.sourceOfFunds)) {
      this.formData.data.sourceOfFunds = [];
    }
    this.formData.data.sourceOfFunds.push('');
  }

  removeSourceOfFund(i: number) {
    this.formData.data.sourceOfFunds.splice(i, 1);
  }

  addAdditionalData() {
    this.additionalDataList.push({ key: '', value: '' });
  }

  removeAdditionalData(index: number) {
    this.additionalDataList.splice(index, 1);
  }

}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
