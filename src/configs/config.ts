import { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 4000,
  },
  cors: {
    enabled: true,
  },
  throttler: {
    ttl: 60,
    limit: 50000,
  },
  security: {
    expiresIn: '7d',
    refreshIn: '14d',
    confirmIn: '2d',
    passwordIn: '1d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
