import { Injectable } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { LottoResult } from "src/lotto/entitiy/lotto-result.entity";
import { LottoSearch } from "src/lotto/entitiy/lotto-search.entity";

@Injectable()
export class DataBaseConfigService implements TypeOrmOptionsFactory{
    constructor(private readonly configService: ConfigService){}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            port: this.configService.get<number>('DB_PORT'),
            host: this.configService.get<string>('DB_HOST'),
            database: this.configService.get<string>('DB_DATABASE'),
            autoLoadEntities: true,
            // entities: [ 
            //     `${__dirname}/../**/*.entity.{js, ts}`,
            //     LottoResult,
            //     LottoSearch,
            // ],
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: true, 
        };
    }
}