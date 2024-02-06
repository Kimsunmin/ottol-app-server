import { Module } from '@nestjs/common';
import { DhlotteryService } from './dhlottery.service';

@Module({
  providers: [DhlotteryService],
})
export class DhlotteryModule {}
