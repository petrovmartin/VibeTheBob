import { Employee } from "@/types/employee";
import { DataTable } from "../ui/data-table";
import { columns } from "./columns";

async function getEmployees(): Promise<Employee[]> {
  // In a real app, this would be an API call or database query
  // This is just an example
  return [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      position: "Software Engineer",
      department: "Engineering",
      startDate: new Date("2023-01-01"),
    },
    // Add more employees...
  ];
}

export async function EmployeeList() {
  const employees = await getEmployees();

  return (
    <div className="rounded-md border">
      <DataTable columns={columns} data={employees} />
    </div>
  );
} 