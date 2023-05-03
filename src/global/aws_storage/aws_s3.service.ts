import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { PresignedUrlDto } from './dto/presigned-url.dto';
import { env } from 'src/env';

const CACHE_CONTROL_MAX_AGE = 60000;

@Injectable()
export class AWS_S3Service {
  constructor(private configService: ConfigService) {}

  private bucketName = env.AMAZON_S3_BUCKET_REGION;
  private client = new S3({
    credentials: {
      accessKeyId: env.AMAZON_IAM_USER_PUBLIC_KEY,
      secretAccessKey: env.AMAZON_IAM_USER_SECRET_KEY,
    },
    region: env.AMAZON_S3_BUCKET_REGION,
  });

  async generatePresignedUrl(key: string, fileType: string): Promise<PresignedUrlDto> {
    // const conditions = [['starts-with', '$Content-Type', 'image/']];
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: CACHE_CONTROL_MAX_AGE });

    return {
      url,
      key,
    };
  }

  async deleteFile(Key: string): Promise<boolean> {
    try {
      let output = await this.client.deleteObject({
        Bucket: this.bucketName,
        Key,
      });

      return !!output?.DeleteMarker;
    } catch (error) {
      return false;
    }
  }

  getFileKeyFromURL(url: string): string | undefined {
    const rule = /[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/giu;
    const match = url.match(rule);
    const value = match ? match[0] : undefined;
    return !!value ? value : undefined;
  }
}
