import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import * as emails from './emails/emails';
import { SESProvider } from './providers/ses';
import { PathRouteService } from '../path/path.service';
import { ConfigService } from '@nestjs/config';

type EmailSendKeys = keyof typeof emails;
type EmailSendKeysContext<K extends EmailSendKeys> = z.infer<(typeof emails)[K]['schema']>;
export type EmailDefaultProvider = SESProvider;

@Injectable()
export class EmailService {
  constructor(private readonly pathService: PathRouteService, private readonly configService: ConfigService) {}

  private provider = new SESProvider(this.pathService, this.configService);

  async send<T extends EmailSendKeys>(key: T, data: EmailSendKeysContext<T>) {
    try {
      const emailTemplate = emails[key];
      if (emailTemplate.email) {
        return emailTemplate.email(data, this.provider);
      } else {
        throw new Error('This e-mail was not found');
      }
    } catch (error) {}
  }
}
