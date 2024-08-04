-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "osVersion" TEXT NOT NULL,
    "imei" TEXT NOT NULL,
    "accessories" TEXT NOT NULL,
    "conditionNotes" TEXT NOT NULL,
    "dateAddedToInventory" DATETIME NOT NULL,
    "dateCheckedOut" DATETIME,
    "dateReturned" DATETIME,
    "previousOwnerId" TEXT,
    "personId" TEXT,
    CONSTRAINT "Device_previousOwnerId_fkey" FOREIGN KEY ("previousOwnerId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Device_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
