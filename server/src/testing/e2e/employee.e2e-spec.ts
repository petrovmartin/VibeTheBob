/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { CreateEmployeeDto } from '../src/presentation/contracts/create-employee.dto';
import { AuthService } from '../src/auth/auth.service';
import { Prisma } from '@prisma/client';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
  });

  afterEach(async () => {
    await prismaService.employee.deleteMany();
    await app.close();
  });

  it('/employees (POST)', async () => {
    const employee: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      email: 'john@example.com',
      position: 'Developer',
      address: '123 Main St',
      site: 'HQ',
      department: 'Engineering',
      startDate: new Date(),
      isAdmin: false,
      middleName: null,
      endDate: null,
      picture: null,
      managerEmail: null
    };

    const response = await request(app.getHttpServer())
      .post('/employees')
      .send(employee)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe(employee.firstName);
    expect(response.body.lastName).toBe(employee.lastName);
    expect(response.body.email).toBe(employee.email);
  });

  it('/employees (GET)', async () => {
    const hashedPassword = await authService.hashPassword('testpass123');
    const employeeData: Prisma.EmployeeCreateInput = {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      email: 'john@example.com',
      position: 'Developer',
      address: '123 Main St',
      site: 'HQ',
      department: 'Engineering',
      startDate: new Date(),
      createdBy: 'system',
      updatedBy: 'system',
      password: hashedPassword,
      isAdmin: false
    };

    const employee = await prismaService.employee.create({
      data: employeeData,
    });

    const response = await request(app.getHttpServer())
      .get('/employees')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(employee.id);
    expect(response.body[0]).not.toHaveProperty('password');
  });
}); 