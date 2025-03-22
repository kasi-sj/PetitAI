/*
  Warnings:

  - The values [Male,Female,Other] on the enum `GenderEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [Low,Medium,High,Critical] on the enum `PriorityEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [Error,Submitted,Queued,Category_Assigned,Assigned,Delegated,Forwarded,Processing,Repeated_Rejection,Rejected,Processed] on the enum `StatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GenderEnum_new" AS ENUM ('MALE', 'FEMALE', 'OTHER');
ALTER TABLE "User" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "gender" TYPE "GenderEnum_new" USING ("gender"::text::"GenderEnum_new");
ALTER TYPE "GenderEnum" RENAME TO "GenderEnum_old";
ALTER TYPE "GenderEnum_new" RENAME TO "GenderEnum";
DROP TYPE "GenderEnum_old";
ALTER TABLE "User" ALTER COLUMN "gender" SET DEFAULT 'OTHER';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PriorityEnum_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
ALTER TABLE "Petition" ALTER COLUMN "priority" TYPE "PriorityEnum_new" USING ("priority"::text::"PriorityEnum_new");
ALTER TYPE "PriorityEnum" RENAME TO "PriorityEnum_old";
ALTER TYPE "PriorityEnum_new" RENAME TO "PriorityEnum";
DROP TYPE "PriorityEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StatusEnum_new" AS ENUM ('ERROR', 'SUBMITTED', 'QUEUED', 'CATEGORY_ASSIGNED', 'ASSIGNED', 'DELEGATED', 'FORWARDED', 'PROCESSING', 'REPEATED_REJECTION', 'REJECTED', 'PROCESSED');
ALTER TABLE "StatusUpdate" ALTER COLUMN "status" TYPE "StatusEnum_new" USING ("status"::text::"StatusEnum_new");
ALTER TYPE "StatusEnum" RENAME TO "StatusEnum_old";
ALTER TYPE "StatusEnum_new" RENAME TO "StatusEnum";
DROP TYPE "StatusEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "gender" SET DEFAULT 'OTHER';
