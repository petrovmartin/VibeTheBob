import { BaseEntity, Status } from '../common';

// Department Interface
export interface Department extends BaseEntity {
  name: string;
  description?: string;
  managerId: string;
  parentDepartmentId?: string;
  status: Status;
}

// Position/Job Title Interface
export interface Position extends BaseEntity {
  title: string;
  description?: string;
  departmentId: string;
  level: number;
  isManagerial: boolean;
  status: Status;
}

// Employment History Interface
export interface EmploymentHistory extends BaseEntity {
  employeeId: string;
  position: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  salary: number;
  currency: string;
  reasonForChange?: string;
}

// Leave Balance Interface
export interface LeaveBalance extends BaseEntity {
  employeeId: string;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  cycleStartDate: Date;
  cycleEndDate: Date;
}

// Leave Types
export type LeaveType = 'ANNUAL' | 'SICK' | 'PARENTAL' | 'UNPAID' | 'OTHER';

// Department Tree Node (for hierarchical department structure)
export interface DepartmentTreeNode extends Department {
  children: DepartmentTreeNode[];
  level: number;
  path: string[];
}

// Organization Chart
export interface OrganizationChart {
  rootDepartment: DepartmentTreeNode;
  totalEmployees: number;
  totalDepartments: number;
  maxDepth: number;
  updatedAt: Date;
} 