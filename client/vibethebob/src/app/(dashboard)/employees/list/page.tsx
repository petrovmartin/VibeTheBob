'use client';

import { EmployeeManagement } from '@/components/employees/employee-management';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export default function EmployeeDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="space-y-6">
        <EmployeeManagement />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
} 