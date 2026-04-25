/*
  Warnings:

  - You are about to drop the `Bank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bank" DROP CONSTRAINT "Bank_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_bankId_fkey";

-- DropTable
DROP TABLE "Bank";

-- CreateTable
CREATE TABLE "bank" (
    "id" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,

    CONSTRAINT "bank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bank" ADD CONSTRAINT "bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
