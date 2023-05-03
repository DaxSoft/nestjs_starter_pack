import { z } from 'zod';
import { EmailDefaultProvider } from '../email.service';

export const schema = z.object({
  email: z.string().email(),
  fullname: z.string(),
  codeToVerifyEmail: z.string(),
});

type EmailContext = z.infer<typeof schema>;

export async function email(data: EmailContext, provider: EmailDefaultProvider): Promise<boolean> {
  try {
    const values = schema.parse(data);

    await provider.sendEmail({
      to: [values.email],
      body: `Your code to verify e-mail is: ${values.codeToVerifyEmail}`,
      subject: `${values.fullname}, Welcome to Camp`,
      from: 'dummy@email.com',
    });

    return true;
  } catch (error) {
    return false;
  }
}
