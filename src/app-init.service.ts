import { LottoService } from '@/lotto/lotto.service';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppInitService implements OnModuleInit {
  constructor(private lottoService: LottoService) {}

  async onModuleInit() {
    const lastDrwNo = await this.lottoService.readLastDrwNo();
    const saveLottoCount = await this.lottoService.readAllLottoCount();

    console.log(lastDrwNo);

    if (lastDrwNo !== saveLottoCount) {
      await this.lottoService.saveLottoResult(1, lastDrwNo);
    }
  }
}
