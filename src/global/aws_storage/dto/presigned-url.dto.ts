import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PresignedUrlDto {
  @Field(() => String)
  url: string;

  @Field(() => String)
  key: string;
}
