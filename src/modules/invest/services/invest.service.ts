import { Injectable } from '@nestjs/common';
import { InvestRepository } from '../invest.repository';
import { CreateInvestDto } from '../dtos/create-invest.dto';
import { CalculeService } from './calcule.service';

@Injectable()
export class InvestService {
  constructor(private readonly investRepository: InvestRepository, private readonly calculeService: CalculeService) {}

  async create(createInvestDto: CreateInvestDto, user_id: string) {
    const earnings = this.calculeService.calcEarnings(createInvestDto)

    return await this.investRepository.create({...createInvestDto, earnings, user_id})
  }

  async findAll(userId: string, optionals: { page: number, limit: number, active?: boolean | null }) {
    const investments = await this.investRepository.getAll(userId, optionals)
    return investments
  }

  async findById(id: string, userId: string) {
    return await this.investRepository.findById(id, userId)
  }
  
  async retreat(id: string, userId: string) {
    const investment = await this.findById(id, userId);

    const taxation = this.calculeService.getTaxation(investment);
    const total_value = investment.initial_value + investment.earnings.reduce((acc, earning) => acc+=earning.value, 0);
    const withdrawal_amount = total_value - taxation.value;

    await this.investRepository.updateOne(id, { taxation, withdrawal_amount, total_value, active: false }) 
  }
}