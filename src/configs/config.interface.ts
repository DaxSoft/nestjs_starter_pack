export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  throttler: ThrottlerConfig;
  graphql?: GraphqlConfig;
  security: SecurityConfig;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface ThrottlerConfig {
  ttl: number;
  limit: number;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  sortSchema: boolean;
  introspection: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  confirmIn: string;
  passwordIn: string;
  bcryptSaltOrRound: string | number;
}

export interface SmtpConfig {
  from: string;
  replyTo: string;
}
