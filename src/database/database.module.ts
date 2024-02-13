import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/config/loadConfiguration';
import {
  typeormModuleOptionFactory,
  dataSourceFactory,
} from '@/database/database.datasource';
import { LottoResultEntity } from '@/lotto/lotto-result.entity';
import { LottoSearchEntity } from '@/lotto/lotto-search.entity';
import { LottoSearchHisoryEntity } from '@/lotto/lotto-search-history.entity';
import { LottoMasterEntity } from '@/lotto/lotto-master.entity';
import { LottoDetailEntity } from '@/lotto/lotto-detail.entity';
import { LottoSearchNewEntity } from '@/lotto/lotto-search-new.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const env = configService.getOrThrow<Configuration['env']>('env');
        const database = {
          DB_TYPE:
            configService.getOrThrow<Configuration['DB_TYPE']>('DB_TYPE'),
          DB_HOST:
            configService.getOrThrow<Configuration['DB_HOST']>('DB_HOST'),
          DB_PORT:
            configService.getOrThrow<Configuration['DB_PORT']>('DB_PORT'),
          DB_USERNAME:
            configService.getOrThrow<Configuration['DB_USERNAME']>(
              'DB_USERNAME',
            ),
          DB_PASSWORD:
            configService.getOrThrow<Configuration['DB_PASSWORD']>(
              'DB_PASSWORD',
            ),
          DB_DATABASE:
            configService.getOrThrow<Configuration['DB_DATABASE']>(
              'DB_DATABASE',
            ),
        };
        return await typeormModuleOptionFactory({
          env,
          ...database,
          entities: [
            LottoResultEntity,
            LottoSearchEntity,
            LottoSearchHisoryEntity,
            LottoMasterEntity,
            LottoDetailEntity,
            LottoSearchNewEntity,
          ],
        });
      },
      dataSourceFactory,
    }),
  ],
})
export class DataBaseModule {}
