import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop()
  summary?: string;

  @Prop({ type: [String], default: [] })
  keywords!: string[];

  @Prop()
  readingTime?: number;

  @Prop({
    enum: ['draft', 'scheduled', 'published'],
    default: 'draft',
  })
  status!: 'draft' | 'scheduled' | 'published';

  @Prop()
  scheduledAt?: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
