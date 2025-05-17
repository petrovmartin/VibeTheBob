import { BaseEntity, Address, ContactInfo } from '../common';
import { EmploymentStatus } from './enums';

// User Role Enum
export enum UserRole {
  ADMIN = 'ADMIN',
  HR = 'HR',
  RECRUITER = 'RECRUITER',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

// Base User Class
export class User implements BaseEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;

  constructor(data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive?: boolean;
    lastLoginAt?: Date;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastLoginAt = data.lastLoginAt;
    this.isActive = data.isActive ?? true;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}

// Employee Profile Interface
export interface EmployeeProfile extends BaseEntity {
  userId: string;
  employeeId: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  contactInfo: ContactInfo;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  address: Address;
  department: string;
  position: string;
  joiningDate: Date;
  employmentStatus: EmploymentStatus;
  reportingManagerId?: string;
  salary: {
    amount: number;
    currency: string;
    effectiveDate: Date;
  };
}

// Employee Class
export class Employee {
  private _profile: EmployeeProfile;
  private _documents: EmployeeDocument[];
  private _skills: EmployeeSkill[];

  constructor(profile: EmployeeProfile) {
    this._profile = profile;
    this._documents = [];
    this._skills = [];
  }

  get profile(): EmployeeProfile {
    return this._profile;
  }

  calculateCurrentSalary(): number {
    return this._profile.salary.amount;
  }

  isOnLeave(): boolean {
    return this._profile.employmentStatus === EmploymentStatus.ON_LEAVE;
  }

  addDocument(doc: EmployeeDocument): void {
    this._documents.push(doc);
  }

  addSkill(skill: EmployeeSkill): void {
    this._skills.push(skill);
  }
}

// Employee Document Interface
export interface EmployeeDocument extends BaseEntity {
  employeeId: string;
  documentType: 'RESUME' | 'CONTRACT' | 'ID_PROOF' | 'CERTIFICATE' | 'OTHER';
  documentName: string;
  documentUrl: string;
  uploadedAt: Date;
  expiryDate?: Date;
  isVerified: boolean;
}

// Employee Skill Interface
export interface EmployeeSkill extends BaseEntity {
  employeeId: string;
  skillName: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
  lastUsedDate?: Date;
  certifications?: string[];
} 