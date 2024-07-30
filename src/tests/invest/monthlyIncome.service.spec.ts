import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyIncome } from '../../modules/invest/services/monthlyIncome.service'; 
import { InvestRepository } from '../../modules/invest/invest.repository'; 
import { CalculeService } from '../../modules/invest/services/calcule.service';
import * as dayjs from 'dayjs';

describe('MonthlyIncome', () => {
  let service: MonthlyIncome;
  let investRepository: InvestRepository;
  let calculeService: CalculeService;

  const mockInvestRepository = () => ({
    getByNumberOfDay: jest.fn(),
    updateOne: jest.fn(),
  });

  const mockCalculeService = () => ({
    calcEarnings: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonthlyIncome,
        { provide: InvestRepository, useFactory: mockInvestRepository },
        { provide: CalculeService, useFactory: mockCalculeService },
      ],
    }).compile();

    service = module.get<MonthlyIncome>(MonthlyIncome);
    investRepository = module.get<InvestRepository>(InvestRepository);
    calculeService = module.get<CalculeService>(CalculeService);
  });

  describe('handleCron', () => {
    it('should update investments with earnings for the current month', async () => {
      const investments = [
        { _id: '1', earnings: [{ reference: 'JUL/2024' }] },
        { _id: '2', earnings: [] },
        { _id: '3', earnings: [{ reference: 'JUN/2024' }] }
      ];
  
      const earnings = [{ value: 100 }];
  
      jest.spyOn(investRepository, 'getByNumberOfDay').mockResolvedValue(investments);
      jest.spyOn(calculeService, 'calcEarnings').mockReturnValue(earnings);
      jest.spyOn(investRepository, 'updateOne').mockResolvedValue({});

  
      await service.handleCron();

      expect(calculeService.calcEarnings).toHaveBeenCalledWith(investments[1]);
      expect(investRepository.updateOne).toHaveBeenCalledWith(investments[1]._id, { earnings });
      expect(investRepository.updateOne).not.toHaveBeenCalledWith(investments[0]._id);
      expect(investRepository.updateOne).not.toHaveBeenCalledWith(investments[2]._id);
    });
  
    it('should not update any investments if none need updates', async () => {
      const investments = [
        { _id: '1', earnings: [{ reference: 'JUL/2024' }] },
        { _id: '2', earnings: [{ reference: 'JUL/2024' }] },
      ];
  
      jest.spyOn(investRepository, 'getByNumberOfDay').mockResolvedValue(investments);
      jest.spyOn(calculeService, 'calcEarnings').mockReturnValue([]);
      jest.spyOn(investRepository, 'updateOne').mockResolvedValue({});

      await service.handleCron();
  
      expect(calculeService.calcEarnings).not.toHaveBeenCalled();
      expect(investRepository.updateOne).not.toHaveBeenCalled();
    });
  });
});