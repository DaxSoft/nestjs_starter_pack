import { User as UserSchema } from '.prisma/client';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/shared/decorators/CurrentUser';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntity)
  @UseGuards(GqlAuthGuard)
  async userGetById(
    @Args('userId', { type: () => String }) userId: string,
    @CurrentUser() user: UserSchema
  ): Promise<UserEntity> {
    return await this.userService.service('getById', { userId });
  }

  @Query((returns) => UserEntity)
  @UseGuards(GqlAuthGuard)
  async userGetCurrent(@CurrentUser() user: UserSchema): Promise<UserEntity> {
    return user;
  }
}
