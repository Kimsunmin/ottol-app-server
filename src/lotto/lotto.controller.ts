import { Controller, Get, Param, Query } from '@nestjs/common';
import { LottoService } from './lotto.service';
import { SelectLottoDto } from './dto/select-lotto.dto';

@Controller('api/v1')
export class LottoController {
    constructor(private readonly lottoService: LottoService) {}

    @Get('/init')
    async init(@Query('drwNoStart') drwNoStart: number, @Query('drwNoEnd') drwNoEnd: number) {
        await this.lottoService.setLotto(drwNoStart, drwNoEnd);
        return 'done';
    }

    @Get('find')
    async findLottoByDrwNo(@Query() selectLottoDto: SelectLottoDto) {
        
        return {
            result : await this.lottoService.find(selectLottoDto),
            input: selectLottoDto,
        }
    }

}