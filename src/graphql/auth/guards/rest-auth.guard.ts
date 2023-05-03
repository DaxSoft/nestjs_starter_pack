import { AuthGuard } from '@nestjs/passport';

export class RestAuthGuard extends AuthGuard('jwt') {}
