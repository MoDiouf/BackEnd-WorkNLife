import { Module } from '@nestjs/common';
import { CarpoolService } from './carpool.service';

@Module({
  providers: [CarpoolService]
})
export class CarpoolModule {}
