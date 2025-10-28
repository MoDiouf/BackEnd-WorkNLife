import { Test, TestingModule } from '@nestjs/testing';
import { HealtyController } from './healty.controller';

describe('HealtyController', () => {
  let controller: HealtyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealtyController],
    }).compile();

    controller = module.get<HealtyController>(HealtyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
