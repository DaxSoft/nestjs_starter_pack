import { Test, TestingModule } from '@nestjs/testing';
import { AWS_S3 } from './aws_s3.service';

describe('AWS_S3', () => {
  let service: AWS_S3;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AWS_S3],
    }).compile();

    service = module.get<AWS_S3>(AWS_S3);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
