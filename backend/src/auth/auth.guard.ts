import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      if (request.method === 'OPTIONS') {
        return true;
      }

      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Unauthorized');
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }

      const sessionClaim = await verifyToken(token, {
        secretKey: this.configService.getOrThrow<string>('CLERK_SECRET_KEY'),
        clockSkewInMs: 40000, // 40-second tolerance
      });

      request.user = {
        clerkId: sessionClaim.sub,
        email: typeof sessionClaim.email === 'string' ? sessionClaim.email : '',
      };

      return true;
    } catch (error) {
      console.error(error);

      throw new UnauthorizedException('Invalid token');
    }
  }
}
