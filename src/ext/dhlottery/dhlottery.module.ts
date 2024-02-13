import { Module } from '@nestjs/common';
import { DhlotteryService } from './dhlottery.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [DhlotteryService],
  exports: [DhlotteryService],
})
export class DhlotteryModule {}
