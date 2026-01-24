import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface CartItem {
  id: string;
  listing_id: string;
  created_at: string;
}

export const useCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const isInCart = useCallback(
    (listingId: string) => {
      return cartItems.some((c) => c.listing_id === listingId);
    },
    [cartItems]
  );

  const toggleCart = async (listingId: string) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы добавить в корзину",
        variant: "destructive",
      });
      return false;
    }

    const isCurrentlyInCart = isInCart(listingId);

    try {
      if (isCurrentlyInCart) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listingId);

        if (error) throw error;
        setCartItems((prev) => prev.filter((c) => c.listing_id !== listingId));
        toast({
          title: "Удалено из корзины",
        });
      } else {
        const { data, error } = await supabase
          .from("cart_items")
          .insert({ user_id: user.id, listing_id: listingId })
          .select()
          .single();

        if (error) throw error;
        setCartItems((prev) => [...prev, data]);
        toast({
          title: "Добавлено в корзину",
        });
      }
      return true;
    } catch (error) {
      console.error("Error toggling cart:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить корзину",
        variant: "destructive",
      });
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return {
    cartItems,
    cartCount: cartItems.length,
    loading,
    isInCart,
    toggleCart,
    clearCart,
    refetch: fetchCart,
  };
};
