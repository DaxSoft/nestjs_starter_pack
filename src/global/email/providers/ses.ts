import { PathRouteService } from 'src/global/path/path.service';
import { z } from 'zod';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import { env } from 'src/env';

export const sendEmailContext = z.object({
  to: z.array(z.string()),
  from: z.enum(['dummy@email.com']),
  subject: z.string(),
  body: z.string().optional(),
  template: z.string().optional(),
  variables: z.record(z.string()).optional(),
});

type SendEmailContextType = z.infer<typeof sendEmailContext>;

export class SESProvider {
  constructor(private readonly pathService: PathRouteService, private configService: ConfigService) {}

  private provider: SESClient = new SESClient({
    region: env.AMAZON_SES_BUCKET_REGION,
    credentials: {
      accessKeyId: env.AMAZON_IAM_USER_PUBLIC_KEY,
      secretAccessKey: env.AMAZON_IAM_USER_SECRET_KEY,
    },
  });

  private sanitizeVariableKey(key: string): string {
    return key.replace(/(\{)/gm, '\\{').replace(/(\})/gm, '\\}');
  }

  private assignVariablesFromTemplate(content: string, variables: Record<string, string>) {
    let text: string = content;

    Object.keys(variables).map((key) => {
      const element = variables[key];
      let sanitizeKey = this.sanitizeVariableKey(key);
      const rule = new RegExp(`(${sanitizeKey})`, 'gum');
      text = text.replace(rule, element);
    });

    return text;
  }

  private async getTemplateHtml(filename: string): Promise<string | undefined> {
    try {
      const data = await this.pathService.io().read(this.pathService.plug('@emails', filename));
      if (!data) {
        return undefined;
      }
      return data;
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @param data
   * @returns
   * @example
   * sendEmail({
   *  variables: {
   *    '{{name}}': "Name"
   *  }
   * })
   */

  async sendEmail(data: SendEmailContextType): Promise<boolean> {
    try {
      let payload: string = data.body || '';

      if (data.template) {
        payload = await this.getTemplateHtml(data.template);
        if (data.variables) {
          payload = this.assignVariablesFromTemplate(payload, data.variables);
        }
      }

      const command = new SendEmailCommand({
        Destination: {
          ToAddresses: data.to,
        },
        Message: {
          Subject: {
            Charset: 'UTF-8',
            Data: data.subject,
          },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: payload,
            },
            Text: {
              Charset: 'UTF-8',
              Data: payload,
            },
          },
        },
        Source: data.from,
      });

      const output = await this.provider.send(command);
      console.log('SES', {
        output,
      });

      const status = output.$metadata.httpStatusCode === 200;

      return status;
    } catch (error) {
      console.error(error);
      if (error?.response) {
        console.error(error.response.body);
      }
      return false;
    }
  }
}
