import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  clerkId!: string;

  @Prop({ required: true })
  email!: string;

  @Prop()
  username!: string;

  @Prop()
  imageUrl!: string;

  @Prop({
    default: 0,
  })
  totalPosts!: number;

  @Prop({ default: 0 })
  publishedPosts!: number;
}

export const UserSchma = SchemaFactory.createForClass(User);
