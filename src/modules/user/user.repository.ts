import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<Object> {
    const { password, ...userDtoWithoutPassword } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...userDtoWithoutPassword,
      password: hashedPassword,
    });
    const newUser = await createdUser.save();

    return {_id: newUser._id, username: newUser.username}
  }

  async getUsername(userId: string): Promise<Object | undefined> {
    const { username } = await this.findById(userId);
    return username
  }
  async findById(userId: string): Promise<User | undefined> {
    return await this.userModel.findById(userId).exec();
  }
  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }
}