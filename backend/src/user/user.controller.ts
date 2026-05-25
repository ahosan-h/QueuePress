import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ClerkAuthGuard } from 'src/auth/auth.guard';
import type { AuthRequest } from 'src/auth/interfaces/auth-request.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //sync user
  @Post('sync')
  @UseGuards(ClerkAuthGuard)
  async syncUser(@Req() req: AuthRequest) {
    return this.userService.createUser({
      clerkId: req.user.clerkId,

      email: req.user.email,

      username: '',
      imageUrl: '',
    });
  }

  //get profile
  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async me(@Req() req: AuthRequest) {
    return this.userService.getProfile(req.user.clerkId);
  }
}
