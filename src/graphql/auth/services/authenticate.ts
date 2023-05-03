import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AuthCredentialInput } from '../inputs/auth.credential.input';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { AuthUtilsCrypt } from '../utils/auth.crypt';
import { Response } from 'express';
import { z } from 'zod';
import { AuthLoggedUserEntity } from '../entities/logged-user.entity';

export const context = z.object({
  credentials: z.custom<Partial<AuthCredentialInput>>(),
  res: z.custom<Response>(),
});

export const result = z.custom<AuthLoggedUserEntity>();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma, authService, redis }: Partial<AuthServiceConstructorContext>,
  { credentials, res }: ContextType
): Promise<ResultType> {
  try {
    await redis.service('common_operation', { id: `login/${credentials.login}` });

    const user = await prisma.user.findFirstOrThrow({
      where: {
        username: credentials.login,
      },
      include: {
        UserCredentials: true,
      },
    });

    if (!user?.UserCredentials || !user.UserCredentials.password) {
      throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.BAD_LOGIN_TEXT);
    }

    const isPasswordMatching = AuthUtilsCrypt.matchPassword(credentials.password, user.UserCredentials.password);

    if (!isPasswordMatching) throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.BAD_LOGIN_TEXT);

    if (!user.UserCredentials.isEmailVerified) {
      throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.EMAIL_NOT_CHECKED);
    }

    const xUserSessionToken = user.id;

    const token = authService.generateTokenByUserId(xUserSessionToken);

    return {
      xUserSessionToken: token,
    };
  } catch (error) {
    throw new GraphQLError(error?.message ? error.message : AUTH_SERVICE_ERROR_CODE.INVALID_USER);
  }
}
