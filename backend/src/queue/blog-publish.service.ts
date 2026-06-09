import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class BlogPublishService {
  constructor(
    @InjectQueue('publish')
    private readonly publishQueue: Queue,
  ) {}

  async schedulePost(blogId: string, scheduleAt: Date | string) {
    const publishAt =
      typeof scheduleAt === 'string' ? new Date(scheduleAt) : scheduleAt;
    const delay = Math.max(0, publishAt.getTime() - Date.now());

    return this.publishQueue.add('publish-blog', { blogId }, { delay });
  }
}
