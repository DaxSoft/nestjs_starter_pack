import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

@ObjectType()
export class UserProfileEntity {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  fullname?: string;

  @Field(() => [UserEntity], { nullable: true })
  User?: UserEntity[];
}
