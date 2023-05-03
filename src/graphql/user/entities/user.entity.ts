import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { UserCredentialsEntity } from './user.credentials.entity';
import { UserProfileEntity } from './user.profile.entity';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class UserEntity {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Number, { nullable: true })
  index?: number;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => UserRole, { nullable: true, defaultValue: UserRole.CLIENT })
  role?: UserRole;

  @Field(() => UserCredentialsEntity, { nullable: true })
  UserCredentials?: UserCredentialsEntity;

  @Field(() => String, { nullable: true })
  userCredentialsId?: string;

  @Field(() => UserProfileEntity, { nullable: true })
  UserProfile?: UserProfileEntity;

  @Field(() => String, { nullable: true })
  userProfileId?: string;
}
