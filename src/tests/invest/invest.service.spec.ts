import { Test, TestingModule } from '@nestjs/testing';
import { InvestService } from '../../modules/invest/services/invest.service'; 
import { InvestRepository } from '../../modules/invest/invest.repository'; 
import { CalculeService } from '../../modules/invest/services/calcule.service';
import { CreateInvestDto } from '../../modules/invest/dtos/create-invest.dto';
import { Invest } from '../../modules/invest/models/invest.schema'; 

jest.mock('../../modules/invest/services/calcule.service');

describe('InvestService', () => {
  let service: InvestService;
  let investRepository: InvestRepository;
  let calculeService: CalculeService;

  const mockInvestRepository = () => ({
    create: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
  });

  const mockCalculeService = () => ({
    calcEarnings: jest.fn(),
    getTaxation: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestService,
        { provide: InvestRepository, useFactory: mockInvestRepository },
        { provide: CalculeService, useFactory: mockCalculeService },
      ],
    }).compile();

    service = module.get<InvestService>(InvestService);
    investRepository = module.get<InvestRepository>(InvestRepository);
    calculeService = module.get<CalculeService>(CalculeService);
  });

  describe('findAll', () => {
    it('should return investments', async () => {
      const userId = 'someUserId';
      const optionals = { page: 1, limit: 10, active: true };
      const mockInvestments = {
        itens: [],
        total: 0,
        pageNum: 1,
        limitByPage: 10,
        filters: { active: true }
      };

      jest.spyOn(investRepository, 'getAll').mockResolvedValue(mockInvestments);

      const result = await service.findAll(userId, optionals);

      expect(result).toEqual(mockInvestments);
      expect(investRepository.getAll).toHaveBeenCalledWith(userId, optionals);
    });
  });

  describe('findById', () => {
    it('should return an investment by ID', async () => {
      const id = 'investment-id';
      const userId = 'user-id';
      const investment = {
        "owner": "Thiago",
        "initial_value": 1500,
        "create_date": 1687921200000
      }

      jest.spyOn(investRepository, 'findById').mockResolvedValue(investment as any);

      const result = await service.findById(id, userId);
      expect(result).toBe(investment);
      expect(investRepository.findById).toHaveBeenCalledWith(id, userId);
    });
  });

  describe('create', () => {
    it('should create a new investment', async () => {
      const createdInvest = {
        "owner": "Thiago",
        "initial_value": 1500,
        "create_date": 1687921200000
      }
      const createInvestDto: CreateInvestDto = { ...createdInvest };
      const user_id = 'user-id';
  
      jest.spyOn(investRepository, 'create').mockResolvedValue(createdInvest as any);
  
      const result = await service.create(createInvestDto, user_id);
      expect(result).toBe(createdInvest);
      expect(calculeService.calcEarnings).toHaveBeenCalledWith(createInvestDto);
      expect(investRepository.create).toHaveBeenCalledWith({ ...createInvestDto, user_id });
    });
  });

  describe('retreat', () => {
    it('should update investment with taxation and withdrawal amount', async () => {
      const id = 'investment-id';
      const userId = 'user-id';
      const investment =  {
        "owner": "Thiago",
        "initial_value": 1500,
        "create_date": 1687921200000,
        earnings: [{ reference: 'JUL/2024', value: 2 }]
      };
      
      const taxation = { value: 50, percentage: 18 };
      const total_value = 1502;
      const withdrawal_amount = 1452;

      jest.spyOn(service, 'findById').mockResolvedValue(investment as any);
      jest.spyOn(calculeService, 'getTaxation').mockReturnValue(taxation as any);
      jest.spyOn(investRepository, 'updateOne').mockResolvedValue({});
  
      await service.retreat(id, userId);
  
      expect(service.findById).toHaveBeenCalledWith(id, userId);
      expect(calculeService.getTaxation).toHaveBeenCalledWith(investment);
      expect(investRepository.updateOne).toHaveBeenCalledWith(id, {
        taxation,
        withdrawal_amount,
        total_value,
        active: false,
      });
    });
  });

});
