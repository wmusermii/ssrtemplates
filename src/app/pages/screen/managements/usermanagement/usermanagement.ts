import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DividerModule } from 'primeng/divider';
import cloneDeep from 'lodash-es/cloneDeep';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
@Component({
  standalone:true,
  selector: 'app-usermanagement',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, ChipModule,TagModule, ToggleSwitchModule, DividerModule,PasswordModule, SelectModule],
  templateUrl: './usermanagement.html',
  styleUrl: './usermanagement.css'
})
export class Usermanagement implements OnInit {
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  loading: boolean = false;
  cols!: Column[];
  rows = 50;
  idUserOld: string = "";
  users!: UserField[];
  totalUsers: number = 0;
  allUser!: UserField[];
  globalFilter: string = '';
  groups:any[] = [];
  selectedUser: UserField = {};
  showDetailForm: any = { show: false, action: "add" };
  showDetailDelete: boolean = false;
  showErrorPage: any = { show: false, message: "undefined" };
  errorMessage: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" };
  aclMenublob: any[] = [];
  userForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    fullname: new FormControl('', [Validators.required]),
    idgroup: new FormControl(''),
    idgroupObj: new FormControl({}, [Validators.required]),
    email: new FormControl(''),
    status: new FormControl(true),
  });
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }

  async ngOnInit(): Promise<void> {
    this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    //##########################################################
    // console.log("USER INFO ", this.userInfo);
    this.cols = [
      { field: 'username', header: 'User' },
      { field: 'fullname', header: 'Fullname' },
      { field: 'groupname', header: 'Group' },
      { field: 'email', header: 'Email' },
      { field: 'status', header: 'Status' }
    ];
    this.breaditems = [{ label: 'Management' }, { label: 'Users' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    //##########################################################
    await this._refreshACLMenu();
    if (this.aclMenublob.includes("rd")) {
      await this._refreshGroupData();
      await this._refreshListData();
    }

  }
  get f() {
    return this.userForm.controls;
  }
  _changeError() {
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
  onRowSelect(event: any) {
    console.log('Selected User:', event.data);
    const dataObj = event.data
    this.idUserOld = dataObj.iduser
    const groupObj:any = this.groups.find(g => g.idgroup === dataObj.idgroup) || {};
    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      passwordControl.clearValidators(); // hapus semua validator
      passwordControl.updateValueAndValidity(); // refresh validasi
    }

      this.userForm.patchValue({
      "username": dataObj.username,
      "password": null,
      "fullname": dataObj.fullname,
      "email": dataObj.email,
      "idgroup": dataObj.idgroup,
      "idgroupObj":groupObj,
      "status": dataObj.status === 1?true:false
    }
    )
    this.showDetailForm = { show: true, action: "edit" };
  }
  async _refreshListData(): Promise<void> {
      this.loading = true;
      fetch('/v2/admin/get_users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${this.token}`,
          'x-client': 'angular-ssr'
        }
      })
        .then(res => {
          // console.log("Response dari API  /v2/admin/get_users", res);
          if (!res.ok) throw new Error('get get_users Gagal');
          // if (!res.ok){
          //   this.showErrorPage = {show:true, message:res}
          // }
          return res.json();
        })
        .then(data => {
          // console.log("Response dari API /v2/admin/get_users", data);
          this.loading = false;
          this.users = []; this.allUser = [];
          if (data.code === 20000) {
            const dataRecordsTemp = cloneDeep(data.data);
            this.users = dataRecordsTemp;
            this.allUser = this.users;
            this.totalUsers = this.allUser.length;
            this.loading = false;
          } else {
            this.users = [];
            this.totalUsers = this.users.length;
            this.loading = false;
            // this.showErrorPage = { show: true, message: data.message }
          }
        })
        .catch(err => {
          console.log("Response Error Catch /v2/admin/get_users", err);
        });
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
  async _refreshGroupData(): Promise<void> {
      this.loading = true;
      this.loading = true;
          fetch('/v2/admin/get_groups', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${this.token}`,
              'x-client': 'angular-ssr'
            }
          })
            .then(res => {
              // console.log("Response dari API  /v2/admin/get_groups", res);
              return res.json();
            })
            .then(data => {
              // console.log("Response dari API /v2/admin/get_groups", data);
              this.loading = false;
              // this.groups = []; this.allGroups = [];
              if (data.code === 20000) {
                const dataRecordsTemp = cloneDeep(data.data);
                this.groups = dataRecordsTemp;
              } else {
                this.groups = [];
              }
            })
            .catch(err => {
              console.log("Response Error Catch /v2/admin/get_groups", err);
            });
    }

  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
    const term = this.globalFilter.trim().toLowerCase();
    if (term === '') {
      this.users = [...this.allUser];
    } else {
      this.users = this.allUser.filter(item =>
        [item.username, item.fullname, item.groupname]
          .some(field => field?.toLowerCase().includes(term))
      );
    }
  }


  async _addUser() {
    this.userForm.patchValue({
      "username": null,
      "password": null,
      "fullname": null,
      "email": null,
      "status": true
    }
    )
    this.setCreateMode();

    this.showDetailForm = { show: true, action: "add" };
  }
  async _delUser(event: any) {
    this.selectedUser = event;
    this.showDetailDelete = true;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    this.loading = true;
    let objPayload = this.userForm.value;
    console.log("Payload form ", objPayload);
    const selectedGroup:any = objPayload.idgroupObj;
    objPayload.idgroup = selectedGroup?.idgroup;
    delete objPayload.idgroupObj;
    if (this.showDetailForm.action == "add") {
      //########### CHECK PANJANG USER ##############
      let usernameLength = objPayload?.username
      if((usernameLength ?? "").length < 6) {
        this.loading = false;
        this.errorMessage ={ error: true, severity: "error", message: "Username cannot less than 6 characters", icon: "pi pi-exclamation-circle" };
        return;
      }
      // ########## CHECK PASSWORD ATTRIBUTE ########
      const policy = {
        minLength: 8,
        requireUppercase: true,
        requireNumber: true,
        requireSpecialChar: true,
        allowedSpecialChars: "!@#$%^&*()_+[]{}|;:,.?~-"
      };
      const resultValidasiPassword = this._validatePassword(objPayload?.password!, policy);

      if (!resultValidasiPassword.valid) {
        this.loading = false;
        this.errorMessage ={ error: true, severity: "error", message: resultValidasiPassword.errors, icon: "pi pi-exclamation-circle" };
      } else {
        this._saveAddData(objPayload);
      }


    } else {
      console.log("IdUserOLD : ", this.idUserOld);
      this._saveEditData(objPayload, this.idUserOld)
    }
  }
  onCancel() {
    this.setCreateMode();
    this.showDetailForm = { show: false, action: "add" };
  }
  setCreateMode() {
    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      passwordControl.setValidators([Validators.required]);
      passwordControl.updateValueAndValidity();
    }
  }
  async onOkDelete() {
    this.loading = true;
    console.log("data to delete ", this.selectedUser);
    await this._saveDeleteData(this.selectedUser);
    this.showDetailDelete = false;
  }
  onCancelDelete() {
    this.showDetailDelete = false;
  }
  _saveAddData(payload: any) {
    fetch('/v2/admin/add_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(async data => {
        // // console.log("Response dari API DATA ", JSON.parse(data));
        // // console.log("Response dari API DATA ", data);
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          await this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }
  _saveEditData(payload: any, idUser: string) {
    payload = { ...payload, ...{ iduser: idUser } };
    delete payload.password;
    console.log("Payload Edit ", payload);
    fetch('/v2/admin/upd_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error update data');
        return res.json();
      })
      .then(data => {
        // // console.log("Response dari API DATA ", JSON.parse(data));
        // // console.log("Response dari API DATA ", data);
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }
  async _saveDeleteData(payload: any) {
    fetch('/v2/admin/del_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        // console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(async data => {
        // // console.log("Response dari API DATA ", JSON.parse(data));
        // // console.log("Response dari API DATA ", data);
        // this.loading=false;
        if (data.code === 20000) {
          await this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }


  _validatePassword(password: string, policy: PasswordPolicy): PasswordValidationResult {
  const errors: string[] = [];

  if (policy.minLength && password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least 1 uppercase letter');
  }

  if (policy.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least 1 number');
  }

  if (policy.requireSpecialChar) {
    // default aman (tidak termasuk < > " ' ` \ /)
    const safeSpecials =
      policy.allowedSpecialChars || "!@#$%^&*()_+[]{}|;:,.?~-";

    const regex = new RegExp(
      `[${safeSpecials.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`
    );

    if (!regex.test(password)) {
      errors.push('Password must contain at least 1 special character');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

}
interface UserField {
  iduser?: string | null;
  username?: string | null;
  password?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  idgroup?: string | null;
  groupname?: string | null;
  fullname?: string | null;
  mobile?: string | null;
  email?: string | null;
  deleteable?: number | null;
  status?: number | null;
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}

interface PasswordPolicy {
  minLength?: number;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
  allowedSpecialChars?: string; // whitelist karakter khusus
}

interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}
