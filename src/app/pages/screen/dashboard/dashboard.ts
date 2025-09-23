import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatetimeComponent } from "../../../layouts/directive/datetime/datetime.component";
//######################### PRIMENG ##############################
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ChipModule } from 'primeng/chip';

import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, DatePickerModule, ChipModule, TableModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  loadingUser = true;
  showGenerateDialog: boolean = false;
  showProcessResiDialog: boolean = false;
  showProcedPostDialog: boolean = false;
  QueriesDataPos: QueryFields[] = [];
  selectProduct:QueryFields={
    id: 0,
    fromtime: '',
    totime: '',
    created_by: '',
    created_at: '',
    datepick: '',
    remarks: ''
  };
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  date: Date | undefined = new Date(); // contoh
  disableBtn:boolean = true;
  currentDate: string | undefined;
  starttime:string ="00:00:01"
  endtime:string ="00:00:01"
  value: string | undefined;
  loading: boolean = false;
  totalSku: string = "0";
  totalStoreItem: string = "0";
  totalWarehouseItem: string = "0";
  totalResi: number = 0
  itemList: any[] = [];
  dataResi: any[] = [];
  groupName: string | undefined = undefined
  skutotal: string = "Sku : 176 items";
  storeitemtotal: string = "In Store : 1500 pcs.";
  whitemtotal: string = "In Warehouse : 500 pcs.";
  invoicetotal: number = 5;
  invoicetotalStr: string = "Invoices : 0 pcs.";
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  ngOnInit(): void {
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    const sessionDate:any = this.ssrStorage.getItem("FETCHTIME")
    // console.log("USER INFO ", this.userInfo);

    // this._refreshCountInvoices();
  }

  async _popupShopee(){
    this.showGenerateDialog= true;
    let startArray:any = await this.ssrStorage.getItem("FETCHTIME");
    if(startArray){
      //################### SETTING JAM BERIKUT ########################
      let startT:string[] = startArray.split(",");
      this.starttime = startT[0];
       let dateTmp= new Date();
       this.endtime = dateTmp.toLocaleTimeString('en-GB');
    }
  }
  async _processFetchingShopee(){
    this.loading= true;
    this.showGenerateDialog=false;
//################## AMBIL DATA DULU DARI LOCAL SESSION #######################
    let startArray:any = await this.ssrStorage.getItem("FETCHTIME");
    if(startArray){
      //################### SETTING JAM BERIKUT ########################
      let startT:string[] = startArray.split(",");
      this.starttime = startT[0];
       let dateTmp= new Date();
          // Jam:Menit:Detik
       this.endtime = dateTmp.toLocaleTimeString('en-GB');
    }
//#############################################################################
    let payload = {date:this.currentDate, fromtime:this.starttime, totime:this.endtime}
    fetch('/v2/shopee/gen_qshopeeCurrent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API /shopee/gen_qshopeeCurrent 0", res);
        if (!res.ok) throw new Error('q_shopee Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /shopee/gen_qshopeeCurrent 1", data);
        if (data.code === 20000) {
          console.log("FETCH SETELAH GENERATE ");
          this.loading = false;
        } else {
          this.loading = false
          // this.listMenu = [];
        }
      })
      .catch(err => {
        console.log("Response Error Catch /shopee/gen_qshopeeCurrent", err);
      });
  }
  async _cancelFetchingShopee(){
    this.showGenerateDialog=false;
  }
  _goToPackaging() {
    this.router.navigate(['/printing']);
  }
  async _getViewPosProcess(payload:any) {
    this.loading=true;
    fetch('/v2/shopee/get_positem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API  /shopee/get_positem", res);
        if (!res.ok) throw new Error('get QShopee Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /shopee/get_positem ", data);
        this.loading=false;
        if (data.code === 20000) {
          this.showProcedPostDialog = true;
          const dataRecordsTemp = cloneDeep(data.data);
          console.log("Data View ", dataRecordsTemp.data);
          this.QueriesDataPos = dataRecordsTemp.data;
          this.loading=false;
        } else {
          this.QueriesDataPos = [];
          this.loading=false;
        }
      })
      .catch(err => {
        console.log("Response Error Catch /shopee/get_qshopee", err);
      });
  }
  async _onRowSelect(payload:any){
    console.log("Selected 1 : ",payload);
    console.log("Selected 2 : ",this.selectProduct);
    this.ssrStorage.setItem("FORCEITEMID", this.selectProduct);
    this._goToPackaging();
  }
}

interface QueryFields {
  id: number;
  fromtime: string;
  totime: string;
  created_by: string;
  created_at: string;
  datepick: string;
  remarks: string;
}
interface Column {
  field: string;
  header: string;
  class: string;
  cellclass: string;
}
