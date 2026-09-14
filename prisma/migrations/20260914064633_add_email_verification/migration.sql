/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "emailVerified",
DROP COLUMN "verificationToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationToken" TEXT;
