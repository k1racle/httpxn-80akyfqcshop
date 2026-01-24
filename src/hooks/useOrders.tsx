import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type OrderStatus = 
  | "pending" 
  | "manager_review" 
  | "payment_ready" 
  | "payment_expired" 
  | "paid" 
  | "completed" 
  | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  listing_id: string | null;
  listing_snapshot: {
    name: string;
    category: string;
    price: number;
    registration_number?: string;
  };
  status: OrderStatus;
  price: number;
  payment_url: string | null;
  payment_expires_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as unknown as Order[]) || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (
    listingId: string,
    listingSnapshot: Order["listing_snapshot"],
    price: number
  ) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы оформить заявку",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          listing_id: listingId,
          listing_snapshot: listingSnapshot,
          price: price,
          status: "pending",
          contact_email: user.email,
        })
        .select()
        .single();

      if (error) throw error;

      setOrders((prev) => [data as unknown as Order, ...prev]);
      toast({
        title: "Заявка отправлена",
        description: "Менеджер свяжется с вами в ближайшее время",
      });
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заявку",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    orders,
    loading,
    createOrder,
    refetch: fetchOrders,
  };
};

export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: "Ожидает обработки",
    manager_review: "На рассмотрении",
    payment_ready: "Готов к оплате",
    payment_expired: "Срок оплаты истёк",
    paid: "Оплачен",
    completed: "Завершён",
    cancelled: "Отменён",
  };
  return labels[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    manager_review: "bg-blue-100 text-blue-800",
    payment_ready: "bg-green-100 text-green-800",
    payment_expired: "bg-red-100 text-red-800",
    paid: "bg-emerald-100 text-emerald-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-gray-100 text-gray-500",
  };
  return colors[status];
};
