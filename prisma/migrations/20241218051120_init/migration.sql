/*
  Warnings:

  - You are about to drop the `user_login` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_register` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user_login";

-- DropTable
DROP TABLE "user_register";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "hash_password" TEXT NOT NULL,
    "phonenumber" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phonenumber_key" ON "users"("phonenumber");
