import { DhlotteryService } from '@/ext/dhlottery/dhlottery.service';
import { LottoService } from '@/lotto/lotto.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LottoTaskService {
  constructor(
    private readonly lottoService: LottoService,
    private readonly dhlotteryService: DhlotteryService,
  ) {}

  @Cron('0 50 20 * * 6') // 매주 토요일 20시 50분 마다 실행
  async updateLotto() {
    const startRound = (await this.lottoService.readSavedLastDrawRound()) + 1;
    const endRound = Math.max(
      startRound,
      await this.dhlotteryService.getCurrentDrwNo(),
    );

    await this.lottoService.createLotto(startRound, endRound);
  }
}
