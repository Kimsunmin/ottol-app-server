import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ZodValidationPipe, patchNestjsSwagger } from '@anatine/zod-nestjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.useGlobalPipes(new ZodValidationPipe());

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
