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
  if (error || !data) return fallback;
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

/** Live menu edited from /admin; falls back to the bundled demo menu. */
export function useMenu() {
  const { data } = useQuery({ queryKey: menuQueryKey, queryFn: fetchMenu, initialData: fallback, initialDataUpdatedAt: 0, staleTime: 60_000 });
  return data;
}
