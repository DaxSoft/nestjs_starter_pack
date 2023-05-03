import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
export abstract class PaginationDTO {
  @Field((type) => Int)
  offset: number = 0;

  @Field((type) => Int)
  limit: number = 10;
}
