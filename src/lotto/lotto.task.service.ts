import { LottoService } from '@/lotto/lotto.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LottoTaskService {
  constructor(private readonly lottoService: LottoService) {}

  @Cron('0 50 20 * * 6') // 매주 토요일 20시 50분 마다 실행
  async updateLottoTask() {
    const drwNoStart = (await this.lottoService.readLastDrwNo()) + 1;
    const drwNoEnd = Math.max(
      drwNoStart,
      await this.lottoService.readLastDrwNoByWeb(),
    );

    await this.lottoService.saveLotto(drwNoStart, drwNoEnd);
  }
}
