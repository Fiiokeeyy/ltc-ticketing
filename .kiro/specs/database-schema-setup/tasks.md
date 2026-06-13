# Implementation Plan: Database Schema Setup

## Overview

This implementation plan breaks down the database schema setup and Drizzle ORM integration into discrete coding tasks. The approach follows a bottom-up strategy: first establishing the schema definitions with all constraints, then initializing the database client with proper error handling and environment validation.

The implementation uses TypeScript with Drizzle ORM for type-safe database operations, connecting to Turso (libSQL) as the database provider in a Next.js App Router environment.

## Tasks

- [x] 1. Set up database module structure and install dependencies
  - Create `src/db/` directory
  - Verify `drizzle-orm` and `@libsql/client` are installed in package.json
  - Create empty `src/db/schema.ts` and `src/db/index.ts` files
  - _Requirements: 8.1, 8.2_

- [x] 2. Implement core table schemas with constraints
  - [x] 2.1 Implement users table schema
    - Define users table with id, name, email, role, createdAt columns
    - Add role CHECK constraint for 'ADMIN' and 'CUSTOMER' values
    - Add email CHECK constraint for pattern validation
    - Add unique constraint on email column
    - Export User and NewUser types
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  - [x] 2.2 Implement events table schema
    - Define events table with id, title, description, showDate, createdAt columns
    - Add title CHECK constraint to reject empty strings
    - Export Event and NewEvent types
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [x] 2.3 Implement tickets table schema
    - Define tickets table with id, eventId, categoryName, price, stockQuota columns
    - Add foreign key reference from eventId to events.id with CASCADE on delete
    - Add CHECK constraints for price >= 0 and stockQuota >= 0
    - Export Ticket and NewTicket types
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 2.4 Implement books table schema
    - Define books table with id, title, author, price, stock, description columns
    - Add CHECK constraints for price >= 0 and stock >= 0
    - Export Book and NewBook types
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 3. Implement order-related table schemas
  - [x] 3.1 Implement orders table schema
    - Define orders table with id, userId, totalAmount, status, createdAt columns
    - Add foreign key reference from userId to users.id with RESTRICT on delete
    - Add CHECK constraint for totalAmount >= 0
    - Add CHECK constraint for status values ('PENDING', 'PAID', 'CANCELLED')
    - Set default value 'PENDING' for status column
    - Export Order and NewOrder types
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 3.2 Implement order_items table schema with XOR constraint
    - Define order_items table with id, orderId, ticketId, bookId, quantity, subtotal columns
    - Add foreign key reference from orderId to orders.id with CASCADE on delete
    - Add nullable foreign key reference from ticketId to tickets.id with RESTRICT on delete
    - Add nullable foreign key reference from bookId to books.id with RESTRICT on delete
    - Add CHECK constraint for quantity >= 1
    - Add CHECK constraint for subtotal >= 0
    - Add CHECK constraint enforcing exactly one of ticketId or bookId is non-null (XOR logic)
    - Export OrderItem and NewOrderItem types
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

- [ ] 4. Checkpoint - Verify schema definitions
  - Ensure all schema definitions compile without TypeScript errors
  - Verify all table exports are available from schema.ts
  - Ask the user if questions arise

- [x] 5. Implement database client initialization
  - [x] 5.1 Implement environment variable validation
    - Check for TURSO_CONNECTION_URL and throw error with message "TURSO_CONNECTION_URL is required" if missing
    - Check for TURSO_AUTH_TOKEN and throw error with message "TURSO_AUTH_TOKEN is required" if missing
    - _Requirements: 7.1, 7.2, 7.5, 7.6_
  - [x] 5.2 Initialize libSQL client and Drizzle database client
    - Create libSQL client using createClient from @libsql/client with connection URL and auth token
    - Initialize Drizzle client using drizzle() function with libSQL client and schema
    - Export db client for application-wide use
    - Re-export schema for convenience
    - _Requirements: 7.3, 7.4, 7.7, 8.2, 8.3, 8.6_

- [ ]\* 6. Write schema validation tests
  - [ ]\* 6.1 Write unit tests for users table schema structure
    - Test that users table has all required columns with correct types
    - Test that email unique constraint exists
    - Test that role CHECK constraint exists
    - Test that email CHECK constraint exists
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  - [ ]\* 6.2 Write unit tests for events table schema structure
    - Test that events table has all required columns with correct types
    - Test that title CHECK constraint exists
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [ ]\* 6.3 Write unit tests for tickets table schema structure
    - Test that tickets table has all required columns with correct types
    - Test that foreign key to events exists with CASCADE behavior
    - Test that price and stockQuota CHECK constraints exist
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]\* 6.4 Write unit tests for books table schema structure
    - Test that books table has all required columns with correct types
    - Test that price and stock CHECK constraints exist
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [ ]\* 6.5 Write unit tests for orders table schema structure
    - Test that orders table has all required columns with correct types
    - Test that foreign key to users exists with RESTRICT behavior
    - Test that totalAmount and status CHECK constraints exist
    - Test that status default value is 'PENDING'
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [ ]\* 6.6 Write unit tests for order_items table schema structure
    - Test that order_items table has all required columns with correct types
    - Test that foreign keys exist with correct behaviors (CASCADE for orderId, RESTRICT for ticketId and bookId)
    - Test that quantity, subtotal, and XOR CHECK constraints exist
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_

- [ ]\* 7. Write constraint enforcement integration tests
  - [ ]\* 7.1 Write integration tests for users table constraints
    - Test rejection of invalid role values (not 'ADMIN' or 'CUSTOMER')
    - Test rejection of invalid email patterns (missing @, missing domain)
    - Test rejection of duplicate email addresses
    - Use in-memory SQLite database for testing
    - _Requirements: 1.6, 1.7, 1.3_
  - [ ]\* 7.2 Write integration tests for events table constraints
    - Test rejection of empty string title values
    - Use in-memory SQLite database for testing
    - _Requirements: 2.6_
  - [ ]\* 7.3 Write integration tests for tickets table constraints
    - Test rejection of negative price values
    - Test rejection of negative stockQuota values
    - Use in-memory SQLite database for testing
    - _Requirements: 3.4, 3.5_
  - [ ]\* 7.4 Write integration tests for books table constraints
    - Test rejection of negative price values
    - Test rejection of negative stock values
    - Use in-memory SQLite database for testing
    - _Requirements: 4.4, 4.5_
  - [ ]\* 7.5 Write integration tests for orders table constraints
    - Test rejection of negative totalAmount values
    - Test rejection of invalid status values (not 'PENDING', 'PAID', or 'CANCELLED')
    - Test that default status is 'PENDING' when not specified
    - Use in-memory SQLite database for testing
    - _Requirements: 5.3, 5.6, 5.4_
  - [ ]\* 7.6 Write integration tests for order_items table constraints
    - Test rejection of quantity values less than 1
    - Test rejection of negative subtotal values
    - Test rejection when both ticketId and bookId are null
    - Test rejection when both ticketId and bookId are non-null
    - Test acceptance when exactly one of ticketId or bookId is non-null
    - Use in-memory SQLite database for testing
    - _Requirements: 6.5, 6.6, 6.7, 6.8, 6.9_

- [ ]\* 8. Write foreign key relationship integration tests
  - [ ]\* 8.1 Write tests for CASCADE delete behavior
    - Test that deleting an event cascades to delete associated tickets
    - Test that deleting an order cascades to delete associated order_items
    - Use in-memory SQLite database for testing
    - _Requirements: 3.2, 6.2_
  - [ ]\* 8.2 Write tests for RESTRICT delete behavior
    - Test that deleting a user with orders is rejected
    - Test that deleting a ticket referenced in order_items is rejected
    - Test that deleting a book referenced in order_items is rejected
    - Use in-memory SQLite database for testing
    - _Requirements: 5.2, 6.3, 6.4_

- [ ]\* 9. Write database client initialization tests
  - [ ]\* 9.1 Write unit tests for environment variable validation
    - Test that missing TURSO_CONNECTION_URL throws error with message "TURSO_CONNECTION_URL is required"
    - Test that empty TURSO_CONNECTION_URL throws error with message "TURSO_CONNECTION_URL is required"
    - Test that missing TURSO_AUTH_TOKEN throws error with message "TURSO_AUTH_TOKEN is required"
    - Test that empty TURSO_AUTH_TOKEN throws error with message "TURSO_AUTH_TOKEN is required"
    - Mock environment variables for testing
    - _Requirements: 7.5, 7.6_

- [ ] 10. Final checkpoint - Verify complete implementation
  - Ensure all TypeScript compilation passes with zero errors
  - Verify database client can be imported from src/db/index.ts
  - Verify all schema exports are available
  - Ensure all tests pass (if implemented)
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The implementation uses TypeScript with Drizzle ORM's SQLite adapter
- All timestamps use integer type with Unix timestamp in seconds
- All monetary values use integer type representing smallest currency unit (cents)
- The XOR constraint in order_items ensures each line item is either a ticket or a book, never both or neither
- Environment variable validation happens at module initialization time (fail-fast approach)
- Testing uses in-memory SQLite for integration tests to avoid external dependencies
- Type safety is enforced at compile-time through Drizzle ORM's type inference

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["3.2"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["5.2"] },
    { "id": 6, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6"] },
    { "id": 7, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5", "7.6"] },
    { "id": 8, "tasks": ["8.1", "8.2"] },
    { "id": 9, "tasks": ["9.1"] }
  ]
}
```
