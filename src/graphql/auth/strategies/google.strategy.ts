import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { default as ConfigStrategy } from 'src/configs/config';
import { UserService } from 'src/graphql/user/user.service';
import { UserEntity } from 'src/graphql/user/entities/user.entity';
import { env } from 'src/env';

const { nest: nestConfig } = ConfigStrategy();

const CALLBACK_URL = new URL(env.CLIENT_APP_DOMAIN + '/auth/google/redirect');

export type GoogleUserDetails = {
  email: string;
  displayName: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      clientID: 'non_empty_string',
      clientSecret: '',
      callbackURL: CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate({ sub }: { sub: string }): Promise<UserEntity> {
    const user = await this.usersService.service('getById', {
      userId: sub,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
