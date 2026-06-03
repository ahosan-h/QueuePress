import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BlogPublishService } from './blog-publish.service';
import { BlogPublishProcessor } from './blog-publish.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'publish',
    }),
  ],
  providers: [BlogPublishService, BlogPublishProcessor],
  exports: [BlogPublishService],
})
export class QueueModule {}
