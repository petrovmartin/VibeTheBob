import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { EmployeeService } from '../../core/application/employee.service';
import { CreateEmployeeDto } from '../contracts/create-employee.dto';
import { Employee } from '../../core/domain/employee.entity';

@Controller('employees')
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name);

  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // TODO: Get actual user ID from auth context
    const userId = 'system';
    return this.employeeService.create(createEmployeeDto, userId);
  }

  @Get()
  async findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Employee> {
    const employee = await this.employeeService.findOne(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: Partial<CreateEmployeeDto>,
  ): Promise<Employee> {
    // TODO: Get actual user ID from auth context
    const userId = 'system';
    return this.employeeService.update(id, updateEmployeeDto, userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<Employee> {
    return this.employeeService.delete(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', {
    storage: undefined, // Don't store file on disk, keep in memory
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(csv)$/)) {
        return cb(new BadRequestException('Only CSV files are allowed'), false);
      }
      if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
        return cb(new BadRequestException('Invalid file type. Only CSV files are allowed'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 // 1MB limit
    }
  }))
  async importCsv(
    @UploadedFile() file: Express.Multer.File
  ): Promise<Employee[]> {
    this.logger.log('Received file upload request');
    
    if (!file) {
      this.logger.error('No file uploaded');
      throw new BadRequestException('No file uploaded');
    }

    this.logger.debug(`Received file: ${file.originalname}, size: ${file.size} bytes, mimetype: ${file.mimetype}`);
    
    if (!file.buffer || file.buffer.length === 0) {
      this.logger.error('File buffer is empty');
      throw new BadRequestException('File buffer is empty');
    }
    
    // TODO: Get actual user ID from auth context
    const userId = 'system';
    
    try {
      const result = await this.employeeService.importFromCsv(file.buffer, userId);
      this.logger.log(`Successfully imported ${result.length} employees`);
      return result;
    } catch (error) {
      this.logger.error('Error importing CSV:', error);
      throw error;
    }
  }
}