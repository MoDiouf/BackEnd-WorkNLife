import { Test, TestingModule } from '@nestjs/testing';
import { LoisirController } from './loisir.controller';

describe('LoisirController', () => {
  let controller: LoisirController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoisirController],
    }).compile();

    controller = module.get<LoisirController>(LoisirController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
