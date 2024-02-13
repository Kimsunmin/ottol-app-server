import { Module } from '@nestjs/common';
import { LottoModule } from './lotto/lotto.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './database/database.module';
import { UtilsModule } from './utils/utils.module';
import { AppInitService } from '@/app-init.service';
import { DhlotteryModule } from './ext/dhlottery/dhlottery.module';
import loadConfiguration from '@/config/loadConfiguration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfiguration],
    }),
    UtilsModule,
    DataBaseModule,
    LottoModule,
    DhlotteryModule,
  ],
  providers: [AppInitService],
})
export class AppModule {}
