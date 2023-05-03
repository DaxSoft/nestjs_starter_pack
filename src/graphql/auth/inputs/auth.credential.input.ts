import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AuthCredentialInput {
  @Field(() => String)
  login: string;

  @Field(() => String)
  username?: string;

  @Field(() => String, { nullable: true })
  fullname?: string;

  @IsString()
  @Field(() => String)
  password: string;
}
