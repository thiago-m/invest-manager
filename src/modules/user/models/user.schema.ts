import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  @ApiProperty({ description: 'username do usuário' })
  username: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'password do usuário' })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
