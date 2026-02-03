import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface IpListing {
  id: string;
  user_id: string;
  submission_id: string | null;
  category: string;
  name: string;
  description: string | null;
  registration_number: string | null;
  price: number | null;
  price_negotiable: boolean | null;
  documents: string[] | null;
  status: string;
  views_count: number | null;
  favorites_count: number | null;
  cart_count: number | null;
  created_at: string;
  updated_at: string;
}

export type ListingStatus = "active" | "published" | "sold" | "archived";

export const useAdminListings = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState<IpListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ip_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить каталог",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const updateListing = async (
    id: string,
    updates: Partial<Pick<IpListing, "name" | "description" | "price" | "price_negotiable" | "category" | "registration_number" | "status">>
  ) => {
    try {
      const { error } = await supabase
        .from("ip_listings")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );

      toast({
        title: "Сохранено",
        description: "Объект успешно обновлён",
      });
      return true;
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить объект",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ip_listings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setListings((prev) => prev.filter((l) => l.id !== id));

      toast({
        title: "Удалено",
        description: "Объект удалён из каталога",
      });
      return true;
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить объект",
        variant: "destructive",
      });
      return false;
    }
  };

  const publishedCount = listings.filter(
    (l) => l.status === "published" || l.status === "active"
  ).length;

  return {
    listings,
    loading,
    updateListing,
    deleteListing,
    refetch: fetchListings,
    publishedCount,
  };
};
