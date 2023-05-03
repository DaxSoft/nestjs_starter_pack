import { z } from 'zod';
import { EmailDefaultProvider } from '../email.service';

export const schema = z.object({
  email: z.string().email(),
  fullname: z.string(),
  code: z.string(),
});

type EmailContext = z.infer<typeof schema>;

export async function email(data: EmailContext, provider: EmailDefaultProvider): Promise<boolean> {
  try {
    const values = schema.parse(data);

    await provider.sendEmail({
      from: 'dummy@email.com',
      body: ``,
      subject: `${values.fullname}, change your password at Camp`,
      to: [values.email],
    });

    return true;
  } catch (error) {
    return false;
  }
}
