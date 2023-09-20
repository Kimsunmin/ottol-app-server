import { Injectable } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from '@nestjs/config';
import { Lotto } from "../../lotto/entitiy/lotto.entity";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { LottoResult } from "src/lotto/entitiy/lotto-result.entity";

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
            entities: [ 
                `${__dirname}/../**/*.entity.{js, ts}`,
                Lotto,
                LottoResult
            ],
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: true, 
        };
    }
}