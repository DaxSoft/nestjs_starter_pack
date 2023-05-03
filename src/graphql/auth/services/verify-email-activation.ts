import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { z } from 'zod';
import { Response } from 'express';
import { AuthLoggedUserEntity } from '../entities/logged-user.entity';

export const context = z.object({
  userId: z.string(),
  credentialVerificationCode: z.string(),
  res: z.custom<Response>(),
});

export const result = z.custom<AuthLoggedUserEntity>();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma, authService }: Partial<AuthServiceConstructorContext>,
  { userId, credentialVerificationCode, res }: ContextType
): Promise<ResultType> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
        UserCredentials: {
          credentialVerificationCode,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        UserCredentials: {
          update: {
            isEmailVerified: true,
            credentialVerificationCode: null,
          },
        },
      },
    });

    const token = authService.generateTokenByUserId(user.id);

    return {
      xUserSessionToken: token,
    };
  } catch (error) {
    throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.INVALID_USER);
  }
}
