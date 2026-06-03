import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { Blog } from 'src/blogs/schema/blogs.schema';

interface PublishBlogJobData {
  blogId: string;
}

@Processor('publish')
export class BlogPublishProcessor extends WorkerHost {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,
  ) {
    super();
  }

  async process(job: Job<PublishBlogJobData>) {
    const { blogId } = job.data;

    await this.blogModel.findByIdAndUpdate(blogId, {
      status: 'published',
    });

    console.log(`Blog ${blogId} published successfully`);
  }
}
