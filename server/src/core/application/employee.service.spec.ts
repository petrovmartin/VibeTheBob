import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateEmployeeDto } from '../../presentation/contracts/create-employee.dto';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let prisma: PrismaService;

  const mockPrismaService = {
    employee: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const dto: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        email: 'john@example.com',
        position: 'Developer',
        address: '123 Main St',
        site: 'HQ',
        department: 'Engineering',
        startDate: new Date(),
      };

      const expectedEmployee = {
        id: '123',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user1',
        updatedBy: 'user1',
      };

      mockPrismaService.employee.create.mockResolvedValue(expectedEmployee);

      const result = await service.create(dto, 'user1');
      expect(result).toEqual(expectedEmployee);
      expect(mockPrismaService.employee.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          createdBy: 'user1',
          updatedBy: 'user1',
        },
      });
    });
  });
}); 