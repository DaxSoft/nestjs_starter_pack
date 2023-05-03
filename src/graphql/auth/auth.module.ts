import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/graphql/user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { env } from 'src/env';

export const EXPIRE_TIME = '60000s';
export const SALT_ROUNDS = 10;

@Module({
  providers: [GoogleStrategy, AuthService, AuthResolver, JwtStrategy],
  imports: [
    JwtModule.register({
      privateKey: env.JWT_SECRET_KEY,
      signOptions: { expiresIn: EXPIRE_TIME },
      secret: env.JWT_SECRET_KEY,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
