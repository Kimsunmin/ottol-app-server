import { DhlotteryService } from '@/ext/dhlottery/dhlottery.service';
import { LottoService } from '@/lotto/lotto.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppInitService implements OnModuleInit {
  constructor(
    private readonly lottoService: LottoService,
    private readonly dhlotterySerivce: DhlotteryService,
  ) {}

  async onModuleInit() {
    const currentDrawRound = await this.dhlotterySerivce.getCurrentDrwNo();
    const savedLastDrawRound = await this.lottoService.readSavedLastDrawRound();

    // 저장된 로또 회차가 없을 경우
    if (savedLastDrawRound === 0) {
      return await this.lottoService.createLotto(1, currentDrawRound);
    }

    // 저장된 로또 회차가 현재 로또 회차 보다 작을때
    if (currentDrawRound > savedLastDrawRound) {
      return await this.lottoService.createLotto(
        savedLastDrawRound,
        currentDrawRound,
      );
    }
  }
}
