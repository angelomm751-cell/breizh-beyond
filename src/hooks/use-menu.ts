import { products as fallback, type Product } from "@/lib/menu";

export const menuQueryKey = ["menu"] as const;

/**
 * The confirmed restaurant menu lives in the repository and is the source of truth.
 * Keeping the public menu independent from Supabase prevents an empty/outdated
 * database from making the menu disappear.
 */
export function useMenu(): Product[] {
  return fallback;
}
