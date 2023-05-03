import { Global, Module } from '@nestjs/common';
import { PathRouteService } from './path.service';

@Global()
@Module({
  providers: [PathRouteService],
  exports: [PathRouteService],
})
export class PathRouteModule {}
