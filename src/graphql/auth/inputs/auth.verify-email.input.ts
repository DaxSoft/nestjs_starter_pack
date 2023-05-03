import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AuthVerifyEmailInput {
  @IsString()
  @Field(() => String)
  userId: string;

  @IsString()
  @Field(() => String)
  code: string;
}
