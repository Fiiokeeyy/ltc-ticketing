CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(500) NOT NULL,
	`author` text(200) NOT NULL,
	`price` integer NOT NULL,
	`stock` integer NOT NULL,
	`description` text(2000),
	CONSTRAINT "price_check" CHECK("books"."price" >= 0),
	CONSTRAINT "stock_check" CHECK("books"."stock" >= 0)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text(200) NOT NULL,
	`description` text(2000),
	`poster_url` text(500),
	`show_date` integer NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "title_check" CHECK(LENGTH("events"."title") > 0)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`ticket_id` text,
	`book_id` text,
	`quantity` integer NOT NULL,
	`subtotal` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "quantity_check" CHECK("order_items"."quantity" >= 1),
	CONSTRAINT "subtotal_check" CHECK("order_items"."subtotal" >= 0),
	CONSTRAINT "item_type_check" CHECK(("order_items"."ticket_id" IS NOT NULL AND "order_items"."book_id" IS NULL) OR ("order_items"."ticket_id" IS NULL AND "order_items"."book_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`total_amount` integer NOT NULL,
	`status` text(50) DEFAULT 'PENDING' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "total_check" CHECK("orders"."total_amount" >= 0),
	CONSTRAINT "status_check" CHECK("orders"."status" IN ('PENDING', 'PAID', 'CANCELLED'))
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`category_name` text NOT NULL,
	`price` integer NOT NULL,
	`stock_quota` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "price_check" CHECK("tickets"."price" >= 0),
	CONSTRAINT "stock_check" CHECK("tickets"."stock_quota" >= 0)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(320) NOT NULL,
	`role` text(50) NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "role_check" CHECK("users"."role" IN ('ADMIN', 'CUSTOMER')),
	CONSTRAINT "email_check" CHECK("users"."email" LIKE '%@%.%')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);