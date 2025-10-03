import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { Router, RouterModule } from '@angular/router';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import cloneDeep from 'lodash-es/cloneDeep';
@Component({
  standalone:true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule,RouterModule ,ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  ssrStorage = inject(LocalstorageService);
  submitted = false;
  titleText:string = "Undefined";
  errorMessage:any = {error:false, severity:"info", message:"ini test", icon:"pi pi-times"};
  loading = false;
  loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    this.loading = true;
    const objPayload = this.loginForm.value;
    const credential = btoa(`${objPayload.username}:${objPayload.password}`);
    fetch('/v2/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify({ credential })
    })
      .then(res => {
        // console.log("Response dari API ", res);
        // logInfo
        // if (!res.ok) throw new Error('Login gagal');
        // return res.json();
        return res.json();
      })
      .then(data => {
        // // console.log("Response dari API DATA ", JSON.parse(data));
        // // console.log("Response dari API DATA ", data);
        if(data.code === 20000) {
          this.loading=false;
          this.ssrStorage.setItem('C_INFO', data.data.userinfo);
          this.router.navigate(['/dashboard']);
        } else {
          this.loading=false;
          this.errorMessage = {error:true, severity:"error", message:`${data.message}`, icon:"pi pi-times"}
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = {error:true, severity:"error", message:`${err}`, icon:"pi pi-times"}
      });
  }

  // Helper getter untuk akses kontrol form di template
  get f() {
    return this.loginForm.controls;
  }
  constructor(private router: Router){}
  async ngOnInit(): Promise<void> {
    await this._refreshListData()
  }
  _changeError(){
    this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
  async _refreshListData():Promise<any>{
        this.loading=true;
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
                this.loading=false;

                if (data.code === 20000) {
                  const dataRecordsTemp = cloneDeep(data.data);
                  this.titleText = dataRecordsTemp.paramvalue;
                  this.loading=false;
                } else {

                  this.loading=false;
                }
              })
              .catch(err => {
                this.loading=false;
                console.log("Response Error Catch /v2/admin/get_parambykey", err);
              });
  }
}
