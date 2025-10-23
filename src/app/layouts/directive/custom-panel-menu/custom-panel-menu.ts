import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomMenuItem } from './custom-menu-item.model';

@Component({
  selector: 'app-custom-panel-menu',
  imports: [CommonModule],
  templateUrl: './custom-panel-menu.html',
  styleUrl: './custom-panel-menu.css'
})
export class CustomPanelMenu {
  @Input() data: CustomMenuItem[] = [];
  expandedState: Record<string, boolean> = {};

  constructor(private router: Router) {}

  onItemClick(item: CustomMenuItem) {
    // 🔹 1. Jalankan command jika ada
    if (item.command) {
      item.command();
      return;
    }

    // 🔹 2. Navigasi jika ada routerLink
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
      return;
    }

    // 🔹 3. Expand/Collapse jika punya child items
    if (item.items?.length) {
      this.toggleItem(item);
    }
  }

  toggleItem(item: CustomMenuItem) {
    const key = item.label ?? '';

    if (this.expandedState[key] === undefined) {
      this.expandedState[key] = item.expanded === true;
    }

    this.expandedState[key] = !this.expandedState[key];
  }

  isExpanded(item: CustomMenuItem): boolean {
    if (this.expandedState[item.label ?? ''] !== undefined) {
      return this.expandedState[item.label ?? ''];
    }
    return item.expanded === true;
  }
}
