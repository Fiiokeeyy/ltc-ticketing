PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`customer_name` text(255) NOT NULL,
	`customer_email` text(320) NOT NULL,
	`customer_whatsapp` text(20) NOT NULL,
	`ticket_category` text(50) NOT NULL,
	`ticket_quantity` integer NOT NULL,
	`total_amount` integer NOT NULL,
	`payment_method` text DEFAULT 'bank_transfer' NOT NULL,
	`payment_proof_url` text(500),
	`status` text(50) DEFAULT 'pending_payment' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "quantity_check" CHECK("__new_transactions"."ticket_quantity" >= 1),
	CONSTRAINT "total_check" CHECK("__new_transactions"."total_amount" >= 0),
	CONSTRAINT "status_check" CHECK("__new_transactions"."status" IN ('pending_payment', 'pending_verification', 'verified', 'rejected', 'cancelled')),
	CONSTRAINT "email_check" CHECK("__new_transactions"."customer_email" LIKE '%@%.%')
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "event_id", "customer_name", "customer_email", "customer_whatsapp", "ticket_category", "ticket_quantity", "total_amount", "payment_method", "payment_proof_url", "status", "created_at") SELECT "id", "event_id", "customer_name", "customer_email", "customer_whatsapp", "ticket_category", "ticket_quantity", "total_amount", "payment_method", "payment_proof_url", "status", "created_at" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;