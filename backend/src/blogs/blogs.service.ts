import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schema/blogs.schema';
import { Model, UpdateQuery } from 'mongoose';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import slugify from 'slugify';

import { BlogPublishService } from 'src/queue/blog-publish.service';
import { BlogPublishGateway } from 'src/queue/blog-publish.gateway';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,

    private readonly blogPublishService: BlogPublishService,

    private readonly blogPublishGateway: BlogPublishGateway,
  ) {}

  async create(userId: string, dto: CreateBlogDto) {
    const readingTime = Math.ceil(dto.content.trim().split(/\s+/).length / 200);

    const baseSlug = slugify(dto.title, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;

    const existing = await this.blogModel.findOne({ slug });

    if (existing) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const blog = await this.blogModel.create({
      ...dto,
      slug,
      userId,
      readingTime,
      status: dto.scheduledAt ? 'scheduled' : 'draft',
    });

    if (dto.scheduledAt) {
      await this.blogPublishService.schedulePost(
        String(blog._id),
        dto.scheduledAt,
      );
    }

    this.blogPublishGateway.emitBlogUpdated(
      blog.toObject ? blog.toObject() : blog,
    );

    return blog;
  }

  async findAll(userId: string) {
    return this.blogModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findOne(id: string, userId: string) {
    return this.blogModel.findOne({
      _id: id,
      userId,
    });
  }

  async update(id: string, userId: string, dto: UpdateBlogDto) {
    const updateData: UpdateQuery<Blog> = { ...dto };

    if (dto.content) {
      updateData.readingTime = Math.ceil(
        dto.content.trim().split(/\s+/).length / 200,
      );
    }

    if (dto.scheduledAt) {
      updateData.status = 'scheduled';
    }

    const blog = await this.blogModel.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      updateData,
      {
        new: true,
      },
    );

    if (!blog) {
      return null;
    }

    if (dto.scheduledAt) {
      await this.blogPublishService.schedulePost(
        String(blog._id),
        dto.scheduledAt,
      );
    }

    this.blogPublishGateway.emitBlogUpdated(
      blog.toObject ? blog.toObject() : blog,
    );

    return blog;
  }

  async remove(id: string, userId: string) {
    return this.blogModel.findOneAndDelete({
      _id: id,
      userId,
    });
  }
}
