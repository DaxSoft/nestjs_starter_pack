import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

@ObjectType()
export class UserCredentialsEntity {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Boolean, { nullable: true })
  isEmailVerified?: boolean;

  @Field(() => Boolean, { nullable: true })
  isPhoneNumberVerified?: boolean;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  googleId?: string;

  @Field(() => String, { nullable: true })
  twitterId?: string;

  @Field(() => String, { nullable: true })
  magicLinkCode?: string;

  @Field(() => String, { nullable: true })
  multiFactorCode?: string;

  @Field(() => String, { nullable: true })
  credentialVerificationCode?: string;

  @Field(() => String, { nullable: true })
  codeToChangePassword?: string;

  @Field(() => String, { nullable: true })
  stripeCustomerId?: string;

  @Field(() => String, { nullable: true })
  stripeApiKey?: string;

  @Field(() => [UserEntity], { nullable: true })
  User?: UserEntity[];
}
