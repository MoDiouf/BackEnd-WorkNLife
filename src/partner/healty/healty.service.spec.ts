import { Test, TestingModule } from '@nestjs/testing';
import { HealtyService } from './healty.service';

describe('HealtyService', () => {
  let service: HealtyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealtyService],
    }).compile();

    service = module.get<HealtyService>(HealtyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
