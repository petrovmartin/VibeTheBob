import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();
const logger = new Logger('DatabaseSeeder');

interface EmployeeCSV {
  firstName: string;
  lastName: string;
  middleName?: string;
  displayName?: string;
  email: string;
  position?: string;
  address?: string;
  site?: string;
  managerEmail?: string;
  startDate?: string;
  endDate?: string;
  department?: string;
  picture?: string;
  isAdmin?: string;
}

export async function seed() {
  try {
    // Check if employees table is empty
    const employeeCount = await prisma.employee.count();

    if (employeeCount === 0) {
      logger.log('Database is empty. Starting seeding process...');

      // Try to find the CSV file in both source and dist directories
      const possiblePaths = [
        path.join(process.cwd(), 'src', 'infrastructure', 'prisma', 'seed', 'employees.csv'),
        path.join(process.cwd(), 'dist', 'infrastructure', 'prisma', 'seed', 'employees.csv')
      ];

      let csvPath: string | null = null;
      for (const p of possiblePaths) {
        logger.debug(`Looking for CSV file at: ${p}`);
        if (fs.existsSync(p)) {
          csvPath = p;
          logger.log(`Found CSV file at: ${p}`);
          break;
        }
      }

      if (!csvPath) {
        throw new Error(`employees.csv file not found in any of the following locations:\n${possiblePaths.join('\n')}`);
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      if (!csvContent.trim()) {
        throw new Error('CSV file is empty');
      }

      // Parse CSV content
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: true
      }) as EmployeeCSV[];

      if (!Array.isArray(records) || records.length === 0) {
        throw new Error('No valid records found in CSV');
      }

      logger.log(`Found ${records.length} records in CSV`);

      // Perform database operations in a transaction
      await prisma.$transaction(async (tx) => {
        // First pass: Create all employees without manager relationships
        const createdEmployees = [];
        const emailToId = new Map<string, string>();

        for (const record of records) {
          const { managerEmail, ...recordData } = record;
          
          // Ensure required fields have default values and proper date parsing
          const employeeData = {
            firstName: recordData.firstName,
            lastName: recordData.lastName,
            email: recordData.email.toLowerCase(),
            displayName: recordData.displayName || `${recordData.firstName} ${recordData.lastName}`,
            position: recordData.position || 'Employee',
            department: recordData.department || 'General',
            site: recordData.site || 'Main Office',
            address: recordData.address || '',
            startDate: recordData.startDate ? new Date(recordData.startDate) : new Date(),
            middleName: recordData.middleName || null,
            endDate: recordData.endDate ? new Date(recordData.endDate) : null,
            picture: recordData.picture || null,
            isAdmin: recordData.isAdmin === 'true',
            managerId: null,
            createdBy: 'system-seeder',
            updatedBy: 'system-seeder'
          };
          
          const employee = await tx.employee.create({
            data: employeeData
          });
          
          createdEmployees.push(employee);
          emailToId.set(employee.email, employee.id);
          logger.log(`Created employee: ${employee.email}`);
        }

        // Second pass: Update manager relationships
        for (const employee of createdEmployees) {
          const record = records.find(r => r.email === employee.email);
          if (record?.managerEmail) {
            const managerId = emailToId.get(record.managerEmail);
            if (managerId) {
              await tx.employee.update({
                where: { id: employee.id },
                data: { managerId }
              });
              logger.log(`Updated manager for ${employee.email} to ${record.managerEmail}`);
            } else {
              logger.warn(`Manager ${record.managerEmail} not found for employee ${employee.email}`);
            }
          }
        }

        logger.log(`Successfully created ${createdEmployees.length} employees`);
      });

    } else {
      logger.log('Database already contains employees. Skipping seeding process.');
    }
  } catch (error) {
    logger.error('Error during database seeding:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Comment out the immediate execution
// seed(); 