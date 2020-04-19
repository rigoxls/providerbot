import * as amqp from 'amqplib';
import {Server, CustomTransportStrategy} from '@nestjs/microservices';

export class RabbitMQServer extends Server implements CustomTransportStrategy {
  private server: amqp.Connection = null;
  private channel: amqp.Channel = null;
  private exchange: string = 'offers';

  constructor(private readonly host: string) {
    super();
  }

  public async listen(callback: () => void) {
    const q = await this.init();
    this.channel.bindQueue(q.queue, this.exchange, '');

    this.channel.consume(q.queue, this.handleMessage.bind(this), {
      noAck: true,
    });
  }

  public close() {
    this.channel && this.channel.close();
    this.server && this.server.close();
  }

  private async handleMessage(message) {
    const { content } = message;
    const messageObj = JSON.parse(content.toString('utf8'));
    const pattern = messageObj.pattern;

    const handlers = this.getHandlers();
    const handler = handlers.get(pattern.replace(/\"/gi, ''));

    if (!handler) {
        return;
    }
    await handler(messageObj.data)    
  }

  private async init() {
    this.server = await amqp.connect(this.host);
    this.channel = await this.server.createChannel();
    this.channel.assertExchange(this.exchange, 'fanout', {
      durable: false
    });
    return this.channel.assertQueue('', {durable: false});
  }
}