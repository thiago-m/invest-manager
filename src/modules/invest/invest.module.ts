import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestController } from './controllers/invest.controller';
import { InvestService } from './services/invest.service';
import { MonthlyIncome } from './services/monthlyIncome.service';
import { CalculeService } from './services/calcule.service';
import { InvestRepository } from './invest.repository';
import { Invest, InvestSchema } from './models/invest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invest.name, schema: InvestSchema }])
  ],
  controllers: [InvestController],
  providers: [InvestService, CalculeService, MonthlyIncome, InvestRepository],
  exports: [InvestService],
})
export class InvestModule {}