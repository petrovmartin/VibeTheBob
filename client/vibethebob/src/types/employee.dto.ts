export interface CreateEmployeeDto {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  displayName: string;
  email: string;
  position: string;
  address: string;
  site: string;
  managerId?: string | null;
  startDate: Date;
  endDate?: Date | null;
  department: string;
  picture?: string | null;
  isAdmin?: boolean;
} 