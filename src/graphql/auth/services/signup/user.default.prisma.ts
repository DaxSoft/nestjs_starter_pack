import { Prisma } from '@prisma/client';

export const USER_DEFAULT_DATA: Omit<Prisma.UserCreateInput, 'username' | 'UserCredentials' | 'UserProfile'> = {
  UserAchievements: {
    createMany: { data: [] },
  },
  UserInbox: {
    create: {
      UserInboxNotification: {
        createMany: {
          data: [],
        },
      },
    },
  },
  UserInboxNotification: {
    createMany: {
      data: [],
    },
  },
  UserProfileFollower: {
    createMany: { data: [] },
  },
  UserStats: {
    create: {},
  },
  UserSettings: {
    create: {
      UserSettingsNotifications: {
        create: {},
      },
    },
  },
  UserWriter: {
    create: {
      Books: {
        createMany: { data: [] },
      },
    },
  },
  MarketplaceProject: {
    createMany: { data: [] },
  },
  NPS: {
    createMany: { data: [] },
  },
  BookChapterPollsOptions: {
    createMany: { data: [] },
  },
  BookCollaborators: {
    createMany: { data: [] },
  },
  BookIncomeHistoric: {
    createMany: { data: [] },
  },
  BookReaderReviewReplies: {
    createMany: { data: [] },
  },
  BookReaders: {
    createMany: { data: [] },
  },
  BookReport: {
    createMany: { data: [] },
  },
};
