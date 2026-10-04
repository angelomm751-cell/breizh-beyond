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

  // The restaurant's confirmed menu in the repository is the source of truth.
  // Do not let an older/incomplete Supabase menu silently replace it.
  if (error || !Array.isArray(data)) return fallback;

  const expectedById = new Map(fallback.map((p) => [p.id, p]));
  const matchesConfirmedMenu =
    data.length === fallback.length &&
    fallback.every((expected) => {
      const row = data.find((item) => item.id === expected.id);
      return !!row &&
        row.name === expected.name &&
        Number(row.price) === expected.price &&
        row.category === expected.category &&
        row.description === expected.description;
    });

  if (!matchesConfirmedMenu) return fallback;

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

/** Confirmed restaurant menu; uses Supabase only when it exactly matches it. */
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
