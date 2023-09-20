import { Module } from '@nestjs/common';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmExModule } from 'src/db/typeorm/typeorm-ex.module';
import { LottoRepository, LottoResultRepository } from './lotto.repository';

@Module({
  imports : [
    HttpModule,
    TypeOrmExModule.forCustomRepository([LottoRepository, LottoResultRepository]),
  ],
  controllers: [LottoController],
  providers: [LottoService]
})
export class LottoModule {}
