import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { LottoService } from './lotto/lotto.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  const lottoResultService = app.get(LottoService);

  // 데이터가 없는 경우
  if ((await lottoResultService.findMaxDrwNo()) === 0) {
    await lottoResultService.setLotto(0, 1000000);
  }

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(port);
}
bootstrap();
