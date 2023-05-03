import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AuthVerifyForgotPasswordCodeInput {
  @IsString()
  @Field(() => String)
  credentialId: string;

  @IsString()
  @Field(() => String)
  code: string;
}
