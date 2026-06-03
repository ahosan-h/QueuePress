import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [MongooseModule, BlogsService],
})
export class BlogsModule {}
