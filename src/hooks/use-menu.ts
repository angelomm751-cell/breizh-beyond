import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products as fallback, resolveImage, type Category, type Product } from "@/lib/menu";

export const menuQueryKey = ["menu"] as const;

async function fetchMenu(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id,name,category,description,price,image,position")
    .eq("available", true)
    .order("sort_order");

  // Only use the database when it contains the complete confirmed menu.
  // If the database still has the old/demo menu, use the bundled menu instead.
  const expectedIds = new Set(fallback.map((p) => p.id));
  const databaseIds = new Set(Array.isArray(data) ? data.map((row) => row.id) : []);
  const hasCompleteMenu =
    !error &&
    Array.isArray(data) &&
    expectedIds.size > 0 &&
    [...expectedIds].every((id) => databaseIds.has(id));

  if (!hasCompleteMenu) return fallback;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category as Category,
    description: row.description,
    price: Number(row.price),
    image: resolveImage(row.image),
    position: row.position,
  }));
}

/** Live menu edited from /admin; falls back to the complete bundled menu. */
export function useMenu() {
  const { data } = useQuery({
    queryKey: menuQueryKey,
    queryFn: fetchMenu,
    initialData: fallback,
    initialDataUpdatedAt: 0,
    staleTime: 60_000,
  });
  return data;
}
