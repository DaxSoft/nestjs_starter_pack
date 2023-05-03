import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from '../_errors';
import { z } from 'zod';
import { AuthUtilsCrypt } from '../../utils/auth.crypt';
import { AuthCredentialInput } from '../../inputs/auth.credential.input';
import { Response } from 'express';
import { SESSION_COOKIE_NAME } from '../../auth.module';
import { USER_DEFAULT_DATA } from './user.default.prisma';

export const context = z.object({
  credentials: z.custom<Partial<AuthCredentialInput>>(),
  res: z.custom<Response>(),
});
export const result = z.boolean();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma, authService, emailService }: Partial<AuthServiceConstructorContext>,
  { credentials: { login, password, fullname, username }, res }: ContextType
): Promise<ResultType> {
  try {
    const count = await prisma.user.count({
      where: {
        username,
        OR: [
          {
            UserCredentials: {
              email: login,
            },
          },
        ],
      },
    });

    if (count > 0) throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.USER_REGISTRED);

    const hashPassword = await AuthUtilsCrypt.hashPassword(password);
    const credentialVerificationCode = AuthUtilsCrypt.generateCode();

    const user = await prisma.user.create({
      data: {
        username,
        role: 'CLIENT',
        category: 'A1',
        UserCredentials: {
          create: {
            password: hashPassword,
            email: login,
            isEmailVerified: false,
            credentialVerificationCode,
          },
        },
        UserProfile: {
          create: {
            fullname,
            UserProfileFollowers: {
              createMany: { data: [] },
            },
            UserProfileLibrary: {
              createMany: { data: [] },
            },
          },
        },
        ...USER_DEFAULT_DATA,
      },
    });

    emailService.send('auth_welcome', {
      email: login,
      fullname: fullname,
      codeToVerifyEmail: credentialVerificationCode,
    });

    const xUserSessionToken = user.id;

    const token = authService.generateTokenByUserId(xUserSessionToken);

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);

    res?.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      expires: expirationDate,
      sameSite: 'none',
    });

    return true;
  } catch (error) {
    throw new GraphQLError(error?.message ? error.message : AUTH_SERVICE_ERROR_CODE.UKNOWN);
  }
}
