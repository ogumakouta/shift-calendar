/*
  Warnings:

  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `birthday` DATE NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `password_hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `self_introduction` TEXT NULL,
    ADD COLUMN `tel` VARCHAR(20) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(20) NULL;

-- CreateTable
CREATE TABLE `Blog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
