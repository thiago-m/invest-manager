import { Controller, Request, Post, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Fazer login do usuário' })
  @ApiResponse({ status: 201, description: 'Retorna o access_token', example: {access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."} })
  @ApiBody({ schema: { type: 'object', properties: {username: {type: 'string'}, password: { type: 'string' }}, required: ['username', 'password'] }, examples: {exemplo1: { summary: 'Dados para login', value: { username: 'test', password: '123456' } }} })
  @ApiResponse({ status: 401, description: 'Erro, usuário não existe'})
  async login(@Request() req, @Res() res: Response) {
    const loginResponse = await this.authService.login(req.user._doc);
    res.cookie('jwt', loginResponse.access_token, { httpOnly: true });
    return res.send(loginResponse);
  }
}
