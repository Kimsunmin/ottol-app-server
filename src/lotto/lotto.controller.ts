import { Controller, Get, Param, Query } from '@nestjs/common';
import { LottoService } from './lotto.service';
import { SelectLottoDto } from './dto/select-lotto.dto';

@Controller('lotto')
export class LottoController {
    constructor(private readonly lottoService: LottoService) {}

    // 추후 서버 첫 기동시 작동으로 변경
    @Get('/init')
    async init(@Query('drwNo') drwNo: number = 1) {
        await this.lottoService.init(drwNo);
        return 'done';
    }

    @Get('/init2')
    async init2(@Query('drwNoStart') drwNoStart: number, @Query('drwNoEnd') drwNoEnd: number) {
        await this.lottoService.setLotto(drwNoStart, drwNoEnd);
        return 'done';
    }

    @Get('find')
    async findLottoByDrwNo(@Query() selectLottoDto: SelectLottoDto) {
        return await this.lottoService.find(selectLottoDto)
    }

}
