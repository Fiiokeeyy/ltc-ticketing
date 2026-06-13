CREATE TABLE `transactions` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`customer_name` text(255) NOT NULL,
	`customer_email` text(320) NOT NULL,
	`customer_whatsapp` text(20) NOT NULL,
	`ticket_quantity` integer NOT NULL,
	`total_amount` integer NOT NULL,
	`payment_proof_url` text(500),
	`status` text(50) DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "quantity_check" CHECK("transactions"."ticket_quantity" >= 1),
	CONSTRAINT "total_check" CHECK("transactions"."total_amount" >= 0),
	CONSTRAINT "status_check" CHECK("transactions"."status" IN ('pending', 'verified', 'rejected')),
	CONSTRAINT "email_check" CHECK("transactions"."customer_email" LIKE '%@%.%')
);
