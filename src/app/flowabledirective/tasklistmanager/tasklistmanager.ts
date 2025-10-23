import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { FlowableConfig, Taskservice } from '../taskservice/taskservice';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  standalone: true,
  selector: 'app-tasklistmanager',
  imports: [CommonModule],
  providers: [Taskservice],
  templateUrl: './tasklistmanager.html',
  styleUrls: ['./tasklistmanager.css'] // bisa dikosongkan
})
export class Tasklistmanager implements OnInit {
  @Input() username: string | undefined = "";
  @Input() password: string | undefined = "";
  @Input() baseUrl: string | undefined = "";
  @Output() rowClick = new EventEmitter<any>();
  columns: TableColumn[] = [];
  initialData: any[] = [];
  data: any[] = []
  defId?: string;
  // constructor() { }
   // ✅ INJEKSI HttpClient di constructor
  constructor(private http: HttpClient,private flowable: Taskservice) {}
  async ngOnInit(): Promise<void> {
    console.log("** Task Manager Init **");
    this.columns = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'assignee', header: 'Assignee' },
      { field: 'owner', header: 'Owner' },
      { field: 'created', header: 'Created' },
      { field: 'ended', header: 'Ended' }
    ];
    this.data = [
      { id: 'sdlfjans89w67e9r87e9rw', name: 'Review by Risk Control', assignee: "riskcontrol", owner: "", created: "Oct 13, 2025 5:12 PM", ended: "Oct 13, 2025 5:12 PM" },
      { id: 'sdlfjans89w67e9r87e9rw', name: 'User Task Manager', assignee: "manager", owner: "", created: "Oct 13, 2025 5:12 PM", ended: "Oct 13, 2025 5:12 PM" }
    ];

    // ✅ Set konfigurasi Flowable REST
    const config: FlowableConfig = {
      baseUrl: this.baseUrl,
      username: this.username,
      password: this.password
    };
    this.flowable.setConfig(config);

    // ✅ Refresh data pertama kali
    await this._refreshTaskList();
  }
  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
  async _refreshTaskList(): Promise<void> {
  console.log("REFRESHING ***** TASK LIST");
  // const username = 'admin';
  // const password = 'test';
  // const url = 'http://localhost:8080/flowable-task/process-api/runtime/tasks?candidateGroup=rcgroup&includeProcessVariables=true';
  // const authHeader = 'Basic ' + btoa(`${username}:${password}`);

  // const headers = new HttpHeaders({
  //   'Authorization': authHeader
  //   // jangan tambahkan Content-Type di GET, karena bikin browser kirim preflight OPTIONS
  // });

  // try {
  //   const res: any = await this.http.get(url, { headers, withCredentials: true }).toPromise();
  //   console.log("✅ Response JSON dari Flowable runtime/tasks:", res);

  //   this.data = Array.isArray(res.data)
  //     ? res.data.map((task: any) => ({
  //         id: task.id,
  //         name: task.name,
  //         assignee: task.assignee,
  //         owner: task.owner,
  //         created: task.createTime,
  //         ended: task.endTime,
  //       }))
  //     : [];

  //   console.log("✅ Tasks loaded:", this.data);
  // } catch (err) {
  //   console.error("❌ Response Error Catch runtime/tasks:", err);
  // }
}

}
interface TableColumn {
  field: string;
  header: string;
}
