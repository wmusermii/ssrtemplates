import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';

@Component({
  selector: 'app-flowcanvas',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, SelectModule],
  templateUrl: './flowcanvas.html',
  styleUrl: './flowcanvas.css'
})
export class Flowcanvas implements OnInit {

   currentUrl: string = '';
  aclMenublob: any[] = [];
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  loading: boolean = false;

  //===================== FLOW BUILDER =====================//
  palette = [
    { type: 'start', label: 'Start Node' },
    { type: 'action', label: 'Action Node' },
    { type: 'decision', label: 'Decision Node' },
  ];

  nodes: NodeItem[] = [];
  draggedNodeType: string | null = null;
  private movingNode: NodeItem | null = null;
  private offsetX = 0;
  private offsetY = 0;




  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  ngOnInit(): void {
   this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    this.breaditems = [{ label: 'Flowdiagram' }, { label: 'Foblex Sample' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  onDragStart(event: DragEvent, node: any) {
    this.draggedNodeType = node.type;
    event.dataTransfer?.setData('text/plain', node.type);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
  event.preventDefault();
  const canvas = document.querySelector('.canvas-area') as HTMLElement;
  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // pastikan nilai type selalu string
  const type = (event.dataTransfer?.getData('text/plain') || this.draggedNodeType || 'generic') as string;
  const label = this.palette.find((p) => p.type === type)?.label ?? 'Node';

  this.nodes.push({
    id: Date.now(),
    label,
    type,
    x,
    y,
  });

  this.draggedNodeType = null;
}


  startMove(event: MouseEvent, node: NodeItem) {
    this.movingNode = node;
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;
  }

  @HostListener('document:mouseup')
  stopMove() {
    this.movingNode = null;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.movingNode) {
      const canvas = document.querySelector('.canvas-area') as HTMLElement;
      const rect = canvas.getBoundingClientRect();
      this.movingNode.x = event.clientX - rect.left - this.offsetX;
      this.movingNode.y = event.clientY - rect.top - this.offsetY;
    }
  }

}
interface NodeItem {
  id: number;
  label: string;
  type: string; // tetap string
  x: number;
  y: number;
}
