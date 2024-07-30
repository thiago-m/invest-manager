import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiOperation, ApiHeader, ApiResponse, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { User } from '../models/user.schema';

@ApiExtraModels(User)

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiResponse({ status: 201, description: 'Retorna o id e username do usuário', example: {_id: "66a7a98fcfb6c4ec342286ab", username: "test"} })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Recupera dados do usuário logado' })
  @ApiHeader({ name: 'Authorization', description: 'Token JWT para autenticação'})
  @ApiResponse({ status: 200, description: 'Retorna o id e username do usuário', example: {id: "66a7a98fcfb6c4ec342286ab", username: "test"} })
  @ApiResponse({ status: 401, description: 'Erro por não estar logado'})
  async getProfile(@Request() req) {
    return await this.userService.findOne(req.user.userId);
  }
}