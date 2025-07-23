/*
  Warnings:

  - You are about to drop the `Blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Blog` DROP FOREIGN KEY `Blog_user_id_fkey`;

-- DropTable
DROP TABLE `Blog`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `birthday` DATE NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workplaces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` TEXT NULL,
    `closing_day` INTEGER NOT NULL,
    `payment_day` INTEGER NOT NULL,
    `hourly_wage` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `workplace_id` INTEGER NULL,
    `is_allday` BOOLEAN NOT NULL DEFAULT false,
    `start_time` DATETIME(3) NOT NULL,
    `finish_time` DATETIME(3) NOT NULL,
    `break_minutes` INTEGER NOT NULL DEFAULT 0,
    `location` TEXT NULL,
    `memo` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_labels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `color` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `workplaces` ADD CONSTRAINT `workplaces_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_workplace_id_fkey` FOREIGN KEY (`workplace_id`) REFERENCES `workplaces`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
