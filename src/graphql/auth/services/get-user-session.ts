import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { z } from 'zod';
import { UserEntity } from 'src/graphql/user/entities/user.entity';
import { USER_PUBLIC_SELECT_DATA } from 'src/graphql/user/models/user.public-data.model';
import { env } from 'src/env';

export const context = z.object({
  xUserSessionToken: z.string(),
});

export const result = z.custom<UserEntity>();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma, jwtService }: Partial<AuthServiceConstructorContext>,
  { xUserSessionToken }: ContextType
): Promise<ResultType> {
  try {
    const decodedToken = jwtService.verify(xUserSessionToken, {
      secret: env.JWT_SECRET_KEY,
    });

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken?.sub,
      },
      select: USER_PUBLIC_SELECT_DATA,
    });

    return user;
  } catch (error) {
    throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.NOT_LOGGED);
  }
}
