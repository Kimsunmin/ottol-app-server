import { PageOptionDto } from "../dto/page-option.dto";

export class PageMetaDto {
    page: number;
    size: number;
    itemCount: number;
    pageCount: number;
    hasNext: boolean;
    hasPrev: boolean;

    constructor(pageOptionDto: PageOptionDto, itemCount: number){
        this.page = pageOptionDto.page;
        this.size = pageOptionDto.size;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.size);
        this.hasNext = this.pageCount > this.page;
        this.hasPrev = this.page > 1;
    }

}