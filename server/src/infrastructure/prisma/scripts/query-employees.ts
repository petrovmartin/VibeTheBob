import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const employees = await prisma.employee.findMany();
    
    console.log('Total employees found:', employees.length);
    console.log('Employees:', JSON.stringify(employees, null, 2));
  } catch (error) {
    console.error('Error querying employees:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 