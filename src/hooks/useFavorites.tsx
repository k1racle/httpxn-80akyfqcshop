import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Favorite {
  id: string;
  listing_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback(
    (listingId: string) => {
      return favorites.some((f) => f.listing_id === listingId);
    },
    [favorites]
  );

  const toggleFavorite = async (listingId: string) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы добавить в избранное",
        variant: "destructive",
      });
      return false;
    }

    // Check if it's a mock ID (simple numeric string like "1", "2", etc.)
    const isMockId = /^\d+$/.test(listingId);
    if (isMockId) {
      toast({
        title: "Демо-режим",
        description: "Эта функция доступна только для реальных объектов",
      });
      return false;
    }

    const isCurrentlyFavorite = isFavorite(listingId);

    try {
      if (isCurrentlyFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listingId);

        if (error) throw error;
        setFavorites((prev) => prev.filter((f) => f.listing_id !== listingId));
        toast({
          title: "Удалено из избранного",
        });
      } else {
        const { data, error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, listing_id: listingId })
          .select()
          .single();

        if (error) throw error;
        setFavorites((prev) => [...prev, data]);
        toast({
          title: "Добавлено в избранное",
        });
      }
      return true;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить избранное",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
};
