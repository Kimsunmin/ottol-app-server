import { LottoService } from '@/lotto/lotto.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppInitService implements OnModuleInit {
  constructor(private lottoService: LottoService) {}

  async onModuleInit() {
    const lastDrwNoByWeb = await this.lottoService.readLastDrwNoByWeb();
    const lastDrwNo = await this.lottoService.readLastDrwNo();

    const saveLottoCount = await this.lottoService.readAllLottoCount();

    // 저장된 로또 데이터가 없을 경우
    if (saveLottoCount === 0) {
      return await this.lottoService.saveLotto(1, lastDrwNoByWeb);
    }

    // 저장된 로또 데이터의 회차가 실제 최종 회차 보다 작은 경우
    if (lastDrwNoByWeb > lastDrwNo) {
      return await this.lottoService.saveLotto(lastDrwNo + 1, lastDrwNoByWeb);
    }
  }
}
