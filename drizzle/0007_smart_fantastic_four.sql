CREATE TABLE `payment_methods` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`type` text(50) NOT NULL,
	`instruction` text(500) NOT NULL,
	`account_number` text(100),
	`account_name` text(255),
	`qr_image_url` text(500),
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "type_check" CHECK("payment_methods"."type" IN ('qris', 'bank_transfer', 'e_wallet')),
	CONSTRAINT "name_check" CHECK(LENGTH("payment_methods"."name") > 0)
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(320) NOT NULL,
	`role` text(50) NOT NULL,
	`password` text(255),
	`created_at` integer NOT NULL,
	CONSTRAINT "role_check" CHECK("__new_users"."role" IN ('ADMIN', 'GATE', 'CUSTOMER')),
	CONSTRAINT "email_check" CHECK("__new_users"."email" LIKE '%@%.%')
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "role", "password", "created_at") SELECT "id", "name", "email", "role", "password", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);