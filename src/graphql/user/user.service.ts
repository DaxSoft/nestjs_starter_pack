import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { EmailService } from 'src/global/email/email.service';
import * as services from './services';
import { z } from 'zod';
import { RedisService } from 'src/global/redis/redis.service';

type ServiceKeyof = keyof typeof services;
type ServiceContext<K extends ServiceKeyof> = z.infer<(typeof services)[K]['context']>;
type ServiceResult<K extends ServiceKeyof> = z.infer<(typeof services)[K]['result']>;

export type UserServiceConstructorContext = {
  prisma: PrismaService;
  emailService: EmailService;
  redis: RedisService;
};

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService, private emailService: EmailService, private redis: RedisService) {}

  async service<T extends ServiceKeyof>(key: T, data: ServiceContext<T>): Promise<ServiceResult<T>> {
    const service = services[key];
    return await service.default(
      {
        emailService: this.emailService,
        prisma: this.prismaService,
        redis: this.redis,
      },
      data
    );
  }
}
