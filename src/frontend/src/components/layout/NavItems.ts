import { LayoutDashboard, Store, Megaphone, MousePointerClick, Package, Truck, CheckSquare, FileText, BookOpen, Settings } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: any;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Brands', path: '/brands', icon: Store },
  { label: 'Marketing', path: '/marketing', icon: Megaphone },
  { label: 'CRO', path: '/cro', icon: MousePointerClick },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Operations', path: '/operations', icon: Truck },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Knowledge', path: '/knowledge', icon: BookOpen },
  { label: 'Settings', path: '/settings', icon: Settings },
];
