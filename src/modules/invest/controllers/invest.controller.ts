import { Controller, Post, Body, Get, UseGuards, UsePipes, Patch, Request, ValidationPipe, Param, Query } from '@nestjs/common';
import { InvestService } from '../services/invest.service';
import { CreateInvestDto } from '../dtos/create-invest.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiHeader, ApiOperation, ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import { Invest } from '../models/invest.schema';

@ApiExtraModels(Invest)

@ApiTags('invest')
@Controller('api/invest')
export class InvestController {
  constructor(private readonly investService: InvestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  @ApiHeader({ name: 'Authorization', description: 'Token JWT para autenticação'})
  @ApiOperation({ summary: 'Cadastra um investimento' })
  @ApiResponse({
    status: 201, 
    description: 'Retorna o investimento criado', 
    example: {
      owner: "Thiago",
      user_id: "66a5a20319c044c9acc4b65e",
      create_date: 1687921200000,
      initial_value: 1500,
      earnings: [ { value: 96.32390807183697, reference: "JUN/2024", _id: "66a6b713fcbda3bd8ee4a31a" }, { value: 104.6247923938106, reference: "JUL/2024", _id: "66a6b713fcbda3bd8ee4a31b" } ], active: true, _id: "66a6b713fcbda3bd8ee4a30e", __v: 0
    }
  })
  @ApiResponse({ status: 401, description: 'Erro, o usuário não esta logado'})
  create(@Request() req, @Body() createInvestDto: CreateInvestDto) {
    return this.investService.create(createInvestDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Recupera uma lista com todos os investimentos do usuário' })
  @ApiHeader({ name: 'Authorization', description: 'Token JWT para autenticação'})
  @ApiResponse({ status: 200, description: 'Retorna uma lista com os investimentos do usuário', example: [{ _id: "66a6a5c92f439a4f06b4493f", owner: "Thiago Marciel F. Silva", user_id: "66a5a20319c044c9acc4b65e", create_date: 1722197449107, initial_value: 100, __v: 0 }] })
  @ApiResponse({ status: 401, description: 'Erro, o usuário não esta logado'})
  @ApiQuery({ name: 'page', description: 'A pagina que será retornada', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'O numero de registros por pagina', required: false, type: Number })
  @ApiQuery({ name: 'active', description: 'Filtrar para receber só investimentos ativos ou não', required: false, type: Boolean })
  findAll(
    @Request() req, 
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('active') active?: string
  ) {
    const activeBoolean = active == 'true' ? true : active == 'false' ? false : null
    const options: { page: number, limit: number, active?: boolean | null } = { page: parseInt(page), limit: parseInt(limit), active: activeBoolean}

    return this.investService.findAll(req.user.userId, options);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Recupera uma investimento do usuário' })
  @ApiHeader({ name: 'Authorization', description: 'Token JWT para autenticação'})
  @ApiResponse({ status: 200, description: 'Retorna uma investimento do usuário', example: { _id: "66a6a5c92f439a4f06b4493f", owner: "Thiago Marciel F. Silva", user_id: "66a5a20319c044c9acc4b65e", create_date: 1722197449107, initial_value: 100, __v: 0 } })
  @ApiResponse({ status: 401, description: 'Erro, o usuário não esta logado'})
  findOne(@Param('id') id: string, @Request() req) {
    return this.investService.findById(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove o investimento do usuário', description: 'É calculado o valor total investido + rendimento, calculado o total de tributos e o valor total de retirada, o investimento não é excluído e sim desativado' })
  @ApiHeader({ name: 'Authorization', description: 'Token JWT para autenticação'})
  @ApiResponse({ status: 200, description: 'Remove um investimento do usuário' })
  @ApiResponse({ status: 401, description: 'Erro, o usuário não esta logado'})
  update(@Param('id') id: string, @Request() req) {
    return this.investService.retreat(id, req.user.userId);
  }
}
