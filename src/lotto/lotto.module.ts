import { Module } from '@nestjs/common';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [
    HttpModule
  ],
  controllers: [LottoController],
  providers: [LottoService]
})
export class LottoModule {}
