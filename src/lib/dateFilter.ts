import { gte, lt, and, SQL } from "drizzle-orm";
import { transactions } from "@/db/schema";

/**
 * Generates Drizzle ORM conditions for filtering transactions by month and year.
 * @param monthStr 1-12 or "all"
 * @param yearStr YYYY or "all"
 * @returns SQL condition or undefined if no filter is applied
 */
export function getTransactionDateFilter(monthStr: string | null, yearStr: string | null): SQL<unknown> | undefined {
  if (monthStr && yearStr && monthStr !== "all" && yearStr !== "all") {
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    return and(
      gte(transactions.createdAt, startDate),
      lt(transactions.createdAt, endDate)
    );
  } else if (yearStr && yearStr !== "all") {
    const year = parseInt(yearStr);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    return and(
      gte(transactions.createdAt, startDate),
      lt(transactions.createdAt, endDate)
    );
  }
  
  return undefined;
}
