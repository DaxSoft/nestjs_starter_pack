import { z } from 'zod';

const schema = z.object({
  /**!SECTION x-user-session: token for user */
  SESSION_COOKIE_NAME: z.string().min(1),
});

export type CookiesConstantsContext = z.infer<typeof schema>;

const constants: CookiesConstantsContext = {
  SESSION_COOKIE_NAME: 'x-user-session',
};

export const COOKIES = schema.parse(constants);
