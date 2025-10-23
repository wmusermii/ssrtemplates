import { MenuItem } from 'primeng/api';

export interface CustomMenuItem extends MenuItem {
  command?: (event?: any) => void;
  roles?: string[];
  items?: CustomMenuItem[];
  expanded?: boolean; // ⬅️ tambahkan ini biar bisa auto expand
}
