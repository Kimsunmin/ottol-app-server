import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LottoSearchEntity } from './lotto-search.entity';
import { LottoResultEntity } from './lotto-result.entity';
import { LottoSearchHisoryEntity } from '@/lotto/lotto-search-history.entity';
import { LottoTaskService } from '@/lotto/lotto.task.service';
import { LottoMasterEntity } from '@/lotto/lotto-master.entity';
import { LottoDetailEntity } from '@/lotto/lotto-detail.entity';
import { LottoSearchNewEntity } from '@/lotto/lotto-search-new.entity';
import { DhlotteryModule } from '@/ext/dhlottery/dhlottery.module';

@Module({
  imports: [
    HttpModule,
    DhlotteryModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      LottoResultEntity,
      LottoSearchEntity,
      LottoSearchHisoryEntity,
      LottoMasterEntity,
      LottoDetailEntity,
      LottoSearchNewEntity,
    ]),
  ],
  controllers: [LottoController],
  providers: [LottoService, LottoTaskService],
  exports: [LottoService, LottoTaskService],
})
export class LottoModule {}
