import { Test, TestingModule } from '@nestjs/testing';
import { CalculeService } from '../../modules/invest/services/calcule.service'; 
import { Invest } from '../../modules/invest/models/invest.schema';

describe('CalculeService', () => {
  let service: CalculeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculeService],
    }).compile();

    service = module.get<CalculeService>(CalculeService);
  });

  describe('calcEarnings', () => {
    it('should calculate earnings correctly', () => {
      const investment = { create_date: new Date(2023, 0, 1).valueOf(), initial_value: 1000 };
      const earnings = service.calcEarnings(investment);

      expect(earnings.length).toBeGreaterThan(0);
      expect(earnings[0].value).toBeCloseTo(5.2, 2); // First month earnings
    });
  });

  describe('getTaxation', () => {
    it('should calculate taxation correctly for more than 2 years', () => {
      const investment: Invest = {
        create_date: new Date(2020, 0, 1).valueOf(),
        earnings: [{ reference: 'JAN/2021', value: 100 }, { reference: 'FEB/2021', value: 200 }],
      } as any;

      const taxation = service.getTaxation(investment);

      expect(taxation.percentage).toBe(15);
      expect(taxation.value).toBeCloseTo(45, 2);
    });

    it('should calculate taxation correctly for more than 1 year but less than 2 years', () => {
      const investment: Invest = {
        create_date: new Date(2022, 7, 1).valueOf(),
        earnings: [{ reference: 'JAN/2023', value: 100 }, { reference: 'FEB/2023', value: 200 }],
      } as any;

      const taxation = service.getTaxation(investment);

      expect(taxation.percentage).toBe(18.5);
      expect(taxation.value).toBeCloseTo(55.5, 2);
    });

    it('should calculate taxation correctly for less than 1 year', () => {
      const investment: Invest = {
        create_date: new Date(2023, 9, 1).valueOf(),
        earnings: [{ reference: 'JAN/2024', value: 100 }, { reference: 'FEB/2024', value: 200 }],
      } as any;

      const taxation = service.getTaxation(investment);

      expect(taxation.percentage).toBe(22.5);
      expect(taxation.value).toBeCloseTo(67.5, 2);
    });
  });

  describe('calcDiffMonth', () => {
    it('should calculate difference in months correctly', () => {
      const start = new Date(2023, 0, 1).valueOf();
      const end = new Date(2024, 0, 1).valueOf();

      const diff = service.calcDiffMonth(start, end);

      expect(diff).toBe(12);
    });
  });

  describe('calcDiffYears', () => {
    it('should calculate difference in years correctly', () => {
      const start = new Date(2020, 0, 1).valueOf();
      const end = new Date(2024, 0, 1).valueOf();

      const diff = service.calcDiffYears(start, end);

      expect(diff).toBeCloseTo(4, 2);
    });
  });

  describe('getMonthsRef', () => {
    it('should generate month references correctly', () => {
      const endDate = new Date(2023, 0, 1).valueOf();
      const numberOfMonths = 6;

      const monthsRef = service.getMonthsRef(endDate, numberOfMonths);

      expect(monthsRef).toEqual([
        "FEV/2024",
        "MAR/2024",
        "ABR/2024",
        "MAI/2024",
        "JUN/2024",
        "JUL/2024",
      ]);
    });
  });
});
