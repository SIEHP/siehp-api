-- AlterTable
ALTER TABLE "user_permissions" ALTER COLUMN "created_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_by" DROP NOT NULL;
