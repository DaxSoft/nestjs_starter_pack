import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { env } from 'src/env';

const origin = env.CORS_CLIENT_ENDPOINT.split(';').map((d) => d.trim());

export const corsConfig: CorsOptions = {
  credentials: true,
  origin,
};
