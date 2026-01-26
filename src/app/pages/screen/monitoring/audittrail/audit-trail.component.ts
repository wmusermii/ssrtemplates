import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//######################### PRIMENG ##############################
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ChipModule } from 'primeng/chip';

import { Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { TableModule } from 'primeng/table';

@Component({
    standalone: true,
    selector: 'app-audit-trail',
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, DatePickerModule, ChipModule, TableModule],
    templateUrl: './audit-trail.html'
})
export class AuditTrail implements OnInit {
    loadingUser = true;
    showGenerateDialog: boolean = false;
    showProcessResiDialog: boolean = false;
    showProcedPostDialog: boolean = false;
    QueriesDataPos: QueryFields[] = [];
    selectProduct: QueryFields = {
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
    disableBtn: boolean = true;
    titleText: string = "undefined"
    currentDate: string | undefined;
    starttime: string = "00:00:01"
    endtime: string = "00:00:01"
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
    logs: any[] = [];
    constructor(private router: Router) { }
    ngOnInit() {
        
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