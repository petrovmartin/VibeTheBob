// Base entity interface for common fields
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Common address interface
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Common contact information
export interface ContactInfo {
  phoneNumber: string;
  email: string;
  alternativePhone?: string;
}

// Common date range
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Common status types
export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ARCHIVED';

// Common currency type
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD'; 