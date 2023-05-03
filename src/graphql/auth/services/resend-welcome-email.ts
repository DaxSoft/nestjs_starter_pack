import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { Response } from 'express';
import { z } from 'zod';

export const context = z.object({
  username: z.string(),
  res: z.custom<Response>(),
});

export const result = z.boolean();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma, emailService, redis }: Partial<AuthServiceConstructorContext>,
  { username }: ContextType
): Promise<ResultType> {
  try {
    await redis.service('slow_operation', { id: `resend-welcome-email/${username}` });

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
      include: {
        UserProfile: {
          select: {
            fullname: true,
          },
        },
        UserCredentials: {
          select: {
            credentialVerificationCode: true,
            email: true,
          },
        },
      },
    });

    emailService.send('auth_welcome', {
      email: user.UserCredentials.email,
      fullname: user.UserProfile.fullname,
      codeToVerifyEmail: user.UserCredentials.credentialVerificationCode,
    });

    return true;
  } catch (error) {
    throw new GraphQLError(error?.message ? error.message : AUTH_SERVICE_ERROR_CODE.INVALID_USER);
  }
}
