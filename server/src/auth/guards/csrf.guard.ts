import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const csrfToken = request.headers['x-csrf-token'];
    const accessToken = request.cookies?.accessToken;

    if (!csrfToken || !accessToken) {
      throw new UnauthorizedException('Missing CSRF token or access token');
    }

    try {
      const payload = await this.authService.validateToken(accessToken);
      const employee = await this.prisma.employee.findUnique({
        where: { id: payload.sub },
      });

      if (!employee || employee.csrfToken !== csrfToken) {
        throw new UnauthorizedException('Invalid CSRF token');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 