-- AlterTable
ALTER TABLE "image" ADD COLUMN     "copyright" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "pick_date" TIMESTAMP(3),
ADD COLUMN     "piece_state" TEXT,
ADD COLUMN     "tissue" TEXT;
