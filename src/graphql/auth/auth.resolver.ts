import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { CurrentUser } from 'src/shared/decorators/CurrentUser';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthLoggedUserEntity } from './entities/logged-user.entity';
import { AuthCredentialInput } from './inputs/auth.credential.input';
import { AuthVerifyEmailInput } from './inputs/auth.verify-email.input';
import { UserEntity } from '../user/entities/user.entity';
import { AuthForgotPasswordInput } from './inputs/auth.forgot-password.input';
import { AuthVerifyForgotPasswordCodeInput } from './inputs/auth.verify-forgot-password-code.input';

export const AROUND_MORE_THAN_ONE_DAY_IN_MS = 100000000; // 27.7h

@Resolver(() => AuthLoggedUserEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthLoggedUserEntity)
  async authAuthenticate(
    @Args('credentials') credentials: AuthCredentialInput,
    @Context('res') res: Response
  ): Promise<AuthLoggedUserEntity> {
    return await this.authService.service('authenticate', { credentials, res });
  }

  @Mutation(() => AuthLoggedUserEntity)
  async verifyEmailActivation(
    @Args('data') data: AuthVerifyEmailInput,
    @Context('res') res: Response
  ): Promise<AuthLoggedUserEntity> {
    return await this.authService.service('authVerifyEmailActivation', {
      credentialVerificationCode: data.code,
      userId: data.userId,
      res,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async authSignOut(@Context('res') res: Response): Promise<boolean> {
    return await this.authService.service('authSignOut', { res });
  }

  @Mutation(() => Boolean)
  async authSignup(
    @Args('credentials') credentials: AuthCredentialInput,
    @Context('res') res: Response
  ): Promise<boolean> {
    return await this.authService.service('authSignUp', { credentials, res });
  }

  @Mutation(() => UserEntity)
  async authGetUserSession(@Args('xUserSessionToken') xUserSessionToken: string): Promise<Partial<UserEntity>> {
    return await this.authService.service('authGetUserSession', { xUserSessionToken });
  }

  @Mutation(() => Boolean)
  async authIsRequiredToDefinePassword(@Args('userId') userId: string): Promise<boolean> {
    return await this.authService.service('authIsRequiredToDefinePassword', { userId });
  }

  @Mutation(() => Boolean)
  async authIsRequiredToActiveAccount(@Args('userId') userId: string): Promise<boolean> {
    return await this.authService.service('authIsRequiredToActiveAccount', { userId });
  }

  @Query(() => UserEntity)
  async authVerifyUsername(@Args('username') username: string): Promise<UserEntity> {
    return await this.authService.service('authVerifyUsername', { username });
  }

  @Mutation(() => Boolean)
  async authRequestToChangePassword(@Args('username') username: string): Promise<boolean> {
    return await this.authService.service('authRequestToChangePassword', { username });
  }

  @Mutation(() => Boolean)
  async authResendWelcomeEmail(@Args('email') email: string): Promise<boolean> {
    return await this.authService.service('authResendWelcomeEmail', { username: email });
  }

  @Mutation(() => Boolean)
  async authUpdatePassword(@Args('data') data: AuthForgotPasswordInput): Promise<boolean> {
    return await this.authService.service('authUpdatePassword', data);
  }

  @Mutation(() => Boolean)
  async authItHasForgotPasswordCodeValid(@Args('data') data: AuthVerifyForgotPasswordCodeInput): Promise<boolean> {
    return await this.authService.service('authItHasForgotPasswordCodeValid', data);
  }
}
