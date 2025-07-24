import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTOを使ったリクエストの検証を自動で行う
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOに定義されていないプロパティを自動的に削除
      forbidNonWhitelisted: true, // DTOにないプロパティが含まれていたらリクエストを拒否
      transform: true, // 受け取ったデータをDTOの型に変換しようと試みる
    }),
  );

  // アクセスを許可するフロントエンドのURLを指定
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  // シャットダウンの時にonModuleDestroyを呼び出す
  app.enableShutdownHooks();

  await app.listen(process.env.BACKEND_PORT || 8000);
}
bootstrap();
