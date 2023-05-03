import { GraphQLError } from 'graphql';
import { UserServiceConstructorContext } from '../user.service';
import { USER_SERVICE_ERROR } from './_errors';
import { z } from 'zod';
import { UserEntity } from '../entities/user.entity';
import { USER_PUBLIC_SELECT_DATA } from '../models/user.public-data.model';

export const context = z.object({
  userId: z.string(),
});

export const result = z.custom<UserEntity>();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function getById(
  { prisma }: Partial<UserServiceConstructorContext>,
  { userId }: ContextType
): Promise<ResultType> {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: USER_PUBLIC_SELECT_DATA,
    });

    return user;
  } catch (error) {
    throw new GraphQLError(USER_SERVICE_ERROR.UNKNOWN_USER);
  }
}
