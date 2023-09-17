import { Controller, Get } from '@nestjs/common';
import { LottoService } from './lotto.service';

@Controller('lotto')
export class LottoController {
    constructor(private readonly lottoService: LottoService) {}

    @Get()
    async findAll() {
        const find = await this.lottoService.findAll();
        console.log(find)
        return find;
    }

}
