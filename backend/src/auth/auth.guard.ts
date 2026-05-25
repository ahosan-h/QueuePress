import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
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
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      request.user = {
        clerkId: sessionClaim.sub,

        email: typeof sessionClaim.email === 'string' ? sessionClaim.email : '',
      };

      return true;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Invalid token');
    }
  }
}
