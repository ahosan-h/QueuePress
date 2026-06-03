import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class BlogPublishService {
  constructor(
    @InjectQueue('publish')
    private readonly publishQueue: Queue,
  ) {}

  async schedulePost(blogId: string, scheduleAt: Date) {
    const delay = new Date(scheduleAt).getTime() - Date.now();

    return this.publishQueue.add('publish-blog', { blogId }, { delay });
  }
}
