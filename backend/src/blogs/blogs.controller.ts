import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blogs.dto';
import type { AuthRequest } from 'src/auth/interfaces/auth-request.interface';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ClerkAuthGuard } from 'src/auth/auth.guard';

@Controller('blogs')
@UseGuards(ClerkAuthGuard)
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Post()
  create(@Body() dto: CreateBlogDto, @Req() req: AuthRequest) {
    return this.blogService.create(req.user.clerkId, dto);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.blogService.findAll(req.user.clerkId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.blogService.findOne(id, req.user.clerkId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @Req() req: AuthRequest,
  ) {
    return this.blogService.update(id, req.user.clerkId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.blogService.remove(id, req.user.clerkId);
  }
}
