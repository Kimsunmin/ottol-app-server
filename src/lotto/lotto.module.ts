import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LottoSearchHisoryEntity } from '@/lotto/lotto-search-history.entity';
import { LottoTaskService } from '@/lotto/lotto.task.service';
import { LottoDrawInfoEntity } from '@/lotto/lotto-draw-info.entity';
import { LottoDrawResultEntity } from '@/lotto/lotto-draw-result.entity';
import { LottoSearchEntity } from '@/lotto/lotto-search.entity';
import { DhlotteryModule } from '@/ext/dhlottery/dhlottery.module';

@Module({
  imports: [
    HttpModule,
    DhlotteryModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      LottoSearchEntity,
      LottoSearchHisoryEntity,
      LottoDrawInfoEntity,
      LottoDrawResultEntity,
    ]),
  ],
  controllers: [LottoController],
  providers: [LottoService, LottoTaskService],
  exports: [LottoService, LottoTaskService],
})
export class LottoModule {}
