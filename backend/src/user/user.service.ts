import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  //for get the existing user
  async findByClerkId(clerkId: string) {
    return this.userModel.findOne({
      clerkId,
    });
  }

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.findByClerkId(dto.clerkId);

    if (existingUser) {
      return existingUser;
    }

    return this.userModel.create(dto);
  }

  async getProfile(clerkId: string) {
    return this.findByClerkId(clerkId);
  }
}
