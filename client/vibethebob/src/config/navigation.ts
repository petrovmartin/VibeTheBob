import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Target, 
  Calendar, 
  FileText, 
  Settings,
  Briefcase,
  UserCog,
  Building,
  Award,
  FileStack,
  Clock
} from 'lucide-react';

export interface NavigationItem {
  title: string;
  href: string;
  icon?: typeof LayoutDashboard;
  items?: NavigationItem[];
}

export interface NavigationConfig {
  mainNav: NavigationItem[];
  sidebarNav: NavigationItem[];
}

export const navigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Employees',
      href: '/employees',
      icon: Users,
    },
    {
      title: 'Organization',
      href: '/organization',
      icon: Building2,
    },
  ],
  sidebarNav: [
    {
      title: 'Dashboard',
      href: '/employees/home',
      icon: LayoutDashboard,
    },
    {
      title: 'Employee Management',
      href: '/employees',
      icon: Users,
      items: [
        { title: 'Employees', href: '/employees/list', icon: UserCog },
        { title: 'Time Off', href: '/employees/time-off', icon: Calendar },
        { title: 'Documents', href: '/employees/documents', icon: FileText },
      ],
    },
    {
      title: 'Organization',
      href: '/organization',
      icon: Building2,
      items: [
        { title: 'Departments', href: '/organization/departments', icon: Building },
        { title: 'Positions', href: '/organization/positions', icon: Briefcase },
        { title: 'Managers', href: '/organization/managers', icon: UserCog },
      ],
    },
    {
      title: 'Performance',
      href: '/performance',
      icon: Target,
      items: [
        { title: 'Goals', href: '/performance/goals', icon: Award },
        { title: 'Reviews', href: '/performance/reviews', icon: FileStack },
        { title: '1-on-1s', href: '/performance/one-on-ones', icon: Clock },
      ],
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ],
}; 