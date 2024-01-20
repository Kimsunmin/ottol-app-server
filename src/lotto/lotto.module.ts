import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LottoSearchEntity } from '../lotto/entitiy/lotto-search.entity';
import { LottoResultEntity } from '../lotto/entitiy/lotto-result.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    //TypeOrmExModule.forCustomRepository([LottoResultRepository, LottoSearchRepository]),
    TypeOrmModule.forFeature([LottoResultEntity, LottoSearchEntity]),
  ],
  controllers: [LottoController],
  providers: [LottoService],
  exports: [LottoService],
})
export class LottoModule {}
