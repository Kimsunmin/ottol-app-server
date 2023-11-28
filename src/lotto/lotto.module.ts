import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LottoSearch } from '../lotto/entitiy/lotto-search.entity';
import { LottoResult } from '../lotto/entitiy/lotto-result.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports : [
    HttpModule,
    UtilsModule,
    ScheduleModule.forRoot(),
    //TypeOrmExModule.forCustomRepository([LottoResultRepository, LottoSearchRepository]),
    TypeOrmModule.forFeature([LottoResult, LottoSearch])
  ],
  controllers: [LottoController],
  providers: [LottoService]
})
export class LottoModule {}
