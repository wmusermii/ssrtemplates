import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-flowcanvas',
  standalone: true,
  templateUrl: './flowcanvas.html',
  styleUrls: ['./flowcanvas.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Flowcanvas implements AfterViewInit {
  @ViewChild('fcanvas', { static: true }) fcanvasRef!: ElementRef<HTMLElement>;
  @ViewChild('fflow', { static: true }) fflowRef!: ElementRef<HTMLElement>;
  breaditems:any[] = [{ label: 'Siap-UBP' }, { label: 'Company List' }];
  home:any = { icon: 'pi pi-home', routerLink: '/' };
  private dragType: string | null = null;
  private dragColor: string | null = null;
  logs: string[] = [];

  ngAfterViewInit() {
    this.addLog('Canvas siap digunakan.');
  }

  // Drag dari palet
  onDragStart(event: DragEvent, type: string, color: string) {
    this.dragType = type;
    this.dragColor = color;
    event.dataTransfer?.setData('nodeType', type);
    event.dataTransfer?.setData('nodeColor', color);
    this.addLog(`Mulai drag node: ${type}`);
  }

  // Supaya bisa di-drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Saat drop ke canvas
  onDrop(event: DragEvent) {
    event.preventDefault();

    const type = event.dataTransfer?.getData('nodeType') || this.dragType;
    const color = event.dataTransfer?.getData('nodeColor') || this.dragColor;
    if (!type) return;

    const canvasEl = this.fcanvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Buat node baru
    const nodeEl = document.createElement('div');
    nodeEl.setAttribute('fNode', '');
    nodeEl.setAttribute('fDragHandle', '');
    nodeEl.style.position = 'absolute';
    nodeEl.style.left = `${x}px`;
    nodeEl.style.top = `${y}px`;
    nodeEl.style.width = '150px';
    nodeEl.style.height = '80px';
    nodeEl.style.lineHeight = '80px';
    nodeEl.style.textAlign = 'center';
    nodeEl.style.fontWeight = '600';
    nodeEl.style.cursor = 'move';
    nodeEl.style.borderRadius = '12px';
    nodeEl.style.backgroundColor = color || '#86efac';
    nodeEl.style.color = 'white';
    nodeEl.classList.add('shadow-md', 'select-none');
    nodeEl.textContent = type;

    // Event klik
    nodeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.addLog(`Node "${type}" diklik di posisi (${x.toFixed(0)}, ${y.toFixed(0)})`);
    });

    // Tambahkan node ke canvas
    canvasEl.appendChild(nodeEl);

    // Paksa Foblex re-init agar bisa drag
    const fflow: any = this.fflowRef.nativeElement;
    if (fflow?.update) {
      fflow.update();
    } else if ((canvasEl as any)?.update) {
      (canvasEl as any).update();
    }

    this.addLog(`Node "${type}" ditambahkan di posisi (${x.toFixed(0)}, ${y.toFixed(0)})`);
  }

  // Tambah log aktivitas
  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.unshift(`[${timestamp}] ${message}`);
  }
}
