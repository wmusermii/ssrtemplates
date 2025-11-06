import { Component, OnInit } from '@angular/core';
import { Tasklistmanager } from "../../../flowabledirective/tasklistmanager/tasklistmanager";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { MenuItem } from 'primeng/api';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';
import { FlowableConfig } from '../../../flowabledirective/taskservice/taskservice';
import cloneDeep from 'lodash-es/cloneDeep';
import { ShortIdPipe } from "./shortIdPipe";
import { CustomDatePipe } from "./customDatePipe";

@Component({
  selector: 'app-tasklist',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, TreeModule, DragDropModule, TabsModule, DividerModule, ToggleSwitchModule, PasswordModule, SelectModule, ShortIdPipe, CustomDatePipe],
  templateUrl: './tasklist.html',
  styleUrl: './tasklist.css'
})
export class Tasklist implements OnInit {
  aclMenublob: any[] = [];
  globalFilter: string = '';
  tasks!: TaskField[];
  alltasks!: TaskField[];
  baseUrl?: string;
  username?: string;
  password?: string = 'manage';
  loading: boolean = false;
  showFormDetail: any = { show: false, selectedGroup: { message: "ini harusnya isi Object" } }
  showDialogClaim: any = { show: false, selectedGroup: { message: "ini harusnya isi Object" } }
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  cols!: Column[];
  rows = 50;
  selectedTask: any = {};
  showDetailForm: any = { show: false, action: "add" };

  //###########################################################################
  formModel: any = {}; // form values user input
  variables: any[] = [];
  fields: any[] = [];
  outcomes: any[] = [];

  //######################################################

  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    console.log("*** TaskList Component ");
    this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    this.breaditems = [{ label: 'Flowable' }, { label: 'Task List' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    console.log("User Info : ", this.userInfo);
    await this._refreshACLMenu();
    console.log("MENU ACL ", this.aclMenublob);
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'assignee', header: 'Assignee' },
      { field: 'owner', header: 'Owner' },
      { field: 'createTime', header: 'Created' },
      { field: 'priority', header: 'Priority' }
    ];
    this.username = this.userInfo.username;
    this.baseUrl = `/flowable-task/process-api/runtime/tasks?candidateGroup=${this.userInfo.groupname}&includeProcessVariables=true`
    const payload = { urlFlowable: this.baseUrl }
    await this._refreshDataTaskList(payload);
  }

  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
    const term = this.globalFilter.trim().toLowerCase();
    if (term === '') {
      this.tasks = [...this.alltasks];
    } else {
      this.tasks = this.alltasks.filter(item =>
        [
          item.id,
          item.name,
          item.assignee,
          item.owner,
          item.createTime,
          item.priority
        ].some(field =>
          String(field ?? '').toLowerCase().includes(term)
        )
      );
    }
  }

  async onRowSelected(event: any) {
    // console.log("Row ", event.data);
    this.selectedTask = event.data;
    // console.log(this.selectedTask);
    this.showDialogClaim = { show: true, selectedGroup: { message: "ini harusnya isi Object" } }

    const payload = { urlFlowable: `/flowable-task/form-api/form-repository/form-definitions?key=${this.selectedTask.formKey}` }
    // await this._refreshDataTaskList(payload);
    this.selectedTask = { ...this.selectedTask, ...payload }



  }
  async _submitTaskAction(payload:any){
    this.loading = true;
    fetch('/v2/app/actionflowableTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'x-client': 'angular-ssr'
      }, body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API  /v2/app/actionflowableTask", res);
        if (!res.ok) throw new Error('get create Gagal');
        return res.json();
      })
      .then(async data => {
        console.log("Response dari API /v2/app/actionflowableTask", data);
        this.loading = false;
        if (data.code === 20000) {
          const payload = { urlFlowable: this.baseUrl }
          await this._refreshDataTaskList(payload);
          this.showFormDetail = { show: false, selectedGroup: { message: "ini harusnya isi Object" } }
        } else {
          alert("no data error")
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/app/formflowableTask", err);
      });
  }
  async _refreshDataTaskList(payload: any): Promise<void> {
    this.loading = true;
    fetch('/v2/app/getflowableTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'x-client': 'angular-ssr'
      }, body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API  /v2/app/getflowableTask", res);
        if (!res.ok) throw new Error('get create Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/app/getflowableTask", data);
        // this.loading=false;
        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data.data);
          this.tasks = dataRecordsTemp;
          this.alltasks = dataRecordsTemp;
          this.loading = false;
        } else {
          this.tasks = [];
          this.alltasks = [];
          this.loading = false;
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/app/getflowableTask", err);
      });
  }
  async _claimTask(payload:any):Promise<void> {
    this.loading = true;
    fetch('/v2/app/claimflowableTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'x-client': 'angular-ssr'
      }, body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API  /v2/app/claimflowableTask", res);
        if (!res.ok) throw new Error('get create Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/app/claimflowableTask", data);
        this.loading = false;
        if (data.code === 20000) {
        } else {
          // alert("no data error")
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/app/claimflowableTask", err);
      });
  }


  async _cratedFormTask(payload: any): Promise<void> {
    this.loading = true;
    fetch('/v2/app/formflowableTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'x-client': 'angular-ssr'
      }, body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API  /v2/app/formflowableTask", res);
        if (!res.ok) throw new Error('get create Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/app/formflowableTask", data);
        this.loading = false;
        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
          console.log("Data form ", dataRecordsTemp);
          console.log("Selected data ", this.selectedTask);

          if (this.selectedTask) {
            this.variables = this.selectedTask.variables || [];
          }

          if (dataRecordsTemp) {
            this.fields = dataRecordsTemp.fields || [];
            this.outcomes = dataRecordsTemp.outcomes || [];
            // initialize form model
            this.fields.forEach(field => {
              this.formModel[field.id] = field.value || '';
            });
          }


          this.showFormDetail = { show: true, selectedGroup: { message: "ini harusnya isi Object" } }



        } else {
          alert("no data error")
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/app/formflowableTask", err);
      });
  }

  async submitOutcome(outcome: string) {
    console.log("✅ Submit Outcome:", outcome);
    console.log("📝 Form Values:", this.formModel);
    // Variabel tambahan
  const extraVariable = {
    name: `initiator_${this.userInfo.groupname}`,
    type: "string",
    value: this.userInfo.username,
    scope: "global"
  };
  console.log("Selected Task ",this.selectedTask);
  const urlFlowable = "/flowable-task/process-api/runtime/tasks/"
  const taskId = this.selectedTask.id;
    const payload = {
      urlFlowable,
      taskId,
      data:{
        action: "complete",
        variables: [
          ...Object.keys(this.formModel).map(key => ({
            name: key,
            value: this.formModel[key]
          })),
          extraVariable,
          {
            name: "outcome",
            value: outcome
          }
        ]
      }

    };
    console.log("📦 Payload ke Flowable:", payload);
    // TODO send to Flowable API: /task/{id}
    await this._submitTaskAction(payload);
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

  async onCancelClaim() {
    this.showDialogClaim = { show: false, selectedGroup: { message: "ini harusnya isi Object" } }
  }
  async onOkClaim() {
    this.loading = true;
    this.showDialogClaim = { show: false, selectedGroup: { message: "ini harusnya isi Object" } }
    await this._cratedFormTask(this.selectedTask);
  //  await this._claimTask(this.selectedTask);
  }
  formatLabel(name: string): string {
  if (!name) return '';
  return name
    .replace(/[_\-]+/g, ' ')       // ubah underscore/dash jadi spasi
    .replace(/([a-z])([A-Z])/g, '$1 $2') // ubah camelCase jadi spasi
    .replace(/\b\w/g, c => c.toUpperCase()); // kapitalisasi tiap kata
}

  isFormFilled(): boolean {
    if (!this.fields || this.fields.length === 0) return true;
    return this.fields.every(f => {
      const value = this.formModel[f.id];
      return value !== null && value !== undefined && value.toString().trim() !== '';
    });
  }
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
interface TaskField {
  id?: string | null;
  url?: string | null;
  owner?: string | null;
  assignee?: string | null;
  delegationState?: string | null;
  name?: string | null;
  description?: string | null;
  createTime?: string | null;
  dueDate?: string | null;
  priority?: number | null;
  suspended?: boolean | null;
  claimTime?: string | null;
  taskDefinitionKey?: string | null;
  scopeDefinitionId?: string | null;
  scopeId?: string | null;
  scopeType?: string | null;
  tenantId?: string | null;
  category?: string | null;
  formKey?: string | null;
  parentTaskId?: string | null;
  parentTaskUrl?: string | null;
  executionId?: string | null;
  executionUrl?: string | null;
  processInstanceId?: string | null;
  processInstanceUrl?: string | null;
  processDefinitionId?: string | null;
  processDefinitionUrl?: string | null;
  variables?: any | null;
  total?: number | null;
  start?: number | null;
  sort?: string | null;
  order?: string | null;
  size?: number | null;
}
