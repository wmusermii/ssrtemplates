import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  viewChild,
  OnDestroy,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import {
  FCanvasComponent,
  FCreateNodeEvent,
  FExternalItemDirective,
  FExternalItemPlaceholderDirective,
  FExternalItemPreviewDirective,
  FFlowModule,
} from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import { FCheckboxComponent } from '@foblex/m-render';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { LocalstorageService } from '../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ReversePipe } from "../../../layouts/directive/utils/reversePipe";
@Component({
  selector: 'app-flowcanvas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, DialogModule, SelectModule,
    FFlowModule,
    FExternalItemDirective,
    FExternalItemPlaceholderDirective,
    FExternalItemPreviewDirective,
    FCheckboxComponent,
    ReversePipe
],
  templateUrl: './flowcanvas.html',
  styleUrls: ['./flowcanvas.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Flowcanvas implements OnInit, AfterViewInit, OnDestroy {
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  logs: string[] = [];
  isReady = false;
  flowReady = false;
  private hasViewInited = false;
  editDialogVisible = false;
  editNodeTarget: NodeData | null = null;
  editNodeText = '';
  selectedNodeObject:any ={};
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

  // =============== INIT ===============
  ngOnInit(): void {
    this.breaditems = [{ label: 'Flowdiagram' }, { label: 'Foblex Sample' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };

    // 🔄 Pulihkan node dari SSR LocalStorage dengan validasi aman
    const raw = this.ssrStorage.getItem('foblex_nodes');
    const rawString = typeof raw === 'string' ? raw : '';
    console.log("init ", rawString);
    if (rawString && rawString.trim().length > 0) {
      // console.log("ON INIT MASUK ....",rawString);
      try {
        const parsed = JSON.parse(rawString);
        if (Array.isArray(parsed)) {
          this.nodes.set(parsed);
          this.addLog(`Memuat ${parsed.length} node dari penyimpanan lokal.`);
        } else {
          this.nodes.set([]);
          this.addLog('⚠️ Data node tidak valid, mulai baru.');
          this.ssrStorage.removeItem('foblex_nodes');
        }
      } catch (e) {
        console.error('❌ Gagal parse data foblex_nodes:', e);
        this.nodes.set([]);
        this.ssrStorage.removeItem('foblex_nodes');
      }
    } else {
      this.nodes.set([]);
      this.addLog('Tidak ada data node tersimpan, memulai baru.');
    }

    setTimeout(() => {
      this.isReady = true;
      this.cdr.detectChanges(); // biar Angular re-render f-flow
      console.log('✅ Foblex diaktifkan setelah data nodes siap.');
    }, 150);
    window.addEventListener('keydown', this.onKeyDown.bind(this));

  }
  ngAfterViewInit(): void {
    console.warn('Canvas siap digunakan.');
    this.addLog('Canvas siap digunakan.');
    this.flowReady = true;
    this.fCanvas()?.resetScaleAndCenter(false);
    // Paksa Angular untuk re-render log
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
  }


  // =============== HANDLER ===============
  protected onLoaded(): void {
    console.log("ON LOADED ....", this.nodes());

    // Pastikan nodes selalu array valid
    const current = this.nodes();
    if (!Array.isArray(current)) {
      console.warn('⚠️ nodes() invalid saat fLoaded, reset ke array kosong.');
      this.nodes.set([]);
      this.ssrStorage.removeItem('foblex_nodes');
    }

    // Reset posisi canvas
    this.fCanvas()?.resetScaleAndCenter(false);
    // 🔥 Aktifkan drag baru setelah Foblex benar-benar siap
    setTimeout(() => {
      this.flowReady = true;
      this.addLog('Canvas siap digunakan dan nodes tervalidasi.');
    }, 100);
    console.log('🧩 Foblex Flow fully loaded, enabling drag now...');
  }



  protected onCreateNode(event: FCreateNodeEvent): void {
  try {
    console.log('fCreateNode event:', event);

    if (!this.flowReady) return;

    const rawData = (event as any)?.data ?? '';
    const nodeType = typeof rawData === 'string' ? rawData : 'Task';
    let nodeText = '';

    if (typeof rawData === 'string' && rawData.trim() !== '') nodeText = rawData;
    else if (rawData && typeof rawData === 'object')
      nodeText = rawData.label || rawData.text || rawData.type || 'Untitled Node';
    else nodeText = 'Node ' + ((this.nodes()?.length || 0) + 1);

    const rect = (event as any)?.rect || { x: 0, y: 0 };

    // Buat node state dengan ID internal sementara
    const newNode: NodeData = {
      id: generateGuid(),        // ID internal
      text: nodeText,
      type: nodeType,
      position: { x: rect.x, y: rect.y },
      foblexId: null,            // nanti akan diset dengan ID Foblex asli
    };

    const current = Array.isArray(this.nodes()) ? this.nodes() : [];
    const updated = [...current, newNode];
    this.nodes.set(updated);
    this.ssrStorage.setItem('foblex_nodes', JSON.stringify(updated));

    this.addLog(`🆕 Node "${newNode.text}" dibuat pada (${rect.x}, ${rect.y}).`);

    // 🔄 Tunggu DOM node muncul
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((el: any) => {
          if (el.classList?.contains('f-node') && el.textContent?.includes(nodeText)) {
            // Sinkronkan ID Foblex
            const synced = this.nodes().map(n =>
              n.id === newNode.id ? { ...n, foblexId: el.id } : n
            );
            this.nodes.set(synced);
            this.ssrStorage.setItem('foblex_nodes', JSON.stringify(synced));
            this.addLog(`🔗 Node "${nodeText}" disinkronkan ke ID Foblex ${el.id}.`);
            observer.disconnect(); // hentikan observer setelah ketemu
          }
        });
      }
    });

    observer.observe(document.querySelector('.f-canvas')!, { childList: true, subtree: true });
  } catch (err) {
    console.error('❌ Gagal membuat node baru:', err);
    this.addLog('Terjadi kesalahan saat membuat node baru.');
  }
}

private onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Delete' && this.selectedNodeObject) {
    this.deleteNode(this.selectedNodeObject);
  }
}
protected deleteNode(payload: any): void {
  console.log("Data awal ", this.nodes());
  console.log("yang di delete : ", payload);
  const nodesArray = this.nodes();
  if (!nodesArray) return;
  const updatedNodes = this.nodes().filter(n => n.id !== payload.id);
  this.nodes.set(updatedNodes);
  this.ssrStorage.setItem('foblex_nodes', JSON.stringify(this.nodes()));
  this.addLog(`❌ Node "${payload.id}" dihapus dari canvas.`);
  this.selectedNodeObject = null;
}



  protected onPreviewMatchSizeChange(checked: boolean): void {
    this.isMatchSize.set(checked);
  }

  protected resetFlow(): void {
    this.nodes.set([]);
    this.ssrStorage.removeItem('foblex_nodes');
    this.addLog('🗑️ Semua node dihapus.');
  }

  // =============== LOGGING ===============
  addLog(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.unshift(`[${timestamp}] ${message}`);
  }
  protected editNode(node: NodeData): void {
    const newText = prompt('Edit nama node:', node.text);
    if (newText && newText.trim().length > 0) {
      const updated = this.nodes().map(n =>
        n.id === node.id ? { ...n, text: newText.trim() } : n
      );
      this.nodes.set(updated);
      this.ssrStorage.setItem('foblex_nodes', JSON.stringify(updated));
      this.addLog(`Node "${node.text}" diubah menjadi "${newText}".`);
    }
  }
  protected openEditDialog(node: NodeData): void {
    this.editNodeTarget = node;
    this.editNodeText = node.text;
    this.editDialogVisible = true;
  }
  protected nodeClicked(node: NodeData, event:any):void{
    console.log("Data clicked ", node);
    console.log("event clicked ", event);
    this.selectedNodeObject = node;
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

    this.addLog(`Node "${this.editNodeTarget.text}" diubah menjadi "${newText}".`);

    this.editDialogVisible = false;
    this.editNodeTarget = null;
  }
  protected saveFlowToDatabase(): void {
    const currentNodes = this.nodes();
    if (!Array.isArray(currentNodes) || currentNodes.length === 0) {
      this.addLog('⚠️ Tidak ada node yang dapat disimpan.');
      return;
    }
    // Simulasi kirim ke database (nanti bisa diganti panggilan API)
    console.log('💾 Menyimpan ke database...', currentNodes);
    // Contoh: simpan juga ke localstorage
    this.ssrStorage.setItem('foblex_nodes_backup', JSON.stringify(currentNodes));
    this.addLog(`💾 ${currentNodes.length} node berhasil disimpan ke database.`);
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
      this.addLog(`📍 Node index ${index} dipindahkan ke (${moved.position.x}, ${moved.position.y})`);




  }

  protected onDragEnded(event:any){
    console.log("Drag ended ", event);
  }

  // protected onNodeMoved(detail: any): void {
  //   const movedId = detail.id;
  //   const rect = detail.rect;
  //   if (!movedId || !rect) return;

  //   const updated = this.nodes().map(node =>
  //     node.id === movedId
  //       ? { ...node, position: { x: rect.x, y: rect.y } }
  //       : node
  //   );

  //   this.nodes.set(updated);
  //   this.ssrStorage.setItem('foblex_nodes', JSON.stringify(updated));
  //   this.addLog(`📍 Node "${movedId}" dipindahkan ke (${rect.x}, ${rect.y}).`);
  // }

  stopFlowEvents(event: Event): void {
    event.stopPropagation();
  }
}

// =============== INTERFACE ===============
interface NodeData {
  id: string;
  text: string;
  type?: string;
  position: { x: number; y: number };
  foblexId?: string | null;
}
