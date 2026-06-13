CREATE TABLE `testimonials` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`rating` integer NOT NULL,
	`message` text(1000) NOT NULL,
	`status` text(20) DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "rating_check" CHECK("testimonials"."rating" >= 1 AND "testimonials"."rating" <= 5),
	CONSTRAINT "status_check" CHECK("testimonials"."status" IN ('pending', 'approved', 'rejected')),
	CONSTRAINT "name_check" CHECK(LENGTH("testimonials"."name") > 0),
	CONSTRAINT "message_check" CHECK(LENGTH("testimonials"."message") > 0)
);
