import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ZodValidationPipe, patchNestjsSwagger } from '@anatine/zod-nestjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from '@/common/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor(new Logger()));

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaagerConfig = new DocumentBuilder()
    .setTitle('Ottol api swaager')
    .setVersion('1.0')
    .build();

  patchNestjsSwagger();
  const swaggerDocument = SwaggerModule.createDocument(app, swaagerConfig, {});
  SwaggerModule.setup('/swagger-html', app, swaggerDocument, {
    jsonDocumentUrl: '/swagger-json',
  });

  await app.listen(port);
}
bootstrap();
