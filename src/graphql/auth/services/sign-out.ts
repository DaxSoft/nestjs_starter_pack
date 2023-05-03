import { GraphQLError } from 'graphql';
import { AuthServiceConstructorContext } from '../auth.service';
import { AUTH_SERVICE_ERROR_CODE } from './_errors';
import { z } from 'zod';
import { Response } from 'express';
import { AROUND_MORE_THAN_ONE_DAY_IN_MS } from '../auth.resolver';
import { COOKIES } from 'src/configs/cookies';

export const context = z.object({
  res: z.custom<Response>(),
});

export const result = z.boolean();

type ContextType = z.infer<typeof context>;
type ResultType = z.infer<typeof result>;

export default async function service(
  {}: Partial<AuthServiceConstructorContext>,
  { res }: ContextType
): Promise<ResultType> {
  try {
    const pastDate = new Date(Date.now() - AROUND_MORE_THAN_ONE_DAY_IN_MS);

    // res?.cookie(SESSION_COOKIE_NAME, null, { expires: pastDate });
    // res?.cookie(X_USER_DATA_COOKIE_NAME, null, { expires: pastDate });
    res?.clearCookie(COOKIES.SESSION_COOKIE_NAME, {
      expires: pastDate,
    });

    return true;
  } catch (error) {
    throw new GraphQLError(AUTH_SERVICE_ERROR_CODE.INVALID_USER);
  }
}
