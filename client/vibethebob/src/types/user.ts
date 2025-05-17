// User Role Enum
export enum UserRole {
  ADMIN = 'ADMIN',
  HR = 'HR',
  RECRUITER = 'RECRUITER',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

// Employment Status Enum
export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
  SUSPENDED = 'SUSPENDED'
}

// Base User Class - Using class because we need instance methods and constructor logic
export class User {
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

// Employee Profile Class - Using class because we'll need methods for salary calculations and status management
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

// DTO Interfaces - Using interfaces because these are just data shapes
export interface EmployeeProfile {
  id: string;
  userId: string;
  employeeId: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
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

// Organization Interfaces - Using interfaces as these are primarily data structures
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  parentDepartmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  title: string;
  description?: string;
  departmentId: string;
  level: number;
  isManagerial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Document Management Class - Using class because we need document handling methods
export class DocumentManager {
  private documents: EmployeeDocument[];

  constructor() {
    this.documents = [];
  }

  addDocument(doc: EmployeeDocument): void {
    this.documents.push(doc);
  }

  verifyDocument(docId: string): void {
    const doc = this.documents.find(d => d.id === docId);
    if (doc) {
      doc.isVerified = true;
    }
  }

  getVerifiedDocuments(): EmployeeDocument[] {
    return this.documents.filter(doc => doc.isVerified);
  }
}

// Data Transfer Objects (DTOs) - Using interfaces as these are just data shapes
export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: 'RESUME' | 'CONTRACT' | 'ID_PROOF' | 'CERTIFICATE' | 'OTHER';
  documentName: string;
  documentUrl: string;
  uploadedAt: Date;
  expiryDate?: Date;
  isVerified: boolean;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  cycleStartDate: Date;
  cycleEndDate: Date;
}

export interface EmployeeSkill {
  id: string;
  employeeId: string;
  skillName: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  yearsOfExperience: number;
  lastUsedDate?: Date;
  certifications?: string[];
}

// Performance Management Classes - Using classes because we need methods for calculations and state management
export class PerformanceReview {
  private _review: {
    id: string;
    employeeId: string;
    reviewerId: string;
    reviewPeriod: {
      startDate: Date;
      endDate: Date;
    };
    ratings: {
      category: string;
      score: number;
      comments: string;
    }[];
    overallRating: number;
    status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'ACKNOWLEDGED';
    createdAt: Date;
    updatedAt: Date;
    nextReviewDate?: Date;
  };

  constructor(review: PerformanceReview['_review']) {
    this._review = review;
  }

  calculateOverallRating(): number {
    const sum = this._review.ratings.reduce((acc, curr) => acc + curr.score, 0);
    return sum / this._review.ratings.length;
  }

  submit(): void {
    this._review.status = 'SUBMITTED';
    this._review.updatedAt = new Date();
  }

  acknowledge(): void {
    this._review.status = 'ACKNOWLEDGED';
    this._review.updatedAt = new Date();
  }
}

export class Goal {
  private _goal: {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    category: 'PERSONAL' | 'TEAM' | 'DEPARTMENT' | 'COMPANY';
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    progress: number;
    startDate: Date;
    dueDate: Date;
    completedDate?: Date;
    keyResults: {
      id: string;
      description: string;
      targetValue: number;
      currentValue: number;
      unit: string;
    }[];
    alignedToGoalId?: string;
    createdAt: Date;
    updatedAt: Date;
  };

  constructor(goal: Goal['_goal']) {
    this._goal = goal;
  }

  updateProgress(progress: number): void {
    this._goal.progress = Math.min(100, Math.max(0, progress));
    this._goal.updatedAt = new Date();
  }

  complete(): void {
    this._goal.status = 'COMPLETED';
    this._goal.progress = 100;
    this._goal.completedDate = new Date();
    this._goal.updatedAt = new Date();
  }

  calculateProgress(): number {
    const totalProgress = this._goal.keyResults.reduce((acc, kr) => {
      return acc + (kr.currentValue / kr.targetValue) * 100;
    }, 0);
    return totalProgress / this._goal.keyResults.length;
  }
} 