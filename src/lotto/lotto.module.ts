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

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      LottoResultEntity,
      LottoSearchEntity,
      LottoSearchHisoryEntity,
    ]),
  ],
  controllers: [LottoController],
  providers: [LottoService, LottoTaskService],
  exports: [LottoService],
})
export class LottoModule {}
