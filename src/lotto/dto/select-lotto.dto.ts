import { IsEmpty, IsNumber, isEmpty} from 'class-validator';
import { Type } from 'class-transformer';

export class SelectLottoDto {
    @Type(() => Number)
    @IsNumber()
    drwtNo1: number

    @Type(() => Number)
    @IsNumber()
    drwtNo2: number
    
    @Type(() => Number)
    @IsNumber()
    drwtNo3: number
    
    @Type(() => Number)
    @IsNumber()
    drwtNo4: number
    
    @Type(() => Number)
    @IsNumber()
    drwtNo5: number
    
    @Type(() => Number)
    @IsNumber()
    drwtNo6: number
}