import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { CorsConfig, NestConfig } from './configs/config.interface';
import { PrismaService } from './global/prisma/prisma.service';
import * as passport from 'passport';
import * as session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';
import { env } from './env';

// workaround for ts error
const _graphqlUploadExpress = graphqlUploadExpress as any;

declare const module: any;

void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet());

  // passport-session
  app
    .use(cookieParser())
    .use(
      session({
        secret: env.JWT_SECRET_KEY,
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: 60000,
        },
      })
    )
    .use(passport.initialize())
    .use(passport.session())
    .use(
      _graphqlUploadExpress({
        // Limits here should be stricter than config for surrounding infrastructure
        // such as NGINX so errors can be handled elegantly by `graphql-upload`.
        maxFileSize: 10000000, // 10 MB
        maxFiles: 20,
      }) as any
    )
    .use(json({ limit: '50mb' }))
    .use(urlencoded({ extended: true, limit: '50mb' }));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  // Enable security libs
  if (corsConfig.enabled) {
    app.enableCors({
      origin: [
        process.env.PLATFORM_CLIENT_ENDPOINT,
        process.env.ADMIN_CLIENT_ENDPOINT,
        process.env.WRITER_CLIENT_ENDPOINT,
      ],
      credentials: true,
    });
  }

  // fix issues with enableShutdownHooks for Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT || nestConfig.port).then(() => {
    Logger.log('API running on port ' + nestConfig.port);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
})();
