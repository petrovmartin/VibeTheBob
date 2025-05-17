export interface Employee {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  displayName: string;
  email: string;
  position: string;
  address: string;
  site: string;
  managerId: string | null;
  startDate: Date;
  endDate: Date | null;
  department: string;
  picture: string | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isAdmin: boolean;
  
  // Relationships
  manager?: Employee | null;
  subordinates?: Employee[];
}

export type CreateEmployeeDto = Omit<
  Employee,
  'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'manager' | 'subordinates'
>;

export type UpdateEmployeeDto = Partial<CreateEmployeeDto>; 