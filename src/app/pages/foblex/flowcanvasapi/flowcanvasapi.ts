import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FFlowModule, FExternalItemDirective, FCanvasComponent } from '@foblex/flow';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';
import { cloneDeep } from 'lodash-es';
import { BrowserService } from '@foblex/platform';
import { PointExtensions } from '@foblex/2d';
@Component({
  selector: 'app-flowcanvasapi',
  imports: [CommonModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, DialogModule, SelectModule,
    FFlowModule],
  templateUrl: './flowcanvasapi.html',
  styleUrl: './flowcanvasapi.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Flowcanvasapi implements OnInit, AfterViewInit, OnDestroy {
  loading: boolean = false;
  canvas!: FCanvasComponent;
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  datas!: any[];
  logs: string[] = [];
  isReady = false;
  flowReady = false;
  private hasViewInited = false;
  editDialogVisible = false;
  editNodeTarget: NodeData | null = null;
  editNodeText = '';
  editNodeDescription: string = '';
  selectedNodeObject: any = {};
  // --- Mode koneksi aktif/tidak ---
  isConnectionMode = false;
  // --- Node awal yang diklik saat akan membuat koneksi ---
  connectionStartNode: any = null;
  // --- Daftar koneksi antar node di canvas ---
  // connections: { id: number; from: string; to: string }[] = [];
  connections: { outputId: string; inputId: string }[] = [];
  constructor(private router: Router, private ssrStorage: LocalstorageService, private cdr: ChangeDetectorRef) {
    // Tambahan: pastikan signal nodes langsung array
    if (!Array.isArray(this.nodes())) {
      this.nodes.set([]);
    }
  }
  // =============== SIGNALS ===============
  protected nodes = signal<NodeData[]>([]);
  protected isMatchSize = signal(false);
  protected fCanvas = viewChild(FCanvasComponent);

  async ngOnInit(): Promise<void> {
    this.breaditems = [{ label: 'Siap-BIFAST' }, { label: 'Flow Bussines List', routerLink: '/bifast/bisnislist' }, { label: 'Graph' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    await this._refreshListData();
  }
  ngAfterViewInit(): void {
    console.warn('Canvas siap digunakan.');
    this.flowReady = true;
    this.fCanvas()?.resetScaleAndCenter(false);
    // Paksa Angular untuk re-render log
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {

  }

  //######################################### Get data from API ######################
  async _refreshListData(): Promise<void> {
    this.loading = true;
    fetch('/v2/siapbifast/get_bisnislist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      }
    })
      .then(res => {
        console.log("Response dari API  /v2/siapbifast/get_bisnislist", res);
        if (!res.ok) throw new Error('get get_users Gagal');
        // if (!res.ok){
        //   this.showErrorPage = {show:true, message:res}
        // }
        return res.json();
      })
      .then(async data => {
        console.log("Response dari API /v2/siapbifast/get_bisnislist", data);
        this.loading = false;
        // this.users = []; this.allUser = [];
        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
          this.datas = dataRecordsTemp;
          const dataNodes = await this.convertServicesToNodes(this.datas)
          // this.alldatas = this.datas;
          // this.totalDatas = this.alldatas.length;
          const connectionTmp = await this.generateConnections(dataNodes.nodes);

          console.log("connections : ", connectionTmp);
          this.nodes.set(dataNodes.nodes);
          this.connections = connectionTmp;
          setTimeout(() => {
            this.isReady = true;
            this.loading = false;
            this.cdr.detectChanges();
          }, 50);
          this.isReady = true;
          this.loading = false;
        } else {
          this.datas = [];
          this.nodes.set(this.datas);
          // this.alldatas = [];
          // this.loading = false;
          // this.totalDatas = 0;
          // //   // this.showErrorPage = { show: true, message: data.message }
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/siapbifast/get_bisnislist", err);
      });
  }

 async convertServicesToNodes(services: any[]): Promise<any> {
  const nodes: any[] = [];

  // Layout dasar
  const startX = 20;
  const startY = 40;
  const xStep = 160;  // Jarak horizontal antar node
  const yStep = 100;  // Jarak vertikal antar baris
  const perRow = 4;   // Maksimal 4 node per baris

  // 1️⃣ Node Start
  nodes.push({
    id: 'f-node-0',
    text: 'Start',
    type: 'Start',
    position: { x: startX, y: startY },
    foblexId: 'f-node-0'
  });

  // 2️⃣ Business Tasks (tanpa random)
  services.forEach((svc, index) => {
    const nodeIndex = index + 1;

    const row = Math.floor(index / perRow); // baris ke berapa
    const col = index % perRow;             // kolom ke berapa

    const x = startX + (col + 1) * xStep;   // (+1) agar Start paling kiri
    const y = startY + row * yStep;         // tetap konsisten

    const foblexId = `f-node-${nodeIndex}`;

    nodes.push({
      id: foblexId,
      text: svc.title || `Service ${nodeIndex}`,
      type: 'Business Task',
      description: svc.description,
      position: { x, y },
      foblexId
    });
  });

  // 3️⃣ Node End — di kanan node terakhir secara pasti
  const lastTaskIndex = services.length - 1;
  const lastRow = Math.floor(lastTaskIndex / perRow);
  const lastCol = lastTaskIndex % perRow;

  const endX = startX + (lastCol + 2) * xStep; // posisi paling kanan
  const endY = startY + lastRow * yStep;

  const endIndex = nodes.length;

  nodes.push({
    id: `f-node-${endIndex}`,
    text: 'End',
    type: 'End',
    position: { x: endX, y: endY },
    foblexId: `f-node-${endIndex}`
  });

  return { nodes };
}



printCanvas() {
  console.log("Di print");
}








  // =============== HANDLER ===============
  protected onLoaded(): void {
    console.log("** on loaded ....", this.nodes());
    // Pastikan nodes selalu array valid
    const current = this.nodes();
    if (!Array.isArray(current)) {
      console.warn('⚠️ nodes() invalid saat fLoaded, reset ke array kosong.');
      this.nodes.set([]);
      this.ssrStorage.removeItem('foblex_nodes');
    }
    this.fCanvas()?.fitToScreen(PointExtensions.initialize(100, 100), false);
    // Reset posisi canvas
    // this.fCanvas()?.resetScaleAndCenter(false);
    // 🔥 Aktifkan drag baru setelah Foblex benar-benar siap
    // setTimeout(() => {
    //   this.flowReady = true;
    //   // this.addLog('Canvas siap digunakan dan nodes tervalidasi.');
    // }, 100);
    console.log('🧩 Foblex Flow fully loaded, enabling drag now...');
  }
  protected onMoveNode(event: any) {
    if (!event || !Array.isArray(event.fNodes)) return;
    console.log("urutan data ", this.nodes());
    console.log("data event ", event.fNodes);
    const moved = event.fNodes[0]; // karena selalu 1 item
    // Ambil index dari ID, misal "f-node-0" → 0
    const match = moved.id.match(/^f-node-(\d+)$/);
    console.log("Match : ", match);
    if (!match) return;
    const index = parseInt(match[1], 10);
    // Update posisi node sesuai index
    console.log("Index : ", index);
    const updated = this.nodes().map((node, i) =>
      i === index ? { ...node, position: { x: moved.position.x, y: moved.position.y } } : node
    );
    console.log("hasil Update ", updated);

    this.nodes.set(updated);
    this.ssrStorage.setItem('foblex_nodes', JSON.stringify(updated));
    // this.addLog(`📍 Node index ${index} dipindahkan ke (${moved.position.x}, ${moved.position.y})`);
  }
  protected openEditDialog(node: NodeData): void {
    console.log("Node type ", node);
    this.editNodeTarget = node;
    this.editNodeText = node.text;
    this.editNodeDescription = node.description ?? '';  // tambahkan ini
    this.editDialogVisible = true;
  }
  protected nodeClicked(node: NodeData, event: any): void {
    // event.stopPropagation();
    console.log("Data clicked ", node);
    console.log("event clicked ", event);
    console.log("connection mode ", this.isConnectionMode);
    this.selectedNodeObject = node;
  }
  stopFlowEvents(event: Event): void {
    event.stopPropagation();
  }
  protected cancelEdit(): void {
    this.editDialogVisible = false;
    this.editNodeTarget = null;
  }
  protected saveNodeEdit(): void {
    if (!this.editNodeTarget) return;

    const newText = this.editNodeText.trim();
    if (newText.length === 0) return;

    const updated = this.nodes().map(n =>
      n.id === this.editNodeTarget!.id ? { ...n, text: newText } : n
    );

    this.nodes.set(updated);
    this.ssrStorage.setItem('foblex_nodes', JSON.stringify(updated));

    // this.addLog(`Node "${this.editNodeTarget.text}" diubah menjadi "${newText}".`);

    this.editDialogVisible = false;
    this.editNodeTarget = null;
  }
  toggleConnectionMode() {
    this.isConnectionMode = !this.isConnectionMode;
    // jika ingin memastikan binding langsung aktif
    this.cdr.detectChanges();
    console.log(`🔁 Connection mode: ${this.isConnectionMode ? 'ON' : 'OFF'}`);
  }
  toggleBack() {
    this.router.navigate(['/bifast/bisnislist'])
  }
  protected saveFlowToDatabase(): void {
    const currentNodes = this.nodes();
    if (!Array.isArray(currentNodes) || currentNodes.length === 0) {
      // this.addLog('⚠️ Tidak ada node yang dapat disimpan.');
      return;
    }

    const flow = {
      nodes: currentNodes,
      connections: this.connections // tambahkan connections
    };

    // Simulasi kirim ke database / API
    console.log('💾 Menyimpan flow ke database...', flow);

    // Simpan ke localStorage sementara
    this.ssrStorage.setItem('foblex_flow_backup', JSON.stringify(flow));
    // this.addLog(`💾 ${currentNodes.length} node & ${this.connections.length} koneksi berhasil disimpan.`);
  }
  protected async generateConnections(nodes: any[]): Promise<any[]> {
  const connections: any[] = [];

  console.log("Isi nodes:", nodes);
  console.log("Jumlah node:", nodes?.length);

  for (let i = 0; i < nodes.length - 1; i++) {
    console.log("Loop jalan, index ke", i);
    const source = nodes[i];
    const target = nodes[i + 1];

    await new Promise(resolve => setTimeout(resolve, 0));

    connections.push({
      outputId: `out${source.id}`,
      inputId: `in${target.id}`,
      dropPosition: {
        x: (source.position.x + target.position.x) / 2,
        y: (source.position.y + target.position.y) / 2
      }
    });
  }

  console.log("Selesai generate:", connections);
  return connections;
}



}
// =============== INTERFACE ===============
interface NodeData {
  id: string;
  text: string;
  type?: string;
  description?: string;
  position: { x: number; y: number };
  foblexId?: string | null;
}
