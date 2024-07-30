import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
  message: 'Too many requests, please try again later.',
})

const httpsOptions = {
  key: fs.readFileSync('./secrets/cert.key'),
  cert: fs.readFileSync('./secrets/cert.crt'),
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions });

  app.use(cookieParser())
  app.use(limiter)

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('invest-manage - API')
    .setDescription('Apis para o sistema de gerenciamento de investimentos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap();
