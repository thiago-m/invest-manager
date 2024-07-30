import { Injectable } from '@nestjs/common';
import { Invest } from '../models/invest.schema';

@Injectable()
export class CalculeService {
  calcEarnings(investment: {create_date: number, initial_value: number}) {
    const monthsOfEarnings = this.calcDiffMonth(investment.create_date, Date.now())
    const monthsEarnings = this.getMonthsRef(investment.create_date, monthsOfEarnings)

    const earnings = []
    const monthlyGainPercentage = 0.52
    let value = investment.initial_value
    
    for(const reference of monthsEarnings){
        value += value * monthlyGainPercentage/100
        earnings.push({ reference, value: value - investment.initial_value })
    }

    return earnings
  }

  getTaxation(investment: Invest) {
    const taxation = { percentage: null, value: null };
    const earnings = investment.earnings.reduce((acc, earning) => acc+=earning.value, 0);
    
    const investCreateDate = new Date(investment.create_date).valueOf();
    const diffInYears  = this.calcDiffYears(investCreateDate, Date.now());
    
    if (diffInYears > 2) taxation.percentage = 15;
    else if (diffInYears > 1) taxation.percentage = 18.5;
    else taxation.percentage = 22.5;
    
    taxation.value = earnings * taxation.percentage / 100;

    return taxation;
  } 

  calcDiffMonth(dateStart: number, dateEnd: number) {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    const yearDifferenceInMonths = (endYear - startYear) * 12;
    const monthDifference = endMonth - startMonth;

    const totalMonthDifference = yearDifferenceInMonths + monthDifference;

    return totalMonthDifference;
  }

  calcDiffYears(dateStart: number, dateEnd: number) {
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;

    const diffInMilliseconds = dateEnd - dateStart;
    const diffInYears  = diffInMilliseconds / millisecondsPerYear;

    return diffInYears
  }

  getMonthsRef(endDate: number, numberOfMonths: number) {
    const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const now = new Date();
    const end = new Date(endDate);
    let result = [];

    let date = now;
    if(end > now) date.setMonth(date.getMonth() - 1);

    for (let i = 0; i < numberOfMonths; i++) {
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        result.push(`${monthNames[currentMonth]}/${currentYear}`);
        date.setMonth(date.getMonth() - 1);
    }
    return result.reverse();
  }
}