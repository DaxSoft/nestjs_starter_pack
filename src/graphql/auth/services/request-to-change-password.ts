import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { z } from 'zod';
import { AuthUtilsCrypt } from '../utils/auth.crypt';
import { REDIS_SERVICES_ERRORS } from 'src/global/redis/services/_errors';

export const context = z.object({
  username: z.string(),
});

export const result = z.boolean();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma, emailService, redis }: Partial<AuthServiceConstructorContext>,
  { username }: ContextType
): Promise<ResultType> {
  try {
    await redis.service('heavy_operation', { id: username });

    const codeToChangePassword = AuthUtilsCrypt.generateCode();

    const user = await prisma.user.update({
      where: {
        username,
      },
      data: {
        UserCredentials: {
          update: {
            codeToChangePassword,
          },
        },
      },
      select: {
        UserProfile: {
          select: {
            fullname: true,
          },
        },
        UserCredentials: {
          select: {
            email: true,
          },
        },
      },
    });

    await emailService.send('auth_forgot_password', {
      code: codeToChangePassword,
      email: user.UserCredentials.email,
      fullname: user.UserProfile.fullname,
    });

    return true;
  } catch (error) {
    throw new GraphQLError(error?.message ? error.message : AUTH_SERVICE_ERROR_CODE.INVALID_USER);
  }
}
