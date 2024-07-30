import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invest } from './models/invest.schema';

@Injectable()
export class InvestRepository {
  constructor(@InjectModel('Invest') private readonly investModel: Model<Invest>) {}

  async create(createInvest: object): Promise<Invest> {
    const createdInvest = new this.investModel(createInvest)
    return await createdInvest.save()
  }
  async getAll(user_id: string, options: { page?: number, limit?: number, active?: boolean } = {}) {
    let investments: any
    const query: {user_id: string, active?: boolean} = { user_id }

    if(options.active !== null) query.active = options.active

    if(options.limit) {
      if(!options.page) options.page = 1
      investments = {
        itens: await this.investModel.find(query).skip((options.page - 1) * options.limit).limit(options.limit).exec(),
        total: await this.investModel.countDocuments(query).exec(),
        pageNum: options.page,
        limitByPage: options.limit
      }
      if(query.active) investments.filters = { active: query.active }
    } else investments = await this.investModel.find(query).exec()
    
    return investments
  }
  async findById(_id: string, user_id: string): Promise<Invest | undefined> {
    return await this.investModel.findById(_id).where({user_id}).exec();
  }
  async updateOne(_id: string, updateInvestDto: object): Promise<Object | undefined> {
    return await this.investModel.updateOne({_id}, updateInvestDto).exec() 
  }
  async getByNumberOfDay(date: Date){
    return await this.investModel.aggregate([
      {
        $addFields: {
          dateObject: { $toDate: "$create_date" },
          day: { $dayOfMonth: { $toDate: "$create_date" } },
          month: { $month: { $toDate: "$create_date" } },
        },
      },
      {
        $match: {
          day: date.getDate(),
          active: true
        },
      }
    ]);
  }
}