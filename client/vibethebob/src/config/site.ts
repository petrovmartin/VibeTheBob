import { UserRole } from "@/types/user";
import {
  Users,
  Building2,
  CalendarDays,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";

export const siteConfig = {
  name: "VibeTheBob HRMS",
  navigation: [
    {
      href: "/dashboard",
      icon: BarChart3,
      label: "Dashboard",
    },
    {
      href: "/employees",
      icon: Users,
      label: "Employees",
      role: UserRole.HR,
    },
    {
      href: "/departments",
      icon: Building2,
      label: "Departments",
      role: UserRole.HR,
    },
    {
      href: "/attendance",
      icon: CalendarDays,
      label: "Attendance",
    },
    {
      href: "/documents",
      icon: FileText,
      label: "Documents",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      role: UserRole.ADMIN,
    },
  ],
} as const; 