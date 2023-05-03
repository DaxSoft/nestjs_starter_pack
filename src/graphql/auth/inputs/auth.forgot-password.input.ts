import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AuthForgotPasswordInput {
  @Field(() => String)
  credentialId: string;

  @IsString()
  @Field(() => String)
  newPassword: string;

  @IsString()
  @Field(() => String)
  repeatNewPassword: string;
}
