import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import cloneDeep from 'lodash-es/cloneDeep';
import { ButtonModule } from 'primeng/button';
import { Sidebar } from '../../../directive/sidebar/sidebar';

@Component({
    standalone: true,
    selector: 'app-sidenavilayout',
    imports: [CommonModule, RouterOutlet, ButtonModule, Sidebar],
    templateUrl: './sidenavilayout.html',
    styleUrl: './sidenavilayout.css',
})
export class Sidenavilayout implements OnInit {
    titleText: string = 'Undefined';
    async ngOnInit(): Promise<void> {
        console.log('Routes loaded: sidenavi');
        await this._refreshTitle();
    }
    user: { name: string } | null = null;
    isSidebarOpen = true;
    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
    onUserChange(userData: { name: string }) {
        this.user = userData;
    }
    async _refreshTitle(): Promise<any> {
        // this.loading=true;
        const payload = { paramgroup: 'GENERAL', paramkey: 'title' };
        fetch('/v2/admin/get_parambykey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client': 'angular-ssr',
            },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                // // console.log("Response dari API  /v2/admin/get_parambykey", res);
                if (!res.ok) throw new Error('get Title Gagal');
                return res.json();
            })
            .then((data) => {
                //// console.log("Response dari API /v2/admin/get_parambykey", data);
                // this.loading=false;

                if (data.code === 20000) {
                    const dataRecordsTemp = cloneDeep(data.data);
                    this.titleText = dataRecordsTemp.paramvalue;
                } else {
                    this.titleText = 'Undefined';
                }
            })
            .catch((err) => {
                console.log('Response Error Catch /v2/admin/get_parambykey', err);
            });
    }
}
