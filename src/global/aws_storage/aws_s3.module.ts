import { Global, Module } from '@nestjs/common';
import { AWS_S3Service } from './aws_s3.service';
import { ConfigModule } from '@nestjs/config';
import { AWS_S3Resolver } from './aws_s3.resolver';

@Global()
@Module({
  providers: [AWS_S3Service, AWS_S3Resolver],
  exports: [AWS_S3Service],
  imports: [ConfigModule],
})
export class AWS_S3Module {}
