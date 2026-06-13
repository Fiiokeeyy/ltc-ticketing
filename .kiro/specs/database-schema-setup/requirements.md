# Requirements Document

## Introduction

This document specifies the requirements for setting up a database schema and Drizzle ORM integration for an e-ticketing and bookstore web application. The system will use Turso (libSQL) as the database provider and Drizzle ORM for type-safe database operations in a Next.js App Router environment.

## Glossary

- **Schema_Module**: The TypeScript module that defines database table structures using Drizzle ORM syntax
- **Database_Client**: The configured Drizzle client instance connected to Turso database
- **Turso**: A distributed SQLite database service (libSQL)
- **User**: A person who interacts with the system (customer or administrator)
- **Event**: A scheduled occurrence for which tickets can be purchased
- **Ticket**: A purchasable item granting access to a specific event
- **Book**: A purchasable physical or digital book item
- **Order**: A transaction record containing one or more purchased items
- **Order_Item**: A line item within an order representing a single product purchase

## Requirements

### Requirement 1: Define User Table Schema

**User Story:** As a developer, I want to define a users table schema, so that I can store user account information with role-based access control.

#### Acceptance Criteria

1. THE Schema_Module SHALL define a users table with an id column of type text with maximum length of 255 characters as primary key
2. THE Schema_Module SHALL define a name column of type text with maximum length of 255 characters and NOT NULL constraint in the users table
3. THE Schema_Module SHALL define an email column of type text with maximum length of 320 characters, UNIQUE constraint, and NOT NULL constraint in the users table
4. THE Schema_Module SHALL define a role column of type text with maximum length of 50 characters and NOT NULL constraint in the users table
5. THE Schema_Module SHALL define a created_at column of type integer representing Unix timestamp in seconds with NOT NULL constraint in the users table
6. THE Schema_Module SHALL constrain the role column to contain only the values "ADMIN" or "CUSTOMER"
7. THE Schema_Module SHALL constrain the email column to match the pattern of one or more characters, followed by "@", followed by one or more characters, followed by ".", followed by one or more characters

### Requirement 2: Define Event Table Schema

**User Story:** As a developer, I want to define an events table schema, so that I can store event information for ticket sales.

#### Acceptance Criteria

1. THE Schema_Module SHALL define an events table with an id column of type text with maximum length of 36 characters as primary key with NOT NULL constraint
2. THE Schema_Module SHALL define a title column of type text with maximum length of 200 characters with NOT NULL constraint in the events table
3. THE Schema_Module SHALL define a description column of type text with maximum length of 2000 characters as nullable in the events table
4. THE Schema_Module SHALL define a show_date column of type integer representing Unix timestamp in seconds with NOT NULL constraint in the events table
5. THE Schema_Module SHALL define a created_at column of type integer representing Unix timestamp in seconds with NOT NULL constraint in the events table
6. THE Schema_Module SHALL reject title values that are empty strings

### Requirement 3: Define Ticket Table Schema

**User Story:** As a developer, I want to define a tickets table schema, so that I can store ticket inventory linked to events.

#### Acceptance Criteria

1. THE Schema_Module SHALL define a tickets table with an id column of type text as primary key with NOT NULL constraint
2. THE Schema_Module SHALL define an event_id column of type text as foreign key referencing events.id with CASCADE on delete and NOT NULL constraint in the tickets table
3. THE Schema_Module SHALL define a category_name column of type text with NOT NULL constraint in the tickets table
4. THE Schema_Module SHALL define a price column of type integer with constraint greater than or equal to 0 and NOT NULL constraint in the tickets table
5. THE Schema_Module SHALL define a stock_quota column of type integer with constraint greater than or equal to 0 and NOT NULL constraint in the tickets table

### Requirement 4: Define Book Table Schema

**User Story:** As a developer, I want to define a books table schema, so that I can store book inventory for sale.

#### Acceptance Criteria

1. THE Schema_Module SHALL define a books table with an id column of type text as primary key with NOT NULL constraint
2. THE Schema_Module SHALL define a title column of type text with maximum length of 500 characters with NOT NULL constraint in the books table
3. THE Schema_Module SHALL define an author column of type text with maximum length of 200 characters with NOT NULL constraint in the books table
4. THE Schema_Module SHALL define a price column of type integer with constraint greater than or equal to 0 with NOT NULL constraint in the books table
5. THE Schema_Module SHALL define a stock column of type integer with constraint greater than or equal to 0 with NOT NULL constraint in the books table
6. THE Schema_Module SHALL define a description column of type text with maximum length of 2000 characters as nullable in the books table

### Requirement 5: Define Order Table Schema

**User Story:** As a developer, I want to define an orders table schema, so that I can track customer purchases and payment status.

#### Acceptance Criteria

1. THE Schema_Module SHALL define an orders table with an id column of type text with maximum length of 255 characters as primary key with NOT NULL constraint
2. THE Schema_Module SHALL define a user_id column of type text with maximum length of 255 characters as foreign key referencing users.id with RESTRICT on delete with NOT NULL constraint in the orders table
3. THE Schema_Module SHALL define a total_amount column of type integer representing amount in smallest currency unit (e.g., cents) with constraint greater than or equal to 0 with NOT NULL constraint in the orders table
4. THE Schema_Module SHALL define a status column of type text with maximum length of 50 characters with NOT NULL constraint with default value "PENDING" in the orders table
5. THE Schema_Module SHALL define a created_at column of type integer representing Unix timestamp in seconds with NOT NULL constraint in the orders table
6. THE Schema_Module SHALL constrain the status column to contain only the values "PENDING", "PAID", or "CANCELLED"

### Requirement 6: Define Order Items Table Schema

**User Story:** As a developer, I want to define an order_items table schema, so that I can store individual line items for each order with support for both tickets and books.

#### Acceptance Criteria

1. THE Schema_Module SHALL define an order_items table with an id column of type text as primary key with NOT NULL constraint
2. THE Schema_Module SHALL define an order_id column of type text as foreign key referencing orders.id with CASCADE on delete with NOT NULL constraint in the order_items table
3. THE Schema_Module SHALL define a ticket_id column of type text as nullable foreign key referencing tickets.id with RESTRICT on delete in the order_items table
4. THE Schema_Module SHALL define a book_id column of type text as nullable foreign key referencing books.id with RESTRICT on delete in the order_items table
5. THE Schema_Module SHALL define a quantity column of type integer with constraint greater than or equal to 1 with NOT NULL constraint in the order_items table
6. THE Schema_Module SHALL define a subtotal column of type integer with constraint greater than or equal to 0 with NOT NULL constraint in the order_items table
7. THE Schema_Module SHALL enforce that exactly one of ticket_id or book_id is non-null for each order_items record
8. THE Schema_Module SHALL reject order_items records where both ticket_id and book_id are null
9. THE Schema_Module SHALL reject order_items records where both ticket_id and book_id are non-null

### Requirement 7: Initialize Database Connection

**User Story:** As a developer, I want to initialize a Drizzle database client connected to Turso, so that I can perform type-safe database operations throughout the application.

#### Acceptance Criteria

1. THE Database_Client SHALL connect to Turso using the TURSO_CONNECTION_URL environment variable
2. THE Database_Client SHALL authenticate with Turso using the TURSO_AUTH_TOKEN environment variable
3. THE Database_Client SHALL be exported from the database module for application-wide use
4. THE Database_Client SHALL use the libSQL client adapter for Turso connectivity
5. WHEN TURSO_CONNECTION_URL environment variable is undefined or empty string, THE Database_Client initialization SHALL throw an error with message "TURSO_CONNECTION_URL is required"
6. WHEN TURSO_AUTH_TOKEN environment variable is undefined or empty string, THE Database_Client initialization SHALL throw an error with message "TURSO_AUTH_TOKEN is required"
7. WHEN the libSQL client fails to establish connection to Turso, THE Database_Client initialization SHALL throw an error with the underlying connection failure message

### Requirement 8: Organize Database Module Structure

**User Story:** As a developer, I want the database schema and client organized in a dedicated module, so that database code is maintainable and follows project conventions.

#### Acceptance Criteria

1. THE Schema_Module SHALL be located at src/db/schema.ts
2. THE Database_Client SHALL be exported from src/db/index.ts
3. THE Schema_Module SHALL export all table definitions from Requirements 1 through 6 (users, events, tickets, books, orders, order_items)
4. THE database module SHALL use explicit TypeScript type annotations for all exported symbols and produce zero TypeScript compilation errors
5. THE Schema_Module SHALL use the sqliteTable function from drizzle-orm/sqlite-core to define all table schemas
6. THE src/db/index.ts module SHALL import the schema definitions from src/db/schema.ts
