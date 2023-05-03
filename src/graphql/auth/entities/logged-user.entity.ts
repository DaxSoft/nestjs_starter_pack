import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthLoggedUserEntity {
  @Field(() => String)
  xUserSessionToken: string;
}
