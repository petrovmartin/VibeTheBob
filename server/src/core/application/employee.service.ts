import { Injectable, ConflictException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Employee } from '../domain/employee.entity';
import { CreateEmployeeDto } from '../../presentation/contracts/create-employee.dto';
import { parse } from 'csv-parse/sync';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto, userId: string): Promise<Employee> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email: createEmployeeDto.email.toLowerCase() }
    });

    if (existingEmployee) {
      throw new ConflictException(`Employee with email ${createEmployeeDto.email} already exists`);
    }

    const employeeData: Prisma.EmployeeCreateInput = {
      ...createEmployeeDto,
      email: createEmployeeDto.email.toLowerCase(),
      displayName: `${createEmployeeDto.firstName} ${createEmployeeDto.lastName}`,
      createdBy: userId,
      updatedBy: userId,
      password: 'changeme123', // Temporary password
    };

    const employee = await this.prisma.employee.create({
      data: employeeData,
    });

    return Employee.fromPrisma(employee);
  }

  async findAll(): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany();
    return employees.map(Employee.fromPrisma);
  }

  async findOne(id: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { id }
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return Employee.fromPrisma(employee);
  }

  async update(id: string, updateEmployeeDto: Partial<CreateEmployeeDto>, userId: string): Promise<Employee> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id }
    });

    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    if (updateEmployeeDto.email) {
      const emailExists = await this.prisma.employee.findFirst({
        where: {
          email: updateEmployeeDto.email.toLowerCase(),
          id: { not: id }
        }
      });

      if (emailExists) {
        throw new ConflictException(`Employee with email ${updateEmployeeDto.email} already exists`);
      }
    }

    const employeeData: Prisma.EmployeeUpdateInput = {
      ...updateEmployeeDto,
      email: updateEmployeeDto.email?.toLowerCase(),
      displayName: updateEmployeeDto.firstName && updateEmployeeDto.lastName
        ? `${updateEmployeeDto.firstName} ${updateEmployeeDto.lastName}`
        : undefined,
      updatedBy: userId,
    };

    try {
      const employee = await this.prisma.employee.update({
        where: { id },
        data: employeeData,
      });
      return Employee.fromPrisma(employee);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Employee> {
    try {
      const employee = await this.prisma.employee.delete({
        where: { id }
      });
      return Employee.fromPrisma(employee);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      throw error;
    }
  }

  // New method to find subordinates
  async findSubordinates(managerId: string): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      where: {
        managerId: managerId
      }
    });
    return employees.map(emp => Employee.fromPrisma(emp));
  }

  async importFromCsv(fileBuffer: Buffer, userId: string): Promise<Employee[]> {
    try {
      this.logger.log('Starting CSV import process');
      
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new BadRequestException('Empty file buffer received');
      }

      // Convert buffer to string and parse CSV
      const csvString = fileBuffer.toString('utf-8');
      if (!csvString.trim()) {
        throw new BadRequestException('CSV file is empty');
      }

      this.logger.log('Parsing CSV content');
      let records: any[];
      try {
        records = parse(csvString, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          cast: true // Enable automatic type casting
        });
      } catch (error) {
        this.logger.error('Failed to parse CSV:', error);
        throw new BadRequestException(`Failed to parse CSV: ${error.message}`);
      }

      if (!Array.isArray(records) || records.length === 0) {
        throw new BadRequestException('No valid records found in CSV');
      }

      this.logger.log(`Found ${records.length} records in CSV`);

      // First pass: Validate all records and collect manager emails
      const managerEmails = new Set<string>();
      const employeeDtos: CreateEmployeeDto[] = records.map((record, index) => {
        try {
          if (!record.firstName || !record.lastName || !record.email) {
            throw new BadRequestException(
              `Row ${index + 1}: Missing required fields (firstName, lastName, or email)`
            );
          }

          // Validate email format
          if (!this.isValidEmail(record.email)) {
            throw new BadRequestException(
              `Row ${index + 1}: Invalid email format for ${record.email}`
            );
          }

          // Collect manager email if present
          if (record.managerEmail && this.isValidEmail(record.managerEmail)) {
            managerEmails.add(record.managerEmail);
          }

          // Parse dates carefully
          let startDate = record.startDate ? new Date(record.startDate) : new Date();
          let endDate = record.endDate ? new Date(record.endDate) : null;

          // Validate dates
          if (startDate.toString() === 'Invalid Date') {
            this.logger.warn(`Invalid startDate for employee ${record.email}, using current date`);
            startDate = new Date();
          }
          if (record.endDate && endDate?.toString() === 'Invalid Date') {
            this.logger.warn(`Invalid endDate for employee ${record.email}, setting to null`);
            endDate = null;
          }

          return {
            firstName: record.firstName.trim(),
            lastName: record.lastName.trim(),
            middleName: record.middleName?.trim() || null,
            displayName: record.displayName?.trim() || `${record.firstName.trim()} ${record.lastName.trim()}`,
            email: record.email.toLowerCase().trim(),
            position: record.position?.trim() || 'Employee',
            address: record.address?.trim() || '',
            site: record.site?.trim() || 'Main Office',
            managerEmail: record.managerEmail?.toLowerCase().trim() || null,
            startDate,
            endDate,
            department: record.department?.trim() || 'General',
            picture: record.picture?.trim() || null,
            isAdmin: record.isAdmin === 'true'
          };
        } catch (error) {
          this.logger.error(`Error processing row ${index + 1}:`, error);
          throw new BadRequestException(`Error in row ${index + 1}: ${error.message}`);
        }
      });

      this.logger.log('Validated all records, proceeding with database transaction');

      // Perform all database operations in a single transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        // Check for existing emails (employees being imported)
        const existingEmails = await prisma.employee.findMany({
          where: {
            email: {
              in: employeeDtos.map(dto => dto.email.toLowerCase())
            }
          },
          select: {
            email: true
          }
        });

        if (existingEmails.length > 0) {
          throw new ConflictException(
            `The following emails already exist: ${existingEmails.map(e => e.email).join(', ')}`
          );
        }

        // Create all employees first without manager relationships
        this.logger.log('Creating employees in database');
        const createdEmployees = [];
        const emailToId = new Map<string, string>();
        
        for (const dto of employeeDtos) {
          try {
            this.logger.debug(`Creating employee with email: ${dto.email}`);
            const { managerEmail, ...employeeData } = dto;
            
            const employee = await prisma.employee.create({
              data: {
                ...employeeData,
                managerId: null, // Initially set to null
                createdBy: userId,
                updatedBy: userId
              }
            });
            createdEmployees.push(employee);
            emailToId.set(employee.email, employee.id);
            this.logger.log(`Successfully created employee: ${employee.email}`);
          } catch (error) {
            this.logger.error(`Failed to create employee ${dto.email}:`, error);
            throw new BadRequestException(`Failed to create employee ${dto.email}: ${error.message}`);
          }
        }

        // Update manager relationships after all employees are created
        this.logger.log('Updating manager relationships');
        for (const employee of createdEmployees) {
          const dto = employeeDtos.find(d => d.email === employee.email);
          if (dto?.managerEmail) {
            const managerId = emailToId.get(dto.managerEmail);
            if (managerId) {
              await prisma.employee.update({
                where: { id: employee.id },
                data: { managerId }
              });
              this.logger.log(`Updated manager for ${employee.email} to ${dto.managerEmail}`);
            } else {
              this.logger.warn(`Manager ${dto.managerEmail} not found for employee ${employee.email}`);
            }
          }
        }

        return createdEmployees;
      });

      this.logger.log(`Successfully created ${result.length} employees`);
      return result.map(emp => Employee.fromPrisma(emp));
    } catch (error) {
      this.logger.error('Import failed:', error);
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to import CSV: ${error.message}`);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 