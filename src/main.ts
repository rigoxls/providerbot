import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RabbitMQServer } from './rabbit-mq/rabbit-mq-server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  let port = 3080;
  port = (process.env.port) ? parseInt(process.env.port) : port;
  await app.listen(port);
}

async function rabbitMQBootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new RabbitMQServer(
      'amqp://kxsfcakg:jahgl20UG_mvcXK9f7keJpazfDSJtarc@prawn.rmq.cloudamqp.com/kxsfcakg'      
    ),
  });
  await app.listen(() => {});
}

bootstrap();
rabbitMQBootstrap();
