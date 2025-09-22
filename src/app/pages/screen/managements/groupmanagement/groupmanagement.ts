import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { LocalstorageService } from '../../../../guard/ssr/localstorage/localstorage.service';
import { Router } from '@angular/router';
import { MenuItem, TreeNode } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import cloneDeep from 'lodash-es/cloneDeep';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { DragDropModule } from 'primeng/dragdrop';
import { it } from 'node:test';
@Component({
  standalone: true,
  selector: 'app-groupmanagement',
  imports: [CommonModule, TooltipModule, FormsModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TextareaModule, TableModule, BreadcrumbModule, MessageModule, TreeModule, DragDropModule],
  templateUrl: './groupmanagement.html',
  styleUrl: './groupmanagement.css'
})
export class Groupmanagement implements OnInit {
  currentUrl: string = '';
  home: MenuItem | undefined;
  breaditems: MenuItem[] | undefined;
  //##########################################################
  token: string | null | undefined = undefined;
  userInfo: any | undefined;
  //##########################################################
  loading: boolean = false;
  cols!: Column[];
  colsRole!: Column[];
  rows = 50;
  idGroup: string = "";
  groups!: GroupField[];
  totalGroups: number = 0;
  allGroups!: GroupField[];
  globalFilter: string = '';
  selectedGroup: GroupField = {};
  rolesData!: any[];
  menusData!: any[];
  showDetailForm: any = { show: false, action: "add" };
  showDetailDelete: boolean = false;
  showRoleForm: any = { show: false, action: "root" };
  selectedRoles: any[] = [];
  showMenusDetail: any = { show: false, selectedGroup: { message: "ini harusnya isi Object" } }
  showErrorPage: any = { show: false, message: "undefined" };
  errorMessage: any = { error: false, severity: "error", message: "ini test", icon: "pi pi-exclamation-circle" };
  //################################ FOR TREE ##############################
  masterMenu: any[] = [];
  masterMenuTemp: any[] = [];
  treeData: any[] = [];
  draggedMenu: any | undefined | null;
  //######################################################################
  aclMenublob: any[] = [];
  groupForm = new FormGroup({
    idgroup: new FormControl('', [Validators.required]),
    groupname: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  get f() {
    return this.groupForm.controls;
  }
  _changeError() {
    // this.errorMessage={error:false, severity:"info", message:"", icon:"pi pi-send"};
  }
  constructor(private router: Router, private ssrStorage: LocalstorageService) { }
  async ngOnInit(): Promise<void> {
    this.currentUrl = this.router.url;
    this.token = this.ssrStorage.getItem('token');
    this.userInfo = this.ssrStorage.getItem("C_INFO");
    console.log("USER INFO ", this.userInfo);
    this.cols = [
      { field: 'idgroup', header: 'Group Id' },
      { field: 'groupname', header: 'Name' },
      { field: 'description', header: 'Description' }
    ];
    this.colsRole = [
      { field: 'idRole', header: 'Role Id' },
      { field: 'roleName', header: 'Name' },
      { field: 'roleDescription', header: 'Description' }
    ];
    this.breaditems = [{ label: 'Management' }, { label: 'Groups' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    await this._refreshACLMenu();
    if (this.aclMenublob.includes("rd")) {
      await this._refreshListData();
      await this._refreshListRoles();
      await this._refreshMenuMaster();
    }

    //################################ FOR TREE ############################
    this.masterMenu = [];
  }
  onDropNode(event: any) {
    if (this.draggedMenu) {
      // Tambah node baru di root treeData
      this.treeData = [
        ...this.treeData,
        {
          key: this.draggedMenu.id.toString(),
          label: this.draggedMenu.label,
          icon: this.draggedMenu.icon,
          data: this.draggedMenu,
          children: []
        }
      ];
      this.draggedMenu = null;
    }
  }
  async _refreshListData():Promise<void> {
    this.loading = true;
    fetch('/v2/admin/get_groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      }
    })
      .then(res => {
        console.log("Response dari API  /v2/admin/get_groups", res);
        // if (!res.ok) throw new Error('get get_groups Gagal');
        // if (!res.ok){
        //   this.showErrorPage = {show:true, message:res}
        // }
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/get_groups", data);
        this.loading = false;
        this.groups = []; this.allGroups = [];
        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
          this.groups = dataRecordsTemp;
          this.allGroups = this.groups;
          this.totalGroups = this.allGroups.length;
          this.loading = false;
        } else {
          this.groups = [];
          this.totalGroups = this.groups.length;
          this.loading = false;
          this.showErrorPage = { show: true, message: data.message }
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/admin/get_groups", err);
      });
  }
  async _refreshListRoles():Promise<void> {
    this.loading = true;
    fetch('/v2/admin/get_roles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      }
    })
      .then(res => {
        console.log("Response dari API  /v2/admin/get_roles", res);
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/get_roles", data);
        if (data.code === 20000) {
          const dataRecordsTemp = cloneDeep(data.data);
          this.rolesData = dataRecordsTemp;
          this.loading = false;
        } else {
          this.rolesData = [];
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/admin/get_groups", err);
      });
  }
  async _refreshMenuMaster():Promise<void> {
    this.loading = true;
    fetch('/v2/admin/get_menus', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      }
    })
      .then(res => {
        console.log("Response dari API  /v2/admin/get_menus", res);
        if (!res.ok) throw new Error('get get_menus Gagal');
        return res.json();
      })
      .then(data => {
        console.log("Response dari API /v2/admin/get_menus", data);
        // this.loading=false;
        // this.menus=[];this.allMenus=[];
        if (data.code === 20000) {

          this.masterMenu = [];
          const dataRecordsTemp = cloneDeep(data.data);
          this.masterMenu = dataRecordsTemp;
          this.masterMenuTemp = dataRecordsTemp;
          // this.allMenus=this.menus;
          // this.totalMenus = this.allMenus.length;
          this.loading = false;
        } else {
          // this.menus = [];
          // this.totalMenus = this.menus.length;
          this.loading = false;
        }
      })
      .catch(err => {
        console.log("Response Error Catch /v2/admin/get_roles", err);
      });
  }
  onGlobalSearch() {
    console.log("Global filter : ", this.globalFilter);
    const term = this.globalFilter.trim().toLowerCase();
    if (term === '') {
      this.groups = [...this.allGroups];
    } else {
      this.groups = this.allGroups.filter(item =>
        [item.idgroup, item.groupname, item.description]
          .some(field => field?.toLowerCase().includes(term))
      );
    }
  }
  onRowSelect(event: any) {
    console.log('Selected Group:', event.data);
    const dataObj = event.data
    this.idGroup = dataObj.idgroup
    this.groupForm.patchValue({
      "idgroup": dataObj.idgroup,
      "groupname": dataObj.groupname,
      "description": dataObj.description
    }
    );
    this.groupForm.get('idgroup')?.disable();
    this.showDetailForm = { show: true, action: "edit" };
  }
  onRowSelectRole(event: any) {
    console.log('Selected Role:', event.data);
    this.selectedRoles.push(event.data);
    console.log("SELECTED ROLES ", this.selectedRoles);
  }
  onRowUnselectRole(event: any) {
    this.selectedRoles = this.selectedRoles.filter(r => r.idRole !== event.data.idRole);
  }
  async _menusAtGroup(event: any) {
    let menuBlob:any |undefined =event.menublob
    console.log("DATA MENU SELECTED ", menuBlob);
    if(menuBlob) {
      let menuObj = JSON.parse(menuBlob)
      let tesc:any = this.cleanMenuForTree(menuObj);
      console.log("HASIL PARSE ",tesc);
      this.treeData= this.cleanMenuForTree(menuObj);
    }
    this.showMenusDetail = { show: true, selectedGroup: event }
    //  this.showRoleForm = {show:true, action:event}
  }
  async _cancelMenusAtGroup() {
    this.masterMenu = this.masterMenuTemp;



    this.showMenusDetail = { show: false, selectedGroup: {} }
  }
  async _addGroup() {
    this.groupForm.patchValue({
      "idgroup": null,
      "groupname": null,
      "description": null
    }
    )
    this.groupForm.get('idgroup')?.enable();
    this.showDetailForm = { show: true, action: "add" };
  }
  async _delGroup(event: any) {
    this.selectedGroup = event;
    this.showDetailDelete = true;
  }
  onSubmit() {
    if (this.groupForm.invalid) {
      return; // Form invalid, jangan lanjut
    }
    this.loading = true;
    const objPayload = this.groupForm.value;
    console.log("Payload form ", objPayload);
    this.groupForm.get('idgroup')?.enable();
    if (this.showDetailForm.action == "add") {
      this._saveAddData(objPayload)
    } else {
      this._saveEditData(objPayload, this.idGroup)
    }
  }
  onCancel() {
    this.showDetailForm = { show: false, action: "add" };
  }
  async onOkDelete() {
    this.loading = true;
    console.log("data to delete ", this.selectedGroup);
    await this._saveDeleteData(this.selectedGroup);
    this.showDetailDelete = false;
  }
  onCancelDelete() {
    this.showDetailDelete = false;
  }
  _saveAddData(payload: any) {
    fetch('/v2/admin/add_group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API DATA ", JSON.parse(data));
        console.log("Response dari API DATA ", data);
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }
  _saveEditData(payload: any, iGroup: string) {

    payload = { ...payload, ...{ idgroup: iGroup } }

    fetch('/v2/admin/upd_group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error update data');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API DATA ", JSON.parse(data));
        console.log("Response dari API DATA ", data);
        this.loading = false;
        if (data.code === 20000) {
          this.showDetailForm = { show: false, action: "add" };
          this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }

  _updateMenuGroup(menublob:string) {
    let payload = {idgroup:this.showMenusDetail.selectedGroup.idgroup, menublob:menublob}
    fetch('/v2/admin/upd_group_menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(data => {
        // console.log("Response dari API DATA ", JSON.parse(data));
        console.log("Response dari API DATA UPD MENUBLOB", data);
        this.loading = false;
        if (data.code === 20000) {
          // this.showDetailForm = { show: false, action: "add" };
          // this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        // alert('Login gagal: ' + err.message);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }

  async _saveDeleteData(payload: any) {
    fetch('/v2/admin/del_group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'x-client': 'angular-ssr'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Response dari API ", res);
        // logInfo
        if (!res.ok) throw new Error('Error add data');
        return res.json();
      })
      .then(async data => {
        // console.log("Response dari API DATA ", JSON.parse(data));
        console.log("Response dari API DATA ", data);
        // this.loading=false;
        if (data.code === 20000) {
          await this._refreshListData();
        } else {
          this.errorMessage = { error: true, severity: "error", message: `${data.message}`, icon: "pi pi-times" }
        }
      })
      .catch(err => {
        console.log("Response Error ", err);
        this.errorMessage = { error: true, severity: "error", message: `${err}`, icon: "pi pi-times" }
      });
  }
  //############################################## FOR DRAG AND DROP ################################
  dragStart(menu: any) {
    console.log("Dragging Menu");
    this.draggedMenu = menu;
  }
  dragEnd() {
    console.log("Dragging End");
    // this.draggedMenu = null;
  }
  onDropRootStart(event: any) {
    console.log("Drop Root Start Event ");
    this.selectedRoles = [];
    this.showRoleForm = { show: true, action: "root", draggedMenu: this.draggedMenu }
  }
  onDropRoot(event: any) {
    console.log("Drop Root Event ",this.draggedMenu);
    if (this.draggedMenu) {
      this.treeData = [
        ...this.treeData,
        this.createNode(this.draggedMenu)
      ];
      this.removeFromMaster(this.draggedMenu.idMenu);
      this.draggedMenu = null;
    }
  }
  onDropChildStart(event: any, parentNode: any) {
    console.log("Drop Child Event Start");
    this.selectedRoles = [];
    this.showRoleForm = { show: true, action: "child", draggedMenu: this.draggedMenu, parentNode: parentNode }
  }
  onDropChild(event: any, parentNode: any) {
    console.log("Drop Child Event ");
    if (this.draggedMenu) {
      parentNode.children = parentNode.children || [];
      parentNode.children.push(this.createNode(this.draggedMenu));
      parentNode.expanded = true;
      this.removeFromMaster(this.draggedMenu.idMenu);
      this.draggedMenu = null;
    }
  }
  async _roleSubmit() {
    console.log("Selected Role", this.selectedRoles);
    console.log("DraggedMenu", this.draggedMenu);
    console.log("Role Form", this.showRoleForm);
    // Ambil semua idRole
    if (this.selectedRoles.length > 0) {
      this.draggedMenu = { ...this.draggedMenu, ...{ roles: this.selectedRoles.map(item => item.idRole) } }
    }
    if (this.showRoleForm.action === 'root') {
      this.onDropRoot(this.draggedMenu);
    } else {
      this.onDropChild(this.draggedMenu, this.showRoleForm.parentNode);
    }
    this.showRoleForm = { show: false, action: "root" }
  }
  async _roleCancel() {
    this.selectedRoles = [];
    console.log("Selected Role", this.selectedRoles);
    console.log("DraggedMenu", this.draggedMenu);
    this.draggedMenu = null;
    this.showRoleForm = { show: false, action: "root" }
  }

  // Ambil semua node + descendant dalam bentuk flat list
  private flattenNodes(node: any): any[] {
    let nodes = [node];
    if (node.children && node.children.length > 0) {
      for (let child of node.children) {
        nodes = nodes.concat(this.flattenNodes(child));
      }
    }
    return nodes;
  }
  private removeNode(target: any, nodes: any[]): boolean {
    const index = nodes.findIndex(n => n.key === target.key);
    if (index !== -1) {
      nodes.splice(index, 1);
      return true;
    }
    // Cari rekursif ke children
    for (let node of nodes) {
      if (node.children && this.removeNode(target, node.children)) {
        return true;
      }
    }
    return false;
  }

  deleteNode(node: any, nodes: any[]) {
    // 1. Flatten untuk ambil node beserta semua anak-anaknya
    const allNodes = this.flattenNodes(node);
    // 2. Kembalikan semua ke master menu
    for (let n of allNodes) {
      this.masterMenu.push({
        idMenu: +n.key,
        nameMenu: n.label,
        iconMenu: n.icon,
        pathMenu: n.path
      });
    }
    // 3. Hapus dari treeData (rekursif)
    this.removeNode(node, this.treeData);
  }
  private createNode(menu: any) {
    return {
      key: menu.idMenu.toString(),
      label: menu.nameMenu,
      icon: menu.iconMenu,
      path: menu.pathMenu,
      roles: menu.roles,
      children: []
    };
  }

  private removeFromMaster(id: number) {
    this.masterMenu = this.masterMenu.filter(m => m.idMenu !== id);
  }

  async _refreshACLMenu(): Promise<void> {
      const payload: any = { routeUrl: this.currentUrl };
      console.log("PAYLOAD ATTRB ", payload);
      this.loading = true;

      try {
        const res = await fetch('/v2/auth/aclattrb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'x-client': 'angular-ssr'
          },
          body: JSON.stringify(payload)
        });

        console.log("Response dari API /v2/auth/aclattrb", res);

        const data = await res.json();
        console.log("Response dari API /v2/auth/aclattrb", data);

        this.loading = false;

        if (data.code === 20000) {
          const dataRecordsMenu: any = cloneDeep(data.data);
          this.aclMenublob = dataRecordsMenu.roles;
        } else {
          this.aclMenublob = [];
        }
        console.log("ACL MENU INI ", this.aclMenublob);
      } catch (err) {
        console.log("Response Error Catch /v2/auth/aclattrb", err);
        this.aclMenublob = [];
        this.loading = false;
      }
    }

  async _generateMenusAtGroup(){
    this.loading = true;
    const compactMenu = await this.transformTreeToMenuModel(this.treeData);
    this._updateMenuGroup(JSON.stringify(compactMenu))
  }
  // Transform treeData -> PrimeNG MenuModel
async transformTreeToMenuModel(nodes: any[], isRoot = true): Promise<any[]> {
  const transformed = await Promise.all(
    nodes.map(async node => {
      const menuItem: any = {
        label: node.label
      };
      if (node.icon) {
        menuItem.icon = node.icon;
      }
      if (node.path) {
        menuItem.routerLink = node.path;
      }
      if (node.roles && Array.isArray(node.roles) && node.roles.length > 0) {
        menuItem.roles = [...node.roles];
      }
      if (node.children && node.children.length > 0) {
        menuItem.items = await this.transformTreeToMenuModel(node.children, false);
      }
      return menuItem;
    })
  );

  // Tambahkan Privacy & Security hanya sekali di level root
  if (isRoot) {
    transformed.push({
      label: "Privacy & Security",
      items: [
        {
          label: "Profile",
          icon: "pi pi-user",
          routerLink: "/privacy/profile"
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          routerLink: "/privacy/logout"
        }
      ]
    });
  }

  return transformed;
}

private cleanMenuForTree(data: any): any[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .filter(item => item.label !== "Privacy & Security")
    .map(item => {

// --- hapus item dari masterMenu kalau ada yang match ---
      this.masterMenu = this.masterMenu.filter(
        m => m.nameMenu !== item.label
      );


      const newItem: any = {
        key: `id${item.label}`,
        label: item.label
      };
      if (item.icon) {
        newItem.icon = item.icon;
      }

      if (item.routerLink) {
        newItem.path = item.routerLink;
      }

      if (item.roles && item.roles.length > 0) {
        newItem.roles = [...item.roles];
      }

      // --- cek items ---
// console.log("CHECK ITEMS ", item.items);
      if (item.items) {
        let parsedItems: any[] = [];

        if (typeof item.items === "string") {
          // console.log("itemnya string : ", item.items);
          try {
            parsedItems = JSON.parse(item.items);
            // console.log("itemnya aray : ", parsedItems);
          } catch (e) {
            console.warn("Gagal parse items string:", item.items);
          }
        } else if (Array.isArray(item.items)) {
          // console.log("itemnya ternyata array : ", item.items);
          parsedItems = item.items;
        }

        if (parsedItems.length > 0) {
          newItem.children = this.cleanMenuForTree(parsedItems);
        }
      }

      return newItem;
    });
}







}
interface GroupField {
  idgroup?: string | null;
  groupname?: string | null;
  menublob?: string | null;
  description?: string | null;
}
interface Column {
  field?: string | null;
  header?: string | null;
  class?: string | null;
  cellclass?: string | null;
}
interface RoleField {
  idRole?: string | null;
  roleName?: string | null;
  roleDescription?: string | null;
}
