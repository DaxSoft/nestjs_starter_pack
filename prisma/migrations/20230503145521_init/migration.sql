-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "index" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "category" TEXT NOT NULL DEFAULT 'NORMAL',
    "userCredentialsId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCredentials" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "isPhoneNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,
    "twitterId" TEXT,
    "magicLinkCode" TEXT,
    "multiFactorCode" TEXT,
    "credentialVerificationCode" TEXT,
    "codeToChangePassword" TEXT,

    CONSTRAINT "UserCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserCredentials_email_key" ON "UserCredentials"("email");

-- CreateIndex
CREATE INDEX "UserCredentials_email_idx" ON "UserCredentials"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userCredentialsId_fkey" FOREIGN KEY ("userCredentialsId") REFERENCES "UserCredentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
