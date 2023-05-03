import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimeStamps {
  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;
}
