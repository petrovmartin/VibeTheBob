/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { Prisma } from '@prisma/client';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    authService = app.get<AuthService>(AuthService);

    // Configure app the same way as in main.ts
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    });

    await app.init();
  });

  beforeEach(async () => {
    // Clean up any test data from previous runs
    await prismaService.employee.deleteMany({
      where: {
        email: 'test@example.com'
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prismaService.employee.deleteMany({
      where: {
        email: 'test@example.com'
      }
    });
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should authenticate user and return tokens in cookies', async () => {
      // Create a test user
      const testPassword = 'testPassword123';
      const hashedPassword = await authService.hashPassword(testPassword);
      
      const employeeData: Prisma.EmployeeUncheckedCreateInput = {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        position: 'Tester',
        department: 'QA',
        site: 'Main Office',
        address: '123 Test St',
        createdBy: 'system',
        updatedBy: 'system',
        startDate: new Date(),
      };

      const employee = await prismaService.employee.create({
        data: employeeData,
      });

      // Attempt to login
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: testPassword,
        })
        .expect(200);

      // Check response structure
      expect(response.body).toHaveProperty('csrfToken');
      expect(response.body).toHaveProperty('employee');
      expect(response.body.employee).toHaveProperty('id');
      expect(response.body.employee.email).toBe('test@example.com');

      // Check cookies
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies) && cookies.some(cookie => cookie.includes('accessToken'))).toBe(true);
      expect(Array.isArray(cookies) && cookies.some(cookie => cookie.includes('refreshToken'))).toBe(true);
    });

    it('should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh access token', async () => {
      // Create a test user and get tokens
      const testPassword = 'testPassword123';
      const hashedPassword = await authService.hashPassword(testPassword);
      
      const employeeData: Prisma.EmployeeUncheckedCreateInput = {
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        displayName: 'Test User',
        position: 'Tester',
        department: 'QA',
        site: 'Main Office',
        address: '123 Test St',
        createdBy: 'system',
        updatedBy: 'system',
        startDate: new Date(),
      };

      await prismaService.employee.create({
        data: employeeData,
      });

      // Login to get tokens
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: testPassword,
        });

      // Extract refresh token from cookie
      const cookies = loginResponse.headers['set-cookie'];
      const refreshToken = Array.isArray(cookies) && cookies
        .find(cookie => cookie.includes('refreshToken'))
        ?.split(';')[0]
        .split('=')[1];

      // Try to refresh the token
      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(refreshResponse.headers['set-cookie']).toBeDefined();
      const refreshCookies = refreshResponse.headers['set-cookie'];
      expect(Array.isArray(refreshCookies) && refreshCookies.some(cookie => cookie.includes('accessToken'))).toBe(true);
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear auth cookies', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(200);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies) && cookies.some(cookie => 
        cookie.includes('accessToken') && cookie.includes('Max-Age=0')
      )).toBe(true);
      expect(Array.isArray(cookies) && cookies.some(cookie => 
        cookie.includes('refreshToken') && cookie.includes('Max-Age=0')
      )).toBe(true);
    });
  });
}); 