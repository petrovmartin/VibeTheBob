import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { EmployeeService } from './core/application/employee.service';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MulterModule.register({
      storage: undefined,
    }),
    AuthModule,
  ],
  controllers: [EmployeeController],
  providers: [PrismaService, EmployeeService],
})
export class AppModule {}
