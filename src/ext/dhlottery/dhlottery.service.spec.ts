import { Test, TestingModule } from '@nestjs/testing';
import { DhlotteryService } from './dhlottery.service';

describe('DhlotteryService', () => {
  let service: DhlotteryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DhlotteryService],
    }).compile();

    service = module.get<DhlotteryService>(DhlotteryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
