/*
  Warnings:

  - A unique constraint covering the columns `[profile_image_url]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profile_image_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_profile_image_url_key" ON "users"("profile_image_url");
