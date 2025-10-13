import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone:true,
  selector: 'app-tasklistmanager',
  imports: [CommonModule],
  templateUrl: './tasklistmanager.html',
  styleUrls: ['./tasklistmanager.css'] // bisa dikosongkan
})
export class Tasklistmanager implements OnInit {

   @Output() rowClick = new EventEmitter<any>();
  columns: TableColumn[] = [];
  initialData: any[] = [];
  data:any[] = []
  ngOnInit(): void {
      console.log("TASK MANAGER INIT");
      this.columns = [
          { field: 'id', header: 'ID' },
          { field: 'name', header: 'Name' },
          { field: 'assignee', header: 'Assignee' },
          { field: 'owner', header: 'Owner' },
          { field: 'created', header: 'Created' },
          { field: 'ended', header: 'Ended' }
        ];
       this.data = [
        { id: 'sdlfjans89w67e9r87e9rw', name: 'Review by Risk Control',assignee:"riskcontrol",owner:"",created:"Oct 13, 2025 5:12 PM",ended:"Oct 13, 2025 5:12 PM"  },
        { id: 'sdlfjans89w67e9r87e9rw', name: 'User Task Manager',assignee:"manager",owner:"",created:"Oct 13, 2025 5:12 PM",ended:"Oct 13, 2025 5:12 PM"   }
      ];
  }
  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
}
interface TableColumn {
  field: string;
  header: string;
}
