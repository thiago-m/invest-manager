import 'dayjs/locale/pt-br'
import * as dayjs from 'dayjs'
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InvestRepository } from '../invest.repository';
import { CalculeService } from './calcule.service';

dayjs.locale('pt-br')

@Injectable()
export class MonthlyIncome {
  constructor(private readonly investRepository: InvestRepository, private readonly calculeService: CalculeService) {}

  @Cron('0 0 * * *')
  async handleCron() {
    const investments = await this.investRepository.getByNumberOfDay(new Date());

    const investmentsToReceives = investments
      .filter(
        investment => !investment.earnings.find(earning => earning.reference === dayjs().format('MMM/YYYY').toUpperCase()) 
      )

    for(const investmentToReceive of investmentsToReceives) {
      const earnings = this.calculeService.calcEarnings(investmentToReceive)
      await this.investRepository.updateOne(investmentToReceive._id, {earnings})
    }
  }
}