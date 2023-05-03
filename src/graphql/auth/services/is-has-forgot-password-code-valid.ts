import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { z } from 'zod';
import { AuthVerifyForgotPasswordCodeInput } from '../inputs/auth.verify-forgot-password-code.input';

export const context = z.custom<Partial<AuthVerifyForgotPasswordCodeInput>>();

export const result = z.boolean();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma }: Partial<AuthServiceConstructorContext>,
  { code, credentialId }: ContextType
): Promise<ResultType> {
  try {
    const isValid = await prisma.userCredentials.findFirstOrThrow({
      where: {
        id: credentialId,
        AND: {
          codeToChangePassword: code,
        },
      },
    });

    return !!isValid;
  } catch (error) {
    throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.INVALID_USER);
  }
}
