import { IsString, IsEmail, IsOptional, IsUUID, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName: string | null;

  @IsString()
  lastName: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  position: string;

  @IsString()
  address: string;

  @IsString()
  site: string;

  @IsEmail()
  @IsOptional()
  managerEmail: string | null;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate: Date | null;

  @IsString()
  department: string;

  @IsString()
  @IsOptional()
  picture: string | null;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
} 