import { BaseEntity, DateRange } from '../common';

// Performance Review Status
export type ReviewStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'ACKNOWLEDGED';

// Rating Category
export interface RatingCategory {
  name: string;
  description: string;
  weight: number;
}

// Performance Rating
export interface Rating {
  category: string;
  score: number;
  comments: string;
}

// Performance Review Class
export class PerformanceReview implements BaseEntity {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriod: DateRange;
  ratings: Rating[];
  overallRating: number;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
  nextReviewDate?: Date;
  comments: string;

  constructor(data: {
    id: string;
    employeeId: string;
    reviewerId: string;
    reviewPeriod: DateRange;
    ratings?: Rating[];
    overallRating?: number;
    status?: ReviewStatus;
    nextReviewDate?: Date;
    comments?: string;
  }) {
    this.id = data.id;
    this.employeeId = data.employeeId;
    this.reviewerId = data.reviewerId;
    this.reviewPeriod = data.reviewPeriod;
    this.ratings = data.ratings || [];
    this.overallRating = data.overallRating || 0;
    this.status = data.status || 'DRAFT';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.nextReviewDate = data.nextReviewDate;
    this.comments = data.comments || '';
  }

  calculateOverallRating(): number {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, curr) => acc + curr.score, 0);
    return sum / this.ratings.length;
  }

  submit(): void {
    this.status = 'SUBMITTED';
    this.updatedAt = new Date();
  }

  acknowledge(): void {
    this.status = 'ACKNOWLEDGED';
    this.updatedAt = new Date();
  }
}

// Goal/OKR Types
export type GoalCategory = 'PERSONAL' | 'TEAM' | 'DEPARTMENT' | 'COMPANY';
export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Key Result Interface
export interface KeyResult extends BaseEntity {
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  weight: number;
}

// Goal Class
export class Goal implements BaseEntity {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  progress: number;
  startDate: Date;
  dueDate: Date;
  completedDate?: Date;
  keyResults: KeyResult[];
  alignedToGoalId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    category: GoalCategory;
    startDate: Date;
    dueDate: Date;
    keyResults?: KeyResult[];
    alignedToGoalId?: string;
  }) {
    this.id = data.id;
    this.employeeId = data.employeeId;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.status = 'NOT_STARTED';
    this.progress = 0;
    this.startDate = data.startDate;
    this.dueDate = data.dueDate;
    this.keyResults = data.keyResults || [];
    this.alignedToGoalId = data.alignedToGoalId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateProgress(progress: number): void {
    this.progress = Math.min(100, Math.max(0, progress));
    this.updatedAt = new Date();
  }

  complete(): void {
    this.status = 'COMPLETED';
    this.progress = 100;
    this.completedDate = new Date();
    this.updatedAt = new Date();
  }

  calculateProgress(): number {
    if (this.keyResults.length === 0) return 0;
    const weightedProgress = this.keyResults.reduce((acc, kr) => {
      const progress = (kr.currentValue / kr.targetValue) * kr.weight;
      return acc + progress;
    }, 0);
    return Math.min(100, weightedProgress);
  }
}

// Performance Metrics
export interface PerformanceMetrics {
  employeeId: string;
  period: DateRange;
  metrics: {
    category: string;
    value: number;
    target: number;
    unit: string;
  }[];
  overallScore: number;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
} 