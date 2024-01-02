import { IsEnum, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SelectLottoDto } from '../dto/select-lotto.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageOptionDto extends SelectLottoDto {
  // 정렬 방식
  @IsOptional()
  order?: Order = Order.DESC;

  // 페이지 번호
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  // 보여질 건수
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  size?: number = 5;

  // 자를 건수?
  get offset(): number {
    return (this.page - 1) * this.size;
  }
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
