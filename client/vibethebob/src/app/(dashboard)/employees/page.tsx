import { Suspense } from 'react';
import { EmployeeList } from '@/components/employees/employee-list';
import { EmployeeListSkeleton } from '@/components/employees/employee-list-skeleton';
import { requireRole } from '@/lib/server/auth';
import { UserRole } from '@/types/user';

export default async function EmployeesPage() {
  // Verify user has HR role
  const session = await requireRole([UserRole.HR, UserRole.ADMIN])();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>
      </div>
      <Suspense fallback={<EmployeeListSkeleton />}>
        <EmployeeList />
      </Suspense>
    </div>
  );
} 