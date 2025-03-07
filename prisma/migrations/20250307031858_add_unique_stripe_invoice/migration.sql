/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_paymentId_fkey";

-- DropIndex
DROP INDEX "Invoice_paymentId_key";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "paymentId",
ADD COLUMN     "invoiceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceId_key" ON "Invoice"("invoiceId");
