import { Test, TestingModule } from '@nestjs/testing';
import { CommandesController } from './commandes.controller';

describe('CommandesController', () => {
  let controller: CommandesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandesController],
    }).compile();

    controller = module.get<CommandesController>(CommandesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
