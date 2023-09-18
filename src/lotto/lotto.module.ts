import { Module } from '@nestjs/common';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmExModule } from 'src/typeorm/typeorm-ex.module';
import { LottoRepository } from './lotto.repository';

@Module({
  imports : [
    HttpModule,
    TypeOrmExModule.forCustomRepository([LottoRepository]),
  ],
  controllers: [LottoController],
  providers: [LottoService]
})
export class LottoModule {}
