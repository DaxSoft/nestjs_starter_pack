import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AWS_S3Service } from './aws_s3.service';
import { PresignedUrlDto } from './dto/presigned-url.dto';

@Resolver()
export class AWS_S3Resolver {
  constructor(private readonly awsService: AWS_S3Service) {}

  @Mutation(() => PresignedUrlDto)
  async generatePresignedUrl(@Args('key') key: string, @Args('fileType') fileType: string): Promise<PresignedUrlDto> {
    return this.awsService.generatePresignedUrl(key, fileType);
  }
}
