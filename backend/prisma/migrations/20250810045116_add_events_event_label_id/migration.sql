-- AlterTable
ALTER TABLE `events` ADD COLUMN `event_label_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_event_label_id_fkey` FOREIGN KEY (`event_label_id`) REFERENCES `event_labels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
