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
import { cloneDeep } from 'lodash-es';
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
  titleText:string ="undefined"
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
    this._refreshTitle();
  }

  // async _popupShopee(){
  //   this.showGenerateDialog= true;
  //   let startArray:any = await this.ssrStorage.getItem("FETCHTIME");
  //   if(startArray){
  //     //################### SETTING JAM BERIKUT ########################
  //     let startT:string[] = startArray.split(",");
  //     this.starttime = startT[0];
  //      let dateTmp= new Date();
  //      this.endtime = dateTmp.toLocaleTimeString('en-GB');
  //   }
  // }
//   async _processFetchingShopee(){
//     this.loading= true;
//     this.showGenerateDialog=false;
// //################## AMBIL DATA DULU DARI LOCAL SESSION #######################
//     let startArray:any = await this.ssrStorage.getItem("FETCHTIME");
//     if(startArray){
//       //################### SETTING JAM BERIKUT ########################
//       let startT:string[] = startArray.split(",");
//       this.starttime = startT[0];
//        let dateTmp= new Date();
//           // Jam:Menit:Detik
//        this.endtime = dateTmp.toLocaleTimeString('en-GB');
//     }
// //#############################################################################
//     let payload = {date:this.currentDate, fromtime:this.starttime, totime:this.endtime}
//     fetch('/v2/shopee/gen_qshopeeCurrent', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${this.token}`
//       },
//       body: JSON.stringify(payload)
//     })
//       .then(res => {
//         // console.log("Response dari API /shopee/gen_qshopeeCurrent 0", res);
//         if (!res.ok) throw new Error('q_shopee Gagal');
//         return res.json();
//       })
//       .then(data => {
//         // console.log("Response dari API /shopee/gen_qshopeeCurrent 1", data);
//         if (data.code === 20000) {
//           console.log("FETCH SETELAH GENERATE ");
//           this.loading = false;
//         } else {
//           this.loading = false
//           // this.listMenu = [];
//         }
//       })
//       .catch(err => {
//         console.log("Response Error Catch /shopee/gen_qshopeeCurrent", err);
//       });
//   }
  async _cancelFetchingShopee(){
    this.showGenerateDialog=false;
  }

  // async _onRowSelect(payload:any){
  //   console.log("Selected 1 : ",payload);
  //   console.log("Selected 2 : ",this.selectProduct);

  // }
  async _refreshTitle():Promise<any>{
          // this.loading=true;
          const payload = {paramgroup: "GENERAL", paramkey:"title"}
              fetch('/v2/admin/get_parambykey', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-client': 'angular-ssr'
                },
                  body:JSON.stringify(payload)
              })
                .then(res => {
                  // // console.log("Response dari API  /v2/admin/get_parambykey", res);
                  if (!res.ok) throw new Error('get Title Gagal');
                  return res.json();
                })
                .then(data => {
                  //// console.log("Response dari API /v2/admin/get_parambykey", data);
                  // this.loading=false;

                  if (data.code === 20000) {
                    const dataRecordsTemp = cloneDeep(data.data);
                    this.titleText = dataRecordsTemp.paramvalue;

                  } else {

                    this.titleText = "Undefined"
                  }
                })
                .catch(err => {;
                  console.log("Response Error Catch /v2/admin/get_parambykey", err);
                });
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
