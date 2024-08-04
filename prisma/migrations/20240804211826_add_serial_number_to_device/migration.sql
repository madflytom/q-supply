/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN "serialNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");
