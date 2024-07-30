import { Injectable } from '@nestjs/common';
import { User } from '../models/user.schema';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<Object> {
    return await this.userRepository.create(createUserDto);
  }
  async findOne(id: string): Promise<Object | undefined> {
    const username = await this.userRepository.getUsername(id);
    return { id, username }
  }
  async findByUsernameWithPassword(userId: string): Promise<User | undefined> {
    return await this.userRepository.findOneByUsername(userId);
  }
}