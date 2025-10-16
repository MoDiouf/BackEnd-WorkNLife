import { Test, TestingModule } from '@nestjs/testing';
import { CarpoolController } from './carpool.controller';

describe('CarpoolController', () => {
  let controller: CarpoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarpoolController],
    }).compile();

    controller = module.get<CarpoolController>(CarpoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
