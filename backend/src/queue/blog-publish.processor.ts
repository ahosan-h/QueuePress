import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { Blog } from 'src/blogs/schema/blogs.schema';
import { BlogPublishGateway } from './blog-publish.gateway';

interface PublishBlogJobData {
  blogId: string;
}

@Processor('publish')
export class BlogPublishProcessor extends WorkerHost {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,
    private readonly blogPublishGateway: BlogPublishGateway,
  ) {
    super();
    console.log('BlogPublishProcessor loaded');
  }

  async process(job: Job<PublishBlogJobData>) {
    const { blogId } = job.data;

    const blog = await this.blogModel.findByIdAndUpdate(
      blogId,
      {
        status: 'published',
      },
      { new: true },
    );

    if (!blog) {
      console.warn(`Blog ${blogId} was not found for publishing`);
      return;
    }

    const payload = blog.toObject ? blog.toObject() : blog;
    this.blogPublishGateway.emitBlogPublished(payload);

    console.log(`Blog ${blogId} published successfully`);
  }
}
