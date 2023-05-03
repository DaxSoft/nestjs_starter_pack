import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { z } from 'zod';
import { UserEntity } from 'src/graphql/user/entities/user.entity';

export const context = z.object({
  username: z.string(),
});

export const result = z.custom<UserEntity>();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma }: Partial<AuthServiceConstructorContext>,
  { username }: ContextType
): Promise<ResultType> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        username,
      },
      select: {
        UserProfile: {
          select: {
            fullname: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.USERNAME_NOT_REGISTRED);
  }
}
