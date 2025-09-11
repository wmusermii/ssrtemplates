import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Sidebar } from '../../../directive/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';


@Component({
  standalone:true,
  selector: 'app-sidenavilayout',
  imports: [CommonModule,RouterOutlet,ButtonModule, Sidebar],
  templateUrl: './sidenavilayout.html',
  styleUrl: './sidenavilayout.css'
})
export class Sidenavilayout {
  user: {name: string;} | null = null;
  isSidebarOpen = true;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  onUserChange(userData: {name: string}) {
    this.user = userData;
  }
}
