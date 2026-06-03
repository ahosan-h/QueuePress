import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BlogPublishService } from './blog-publish.service';
import { BlogPublishProcessor } from './blog-publish.processor';
import { BlogsModule } from 'src/blogs/blogs.module';

@Module({
  imports: [
    BlogsModule,
    BullModule.registerQueue({
      name: 'publish',
    }),
  ],
  providers: [BlogPublishService, BlogPublishProcessor],
  exports: [BlogPublishService],
})
export class QueueModule {}
