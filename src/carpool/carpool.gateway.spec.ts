import { Test, TestingModule } from '@nestjs/testing';
import { CarpoolGateway } from './carpool.gateway';

describe('CarpoolGateway', () => {
  let gateway: CarpoolGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarpoolGateway],
    }).compile();

    gateway = module.get<CarpoolGateway>(CarpoolGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
