DROP TABLE `books`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`ticket_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`subtotal` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "quantity_check" CHECK("__new_order_items"."quantity" >= 1),
	CONSTRAINT "subtotal_check" CHECK("__new_order_items"."subtotal" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_order_items`("id", "order_id", "ticket_id", "quantity", "subtotal") SELECT "id", "order_id", "ticket_id", "quantity", "subtotal" FROM `order_items`;--> statement-breakpoint
DROP TABLE `order_items`;--> statement-breakpoint
ALTER TABLE `__new_order_items` RENAME TO `order_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;