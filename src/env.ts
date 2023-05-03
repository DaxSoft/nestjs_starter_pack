import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */

const aws_bucket_region: readonly [string, ...string[]] = [
  'us-east-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'ap-east-1',
  'ap-south-1',
  'ap-northeast-3',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ca-central-1',
  'cn-north-1',
  'cn-northwest-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'me-south-1',
  'sa-east-1',
  'us-gov-east-1',
  'us-gov-west-1',
  'us-iso-east-1',
  'us-isob-east-1',
  'us-west-1-lax-1a',
  'us-west-1-lax-1b',
  'us-west-1-lax-1c',
  'us-west-2-lax-1a',
  'us-west-2-lax-1b',
  'us-west-2-lax-1c',
  'us-west-2-lax-1d',
  'us-west-2-lax-1e',
  'us-west-2-lax-1f',
  'us-west-2-lax-1g',
  'us-west-2-lax-1h',
];

const server = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  JWT_SECRET_KEY: z.string().min(1),
  PROJECT_NAME: z.string().min(1),
  CORS_CLIENT_ENDPOINT: z.string(),
  PASSPORT_GOOGLE_ID: z.string(),
  PASSPORT_GOOGLE_SECRET: z.string(),
  AMAZON_S3_BUCKET_NAME: z.string().min(1),
  AMAZON_S3_BUCKET_REGION: z.enum(aws_bucket_region),
  AMAZON_SES_BUCKET_REGION: z.enum(aws_bucket_region),
  AMAZON_IAM_USER_PUBLIC_KEY: z.string().min(1),
  AMAZON_IAM_USER_SECRET_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().min(1),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  CLIENT_APP_DOMAIN: z.string().url(),
});

const processEnv: Record<keyof z.infer<typeof server>, string | undefined> = {
  NODE_ENV: process.env.NODE_ENV,
  PROJECT_NAME: process.env.PROJECT_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  CORS_CLIENT_ENDPOINT: process.env.CORS_CLIENT_ENDPOINT,
  PASSPORT_GOOGLE_ID: process.env.PASSPORT_GOOGLE_ID,
  PASSPORT_GOOGLE_SECRET: process.env.PASSPORT_GOOGLE_SECRET,
  AMAZON_S3_BUCKET_NAME: process.env.AMAZON_S3_BUCKET_NAME,
  AMAZON_S3_BUCKET_REGION: process.env.AMAZON_S3_BUCKET_REGION,
  AMAZON_SES_BUCKET_REGION: process.env.AMAZON_SES_BUCKET_REGION,
  AMAZON_IAM_USER_PUBLIC_KEY: process.env.AMAZON_IAM_USER_PUBLIC_KEY,
  AMAZON_IAM_USER_SECRET_KEY: process.env.AMAZON_IAM_USER_SECRET_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  CLIENT_APP_DOMAIN: process.env.CLIENT_APP_DOMAIN,
};

// --------------------------
// Don't touch the part below
// --------------------------

const merged = server;
export type EnvContext = z.infer<typeof merged>;

let env = process.env as EnvContext;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  /** @type {MergedSafeParseReturn} */
  const parsed = merged.safeParse(processEnv);

  if (parsed.success === false) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      return target[/** @type {keyof typeof target} */ prop];
    },
  });
}

export { env };
