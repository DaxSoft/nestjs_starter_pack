import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log('Serializer User', user);
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    // const user = await this.authService.findUser(payload.id);
    const user = {};
    console.log('Deserialize User', { payload, user });

    return user ? done(null, user) : done(null, null);
  }
}
