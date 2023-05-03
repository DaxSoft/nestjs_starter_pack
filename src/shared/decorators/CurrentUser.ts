import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  let user = null;

  if (context.getType() === 'http') {
    user = context.switchToHttp().getRequest().user;
  } else {
    const ctx = GqlExecutionContext.create(context);
    user = ctx.getContext().req.user;
  }

  if (!user) {
    throw new HttpException('[DEV] Guard not implemented', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return user;
});
