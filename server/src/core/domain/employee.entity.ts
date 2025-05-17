import { Employee as PrismaEmployee } from '@prisma/client';

export class Employee {
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

  constructor(partial: Partial<Employee>) {
    Object.assign(this, partial);
  }

  static fromPrisma(prismaEmployee: PrismaEmployee): Employee {
    const { password, csrfToken, lastLogin, ...employeeData } = prismaEmployee;
    return new Employee(employeeData);
  }
} 