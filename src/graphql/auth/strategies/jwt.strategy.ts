import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/graphql/user/user.service';
import { UserEntity } from 'src/graphql/user/entities/user.entity';
import { COOKIES } from 'src/configs/cookies';
import { env } from 'src/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => request.cookies[COOKIES.SESSION_COOKIE_NAME]]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET_KEY,
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
