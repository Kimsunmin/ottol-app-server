import { Module } from "@nestjs/common";
import { DataBaseConfigService } from "./config.service";

@Module({
    providers: [ DataBaseConfigService ]
})
export class DataBaseConfigModule {}