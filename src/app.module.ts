import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AuthModule } from 'src/graphql/auth/auth.module';
import config from './configs/config';
import { ThrottlerConfig } from './configs/config.interface';
import { PathRouteModule } from './global/path/path.module';
import { PrismaModule } from './global/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { AWS_S3Module } from 'src/global/aws_storage/aws_s3.module';
import { EmailModule } from './global/email/email.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from './global/redis/redis.module';
import { UserModule } from './graphql/user/user.module';

@Module({
  imports: [
    InMemoryDBModule.forRoot({}),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const throttlerConfig = configService.get<ThrottlerConfig>('throttler');
        return {
          ttl: throttlerConfig.ttl,
          limit: throttlerConfig.limit,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // cors: {
      //   origin: [
      //     process.env.PLATFORM_CLIENT_ENDPOINT,
      //     process.env.ADMIN_CLIENT_ENDPOINT,
      //     process.env.WRITER_CLIENT_ENDPOINT,
      //   ],
      //   credentials: true,
      // },
      context: ({ req, res }) => ({ req, res }),
      sortSchema: true,
      playground: false,
      // debug: false,
      introspection: true,
    }),
    AuthModule,
    PrismaModule,
    PathRouteModule,
    PassportModule.register({ session: true }),
    AWS_S3Module,
    EmailModule,
    RedisModule,
    UserModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    //   exclude: ['/graphql/(.*)', '/api/(.*)'],
    // }),
  ],
})
export class AppModule {}
