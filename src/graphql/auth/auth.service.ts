import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/global/email/email.service';
import { PrismaService } from 'src/global/prisma/prisma.service';
import * as services from './services';
import { z } from 'zod';
import { RedisService } from 'src/global/redis/redis.service';

type ServiceKeyof = keyof typeof services;
type ServiceContext<K extends ServiceKeyof> = z.infer<typeof services[K]['context']>;
type ServiceResult<K extends ServiceKeyof> = z.infer<typeof services[K]['result']>;

export type AuthServiceConstructorContext = {
  jwtService: JwtService;
  prisma: PrismaService;
  emailService: EmailService;
  authService: AuthService;
  redis: RedisService;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private emailService: EmailService,
    private redis: RedisService
  ) {}

  generateTokenByUserId(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  async service<T extends ServiceKeyof>(key: T, data: ServiceContext<T>): Promise<ServiceResult<T>> {
    const service = services[key];
    return await service.default(
      {
        authService: this,
        emailService: this.emailService,
        jwtService: this.jwtService,
        prisma: this.prismaService,
        redis: this.redis,
      },
      data
    );
  }
}
