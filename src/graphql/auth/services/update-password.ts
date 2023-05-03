import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { z } from 'zod';
import { AuthUtilsCrypt } from '../utils/auth.crypt';

export const context = z.object({
  credentialId: z.string(),
  newPassword: z.string(),
  repeatNewPassword: z.string(),
});

export const result = z.boolean();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma }: Partial<AuthServiceConstructorContext>,
  { credentialId, newPassword, repeatNewPassword }: ContextType
): Promise<ResultType> {
  try {
    if (repeatNewPassword !== newPassword) {
      throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.PASSWORD_NOT_MATCHING);
    }

    const password = await AuthUtilsCrypt.hashPassword(newPassword);

    const userCredentials = await prisma.userCredentials.update({
      where: {
        id: credentialId,
      },
      data: {
        password,
        codeToChangePassword: null,
      },
    });

    return !!userCredentials;
  } catch (error) {
    throw new GraphQLError(error?.message ? error.message : AUTH_SERVICE_ERROR_CODE.INVALID_USER);
  }
}
