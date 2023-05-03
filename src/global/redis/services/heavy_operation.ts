import { GraphQLError } from 'graphql';
import { ServiceConstructorContext } from '../redis.service';
import { z } from 'zod';
import { REDIS_SERVICES_ERRORS } from './_errors';

export const context = z.object({
  id: z.string(),
});

export const result = z.void();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  { service }: Partial<ServiceConstructorContext>,
  { id }: ContextType
): Promise<ResultType> {
  try {
    const { success } = await service.ratelimiter_heavy.limit(`heavy/${id}`);
    if (!success) {
      throw new GraphQLError(REDIS_SERVICES_ERRORS.LIMIT_REQUESTS);
    }
  } catch (error) {
    console.error(error);
  }
}
