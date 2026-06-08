import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogPublishGateway } from './blog-publish.gateway';
import { BlogPublishService } from './blog-publish.service';
import { BlogPublishProcessor } from './blog-publish.processor';

import { Blog, BlogSchema } from 'src/blogs/schema/blogs.schema';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'publish',
    }),

    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  providers: [BlogPublishService, BlogPublishProcessor, BlogPublishGateway],
  exports: [BlogPublishService, BlogPublishGateway],
})
export class QueueModule {}
