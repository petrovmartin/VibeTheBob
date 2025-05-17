import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyEmpty() {
  try {
    const count = await prisma.employee.count();
    console.log(`Current number of employees in database: ${count}`);
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyEmpty(); 