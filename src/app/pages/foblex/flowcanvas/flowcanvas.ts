import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';

@Component({
  selector: 'app-flowcanvas',
  imports: [
    CommonModule,
    BreadcrumbModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './flowcanvas.html',
  styleUrls: ['./flowcanvas.css']
})
export class Flowcanvas implements OnInit {
  breaditems: MenuItem[] = [];
  home: MenuItem | undefined;

  palette: { type: NodeType; label: string }[] = [
    { type: 'startEvent', label: 'Start Event' },
    { type: 'businessTask', label: 'Business Task' },
    { type: 'decision', label: 'Decision' },
    { type: 'endEvent', label: 'End Event' },
    { type: 'restClient', label: 'Rest Client' }
  ];


  nodes: CanvasNode[] = [];
  draggingNode: CanvasNode | null = null;
  offsetX = 0;
  offsetY = 0;
  selectedNode: CanvasNode | null = null;
  selectedNodeProperties: { key: string; value: any }[] = [];
  isConnecting = false;           // Apakah sedang membuat koneksi
  tempConnection = { x1: 0, y1: 0, x2: 0, y2: 0 }; // garis sementara saat drag
  connectionStartNode: CanvasNode | null = null;
  // connections: { from: number; to: number }[] = [];
  connections: { from: number; to: number; fromX?: number; fromY?: number; toX?: number; toY?: number }[] = [];

  constructor(private router: Router, private ssrStorage: LocalstorageService,
    @Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    this.breaditems = [{ label: 'Flowdiagram' }, { label: 'Foblex Sample' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  onDragStart(event: DragEvent, type: NodeType) {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData('nodeType', type);
    event.dataTransfer.effectAllowed = 'copy';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const type = event.dataTransfer?.getData('nodeType') as NodeType;
    if (!type || !['startEvent', 'businessTask', 'decision', 'endEvent', 'restClient'].includes(type)) {
      console.warn('Invalid type dropped:', type);
      return;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Snap ke grid 20px
    x = Math.round(x / 20) * 20;
    y = Math.round(y / 20) * 20;

    this.nodes.push({
      id: Date.now(),
      type,
      label: type === 'businessTask' ? 'Business Task' : type === 'restClient' ? 'Rest Client' : '',
      x,
      y
    });
    this.drawConnections();
  }

  startNodeDrag(event: MouseEvent, node: CanvasNode) {
    this.draggingNode = node;
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.draggingNode) return;
    const canvas = (event.currentTarget as HTMLElement).getBoundingClientRect();
    let x = event.clientX - canvas.left - this.offsetX;
    let y = event.clientY - canvas.top - this.offsetY;

    // Snap ke grid
    x = Math.round(x / 20) * 20;
    y = Math.round(y / 20) * 20;

    this.draggingNode.x = x;
    this.draggingNode.y = y;

    // update koneksi setiap kali node digerakkan
    this.drawConnections();
  }

  endNodeDrag() {
    this.draggingNode = null;
  }

  selectNode(node: CanvasNode) {
    this.selectedNode = node; // menyimpan reference node yang diklik
    // Jika sudah ada node awal untuk koneksi, buat koneksi
    if (this.connectionStartNode && this.connectionStartNode.id !== node.id) {
      this.connections.push({ from: this.connectionStartNode.id, to: node.id });
      this.connectionStartNode = null; // reset
    }
  }
  getNodeWidth(node: CanvasNode) {
    switch (node.type) {
      case 'startEvent':
      case 'endEvent': return 48; // w-12
      case 'businessTask': return 128; // w-32
      case 'restClient': return 128; // sama seperti businessTask
      case 'decision': return 64; // w-16
      default: return 64;
    }
  }

  getNodeHeight(node: CanvasNode) {
    switch (node.type) {
      case 'startEvent':
      case 'endEvent': return 48; // h-12
      case 'businessTask': return 48; // h-12
      case 'restClient': return 48; // sama
      case 'decision': return 64; // h-16
      default: return 64;
    }
  }

  // Mulai drag untuk koneksi (misal pakai tombol Shift+click)
  startConnection(node: CanvasNode) {
    this.connectionStartNode = node;
  }
  // Helper untuk ambil node berdasarkan id
  getNodeById(id: number): CanvasNode {
    return this.nodes.find(n => n.id === id)!;
  }

  // menggambar ulang koneksi agar berada di tengah node
  drawConnections() {
    this.connections = this.connections.map(c => {
      const fromNode = this.getNodeById(c.from);
      const toNode = this.getNodeById(c.to);
      if (!fromNode || !toNode) return c;
      return {
        ...c,
        // posisi garis di-update agar berasal dari tengah node
        fromX: fromNode.x + this.getNodeWidth(fromNode) / 2,
        fromY: fromNode.y + this.getNodeHeight(fromNode) / 2,
        toX: toNode.x + this.getNodeWidth(toNode) / 2,
        toY: toNode.y + this.getNodeHeight(toNode) / 2
      };
    });
  }

  getNodeClass(node: CanvasNode): string {
    switch (node.type) {
      case 'startEvent':
        return 'bg-blue-300 border-2 border-blue-700 rounded-full w-12 h-12';
      case 'businessTask':
        return 'bg-yellow-300 rounded w-32 h-12 px-2 py-1 text-center';
      case 'decision':
        return 'bg-red-300 rotate-45 w-12 h-12 flex items-center justify-center';
      case 'endEvent':
        return 'bg-red-500 border-2 border-red-700 rounded-full w-12 h-12';
      case 'restClient':   // <-- baru
        return 'bg-green-200 rounded w-28 h-12 px-2 py-1 text-center text-green-800 font-semibold';
      default:
        return '';
    }
  }

  getPaletteNodeClass(type: NodeType): string {
    switch (type) {
      case 'startEvent':
        return 'bg-blue-300 border-2 border-blue-700 rounded-full w-10 h-10';
      case 'businessTask':
        return 'bg-yellow-300 rounded w-20 h-8 px-1 py-1 text-center';
      case 'decision':
        return 'bg-red-300 rotate-45 w-10 h-10 flex items-center justify-center';
      case 'endEvent':
        return 'bg-red-500 border-2 border-red-700 rounded-full w-10 h-10';
      case 'restClient':
        return 'bg-green-200 rounded w-32 h-12 px-2 py-1 text-center flex items-center justify-center';
      default:
        return '';
    }
  }
  // dipanggil dari template: wrapper agar bisa bedakan shift vs normal click
  startNodeOnMouseDown(event: MouseEvent, node: CanvasNode) {
    // jika user menahan shift -> mulai mode koneksi
    if (event.shiftKey) {
      event.stopPropagation();
      this.startNodeConnection(event, node);
      return;
    }
    // jika bukan shift -> mulai drag node
    this.startNodeDrag(event, node);
  }

  // start connection (shift + mousedown)
  startNodeConnection(event: MouseEvent, node: CanvasNode) {
    this.isConnecting = true;
    this.connectionStartNode = node;
    // initialize tempConnection dari center node
    this.tempConnection.x1 = node.x + this.getNodeWidth(node) / 2;
    this.tempConnection.y1 = node.y + this.getNodeHeight(node) / 2;
    this.tempConnection.x2 = this.tempConnection.x1;
    this.tempConnection.y2 = this.tempConnection.y1;
  }

  // dipanggil saat mouse bergerak di canvas
  onCanvasMouseMove(event: MouseEvent) {
    // update garis sementara apabila sedang konek
    if (this.isConnecting && this.connectionStartNode) {
      const canvas = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.tempConnection.x2 = event.clientX - canvas.left;
      this.tempConnection.y2 = event.clientY - canvas.top;
    }

    // panggil juga handler drag node kalau ada implementasi sebelumnya
    this.onMouseMove(event); // pastikan ada atau ubah sesuai nama method di code-mu
  }

  // release mouse di canvas (bukan on node)
  onCanvasMouseUp(event: MouseEvent) {
    // cancel temporary connection jika tidak dilepas di node target
    this.isConnecting = false;
    this.connectionStartNode = null;
  }

  // release mouse di node (dipakai untuk menyelesaikan koneksi)
  onNodeMouseUp(event: MouseEvent, node: CanvasNode) {
    // jika sedang membuat koneksi dan melepaskan di node target yang berbeda
    if (this.isConnecting && this.connectionStartNode && this.connectionStartNode.id !== node.id) {
      this.connections.push({ from: this.connectionStartNode.id, to: node.id });
    }
    this.isConnecting = false;
    this.connectionStartNode = null;

    // juga hentikan drag jika aktif
    this.endNodeDrag();
  }
  deleteNode() {
    if (!this.selectedNode) return;
    // hapus dari nodes array
    this.nodes = this.nodes.filter(node => node.id !== this.selectedNode!.id);
    // reset selectedNode
    this.selectedNode = null;
  }



  validateFlow() {
    console.log('Validate flow:', this.nodes);
    // TODO: logika validasi flow diagram
  }

  saveFlow() {
    console.log('Save flow:', this.nodes);
    // TODO: simpan ke backend / localstorage
  }

  exportFlow() {
    console.log('Export flow:', this.nodes);
    // TODO: export JSON / PNG / PDF
  }


  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete' && this.selectedNode) {
      this.deleteNode();
    }
  }

}

type NodeType = 'startEvent' | 'businessTask' | 'decision' | 'endEvent' | 'restClient';
interface CanvasNode {
  id: number;
  type: NodeType;
  label?: string;
  x: number;
  y: number;
  groupRef?: string; // untuk businessTask
  userRef?: string;  // untuk businessTask
  fetchUrl?: string;  // untuk restClient
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: string;
  body?: string;
}
