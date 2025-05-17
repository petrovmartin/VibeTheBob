import { BaseEntity } from '../common';

// Document Types
export type DocumentType = 'RESUME' | 'CONTRACT' | 'ID_PROOF' | 'CERTIFICATE' | 'OTHER';

// Document Status
export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

// Document Manager Class
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
      doc.status = 'VERIFIED';
      doc.verifiedAt = new Date();
    }
  }

  getVerifiedDocuments(): EmployeeDocument[] {
    return this.documents.filter(doc => doc.status === 'VERIFIED');
  }

  getExpiredDocuments(): EmployeeDocument[] {
    const now = new Date();
    return this.documents.filter(doc => 
      doc.expiryDate && doc.expiryDate < now
    );
  }
}

// Employee Document Interface
export interface EmployeeDocument extends BaseEntity {
  employeeId: string;
  documentType: DocumentType;
  documentName: string;
  documentUrl: string;
  status: DocumentStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  expiryDate?: Date;
  metadata: {
    fileSize: number;
    fileType: string;
    version: number;
  };
  tags: string[];
}

// Document Category
export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  requiredFor: ('ONBOARDING' | 'COMPLIANCE' | 'PERFORMANCE' | 'OTHER')[];
  validityPeriod?: number; // in days
  isRequired: boolean;
}

// Document Template
export interface DocumentTemplate extends BaseEntity {
  name: string;
  description?: string;
  category: string;
  content: string;
  variables: string[];
  version: number;
  isActive: boolean;
}

// Document Audit Log
export interface DocumentAuditLog extends BaseEntity {
  documentId: string;
  action: 'CREATED' | 'UPDATED' | 'VERIFIED' | 'DOWNLOADED' | 'DELETED';
  performedBy: string;
  performedAt: Date;
  details?: string;
} 