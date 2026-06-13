import { sqliteTable, text, integer, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users Table
export const users = sqliteTable(
  "users",
  {
    id: text("id", { length: 255 }).primaryKey().notNull(),
    name: text("name", { length: 255 }).notNull(),
    email: text("email", { length: 320 }).notNull().unique(),
    role: text("role", { length: 50 }).notNull(),
    // Nullable: hanya diisi untuk akun Admin & Gate, bukan Customer
    password: text("password", { length: 255 }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    roleCheck: check("role_check", sql`${table.role} IN ('ADMIN', 'GATE', 'CUSTOMER')`),
    emailCheck: check("email_check", sql`${table.email} LIKE '%@%.%'`),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Events Table
export const events = sqliteTable(
  "events",
  {
    id: text("id", { length: 36 }).primaryKey().notNull(),
    title: text("title", { length: 200 }).notNull(),
    description: text("description", { length: 2000 }),
    posterUrl: text("poster_url", { length: 500 }),
    showDate: integer("show_date", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    titleCheck: check("title_check", sql`LENGTH(${table.title}) > 0`),
  }),
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
// Tickets Table
export const tickets = sqliteTable(
  "tickets",
  {
    id: text("id").primaryKey().notNull(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    categoryName: text("category_name").notNull(),
    price: integer("price").notNull(),
    stockQuota: integer("stock_quota").notNull(),
  },
  (table) => ({
    priceCheck: check("price_check", sql`${table.price} >= 0`),
    stockCheck: check("stock_check", sql`${table.stockQuota} >= 0`),
  }),
);

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;

// Orders Table
export const orders = sqliteTable(
  "orders",
  {
    id: text("id", { length: 255 }).primaryKey().notNull(),
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    totalAmount: integer("total_amount").notNull(),
    status: text("status", { length: 50 }).notNull().default("PENDING"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    totalCheck: check("total_check", sql`${table.totalAmount} >= 0`),
    statusCheck: check(
      "status_check",
      sql`${table.status} IN ('PENDING', 'PAID', 'CANCELLED')`,
    ),
  }),
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
// Order Items Table
export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey().notNull(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    ticketId: text("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    subtotal: integer("subtotal").notNull(),
  },
  (table) => ({
    quantityCheck: check("quantity_check", sql`${table.quantity} >= 1`),
    subtotalCheck: check("subtotal_check", sql`${table.subtotal} >= 0`),
  }),
);

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

// Transactions Table (Guest Checkout with Manual Payment Verification)
export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id", { length: 36 }).primaryKey().notNull(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "restrict" }),
    customerName: text("customer_name", { length: 255 }).notNull(),
    customerEmail: text("customer_email", { length: 320 }).notNull(),
    customerWhatsapp: text("customer_whatsapp", { length: 20 }).notNull(),
    ticketCategory: text("ticket_category", { length: 50 }).notNull(),
    ticketQuantity: integer("ticket_quantity").notNull(),
    totalAmount: integer("total_amount").notNull(),
    paymentMethod: text("payment_method").notNull().default("bank_transfer"),
    paymentProofUrl: text("payment_proof_url", { length: 500 }),
    status: text("status", { length: 50 }).notNull().default("pending_payment"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    quantityCheck: check("quantity_check", sql`${table.ticketQuantity} >= 1`),
    totalCheck: check("total_check", sql`${table.totalAmount} >= 0`),
    statusCheck: check(
      "status_check",
      sql`${table.status} IN ('pending_payment', 'pending_verification', 'verified', 'rejected')`,
    ),
    emailCheck: check("email_check", sql`${table.customerEmail} LIKE '%@%.%'`),
  }),
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

// Testimonials Table (Dynamic User Reviews with Admin Moderation)
export const testimonials = sqliteTable(
  "testimonials",
  {
    id: text("id", { length: 36 }).primaryKey().notNull(),
    name: text("name", { length: 255 }).notNull(),
    rating: integer("rating").notNull(),
    message: text("message", { length: 1000 }).notNull(),
    status: text("status", { length: 20 }).notNull().default("pending"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    ratingCheck: check(
      "rating_check",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
    statusCheck: check(
      "status_check",
      sql`${table.status} IN ('pending', 'approved', 'rejected')`,
    ),
    nameCheck: check("name_check", sql`LENGTH(${table.name}) > 0`),
    messageCheck: check("message_check", sql`LENGTH(${table.message}) > 0`),
  }),
);

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

// Payment Methods Table
export const paymentMethods = sqliteTable(
  "payment_methods",
  {
    id: text("id", { length: 36 }).primaryKey().notNull(),
    name: text("name", { length: 255 }).notNull(),
    type: text("type", { length: 50 }).notNull(),
    instruction: text("instruction", { length: 500 }).notNull(),
    accountNumber: text("account_number", { length: 100 }),
    accountName: text("account_name", { length: 255 }),
    qrImageUrl: text("qr_image_url", { length: 500 }),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    typeCheck: check("type_check", sql`${table.type} IN ('qris', 'bank_transfer', 'e_wallet')`),
    nameCheck: check("name_check", sql`LENGTH(${table.name}) > 0`),
  })
);

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
