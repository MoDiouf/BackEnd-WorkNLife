import { Test, TestingModule } from '@nestjs/testing';
import { LoisirService } from './loisir.service';

describe('LoisirService', () => {
  let service: LoisirService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoisirService],
    }).compile();

    service = module.get<LoisirService>(LoisirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
