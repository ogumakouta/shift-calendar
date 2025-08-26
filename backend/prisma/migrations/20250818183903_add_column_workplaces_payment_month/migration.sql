-- AlterTable
ALTER TABLE `workplaces` ADD COLUMN `payment_month` ENUM('current', 'next', 'after_next') NOT NULL DEFAULT 'current';
