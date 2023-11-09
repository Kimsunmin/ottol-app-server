import { IsArray } from "class-validator";
import { PageMetaDto } from "src/lotto/dto/page-meta.dto";

export class PageDto<T> {

    @IsArray()
    result: T[];

    meta: PageMetaDto;

    constructor(result: T[], meta: PageMetaDto) {
        this.result = result;
        this.meta = meta;
    }
}