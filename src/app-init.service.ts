import { DhlotteryService } from '@/ext/dhlottery/dhlottery.service';
import { LottoService } from '@/lotto/lotto.service';
import { LottoTaskService } from '@/lotto/lotto.task.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppInitService implements OnModuleInit {
  constructor(
    private readonly lottoService: LottoService,
    private readonly lottoTaskService: LottoTaskService,
    private readonly dhlotteryService: DhlotteryService,
  ) {}

  async onModuleInit() {
    const lastDrwNoByWeb = await this.dhlotteryService.getCurrentDrwNo();
    const lastDrwNo = await this.lottoService.readLastDrwNo();

    const saveLottoCount = await this.lottoService.readAllLottoCount();

    // 저장된 로또 데이터가 없을 경우
    if (saveLottoCount === 0) {
      await this.lottoService.createLotto(1, lastDrwNoByWeb);
      return await this.lottoTaskService.createLotto(1, lastDrwNoByWeb);
    }

    // 저장된 로또 데이터의 회차가 실제 최종 회차 보다 작은 경우
    if (lastDrwNoByWeb > lastDrwNo) {
      const drwNoStart = lastDrwNo + 1;
      return await this.lottoTaskService.createLotto(
        drwNoStart,
        lastDrwNoByWeb,
      );
    }
  }
}
