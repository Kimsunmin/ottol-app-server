import { IsNumber} from 'class-validator';

export class SelectLottoDto {
    @IsNumber()
    drwtNo1: number

    @IsNumber()
    drwtNo2: number
    
    @IsNumber()
    drwtNo3: number
    
    @IsNumber()
    drwtNo4: number
    
    @IsNumber()
    drwtNo5: number
    
    @IsNumber()
    drwtNo6: number
}