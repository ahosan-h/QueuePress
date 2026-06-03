import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schema/blogs.schema';
import { Model, UpdateQuery } from 'mongoose';
import { CreateBlogDto } from './dto/create-blogs.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import slugify from 'slugify';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,
  ) {}

  async create(userId: string, dto: CreateBlogDto) {
    const readingTime = Math.ceil(dto.content.trim().split(/\s+/).length / 200);

    const slug = slugify(dto.title, {
      lower: true,
      strict: true,
    });

    return this.blogModel.create({
      ...dto,
      slug,
      userId,
      readingTime,
      status: dto.scheduledAt ? 'scheduled' : 'draft',
    });
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
    return this.blogModel.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      updateData,
      {
        new: true,
      },
    );
  }
  async remove(id: string, userId: string) {
    return this.blogModel.findOneAndDelete({
      _id: id,
      userId,
    });
  }
}
