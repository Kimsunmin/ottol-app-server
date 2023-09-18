import { Controller, Get } from '@nestjs/common';
import { LottoService } from './lotto.service';

@Controller('lotto')
export class LottoController {
    constructor(private readonly lottoService: LottoService) {}

    // 추후 서버 첫 기동시 작동으로 변경
    @Get('/init')
    async init() {
        await this.lottoService.init();
        return 'done';
    }

}
