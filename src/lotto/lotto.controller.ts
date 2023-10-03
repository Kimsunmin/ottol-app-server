import { Controller, Get, Param, Query } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LottoService } from './lotto.service';
import { SelectLottoDto } from './dto/select-lotto.dto';

@Controller('api/v1')
export class LottoController {
    constructor(private readonly lottoService: LottoService) {}

    @Get('/create')
    async create(@Query('drwNoStart') drwNoStart: number, @Query('drwNoEnd') drwNoEnd: number) {
        const result = await this.lottoService.setLotto(drwNoStart, drwNoEnd);
        return result;
    }

    @Get('/update')
    @Cron('0 50 20 * * 6') // 매주 토요일 20시 50분 마다 실행
    async update(@Query('drwNo') drwNo: number){
        const updateDrwNo = drwNo ?? await this.lottoService.findMaxDrwNo() + 1;

        const result = await this.lottoService.setLotto(updateDrwNo, updateDrwNo);
        return result
    }

    @Get('find')
    async findLottoByDrwtNo(@Query() selectLottoDto: SelectLottoDto) {
        
        return {
            result : await this.lottoService.find(selectLottoDto),
            input: selectLottoDto,
        }
    }

}