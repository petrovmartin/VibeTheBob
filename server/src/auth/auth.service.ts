import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateEmployee(email: string, password: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return employee;
  }

  async login(email: string, password: string) {
    const employee = await this.validateEmployee(email, password);
    
    // Generate CSRF token
    const csrfToken = randomBytes(32).toString('hex');
    
    // Update employee's CSRF token and last login
    await this.prisma.employee.update({
      where: { id: employee.id },
      data: {
        csrfToken,
        lastLogin: new Date(),
      },
    });

    // Create access token
    const accessToken = this.jwtService.sign({
      sub: employee.id,
      email: employee.email,
      isAdmin: employee.isAdmin,
    });

    // Create refresh token with longer expiry
    const refreshToken = this.jwtService.sign(
      {
        sub: employee.id,
        type: 'refresh',
      },
      { expiresIn: '7d' }, // Refresh token expires in 7 days
    );

    return {
      accessToken,
      refreshToken,
      csrfToken,
      employee: {
        id: employee.id,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        isAdmin: employee.isAdmin,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const employee = await this.prisma.employee.findUnique({
        where: { id: payload.sub },
      });

      if (!employee) {
        throw new UnauthorizedException('Employee not found');
      }

      // Create new access token
      const accessToken = this.jwtService.sign({
        sub: employee.id,
        email: employee.email,
        isAdmin: employee.isAdmin,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
} 