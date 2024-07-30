import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'O username do usuário' })
  readonly username: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'A senha do usuário' })
  readonly password: string;
}