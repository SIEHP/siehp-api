/*
  Warnings:

  - A unique constraint covering the columns `[permission_id,included_permission_id]` on the table `included_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,permission_id]` on the table `user_permissions` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Permissions" AS ENUM ('MANTER_PROFESSORES', 'MANTER_ALUNOS', 'MANTER_ADMINISTRADORES', 'MANTER_IMAGENS', 'MANTER_TURMAS', 'MANTER_CONTEUDOS', 'MANTER_ATIVIDADES', 'ACESSAR_TURMAS', 'ACESSAR_CONTEUDOS', 'ACESSAR_ATIVIDADES', 'ACESSAR_IMAGENS', 'ACESSAR_LOGS', 'CORRIGIR_ATIVIDADES', 'RESPONDER_ATIVIDADES');

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "name",
ADD COLUMN     "name" "Permissions" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "included_permissions_permission_id_included_permission_id_key" ON "included_permissions"("permission_id", "included_permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_permission_id_key" ON "user_permissions"("user_id", "permission_id");
