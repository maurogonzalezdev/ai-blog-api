if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from '@api/app.module';

async function bootstrap() {
  const app: NestFastifyApplication<any> =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('AI Blog API')
    .setDescription('AI Blog API docs')
    .setVersion('1.0')
    .build();

  const documentFactory: () => OpenAPIObject = function () {
    return SwaggerModule.createDocument(app, config);
  };

  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'AI Blog API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: false,
      disableErrorMessages: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
