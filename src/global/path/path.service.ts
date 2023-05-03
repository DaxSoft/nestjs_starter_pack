import { Injectable, OnModuleInit } from '@nestjs/common';
import { PathRoute } from '@vorlefan/path';

@Injectable()
export class PathRouteService extends PathRoute implements OnModuleInit {
  async onModuleInit() {
    this.add('.', __dirname)
      .add('root', this.backward('.', 2))
      .inject('uploads', 'root')
      .inject('uploads/users', 'uploads', 'users')
      .inject('uploads/properties', 'uploads', 'properties')
      .foldersJoin('root')
      .add('@emails', this.plug('root/src', 'global/email/emails/template'));
  }
}
