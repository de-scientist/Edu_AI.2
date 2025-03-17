/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ipAddress` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginHistory" ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "userAgent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationCode_key" ON "User"("verificationCode");
