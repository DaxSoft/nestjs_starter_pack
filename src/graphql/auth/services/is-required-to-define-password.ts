import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { z } from 'zod';

export const context = z.object({
  userId: z.string(),
});

export const result = z.boolean();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { prisma }: Partial<AuthServiceConstructorContext>,
  { userId }: ContextType
): Promise<ResultType> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        UserProfile: {
          select: {
            isRequiredToDefineProfile: true,
          },
        },
      },
    });

    return user.UserProfile.isRequiredToDefineProfile === true;
  } catch (error) {
    throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.INVALID_USER);
  }
}
