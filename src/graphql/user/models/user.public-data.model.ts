import { Prisma } from '@prisma/client';

export const USER_PUBLIC_SELECT_DATA: Prisma.UserSelect = {
  role: true,
  username: true,
  UserCredentials: {
    select: {
      isEmailVerified: true,
    },
  },
  UserProfile: {
    select: {
      fullname: true,
    },
  },
};
