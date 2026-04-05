/*
  Warnings:

  - You are about to drop the column `valor` on the `credit_cards` table. All the data in the column will be lost.
  - Added the required column `closingDay` to the `credit_cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDay` to the `credit_cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limit` to the `credit_cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_cards" DROP COLUMN "valor",
ADD COLUMN     "closingDay" INTEGER NOT NULL,
ADD COLUMN     "dueDay" INTEGER NOT NULL,
ADD COLUMN     "is_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "limit" DOUBLE PRECISION NOT NULL;
