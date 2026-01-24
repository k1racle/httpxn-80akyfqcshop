import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface IpSubmission {
  id: string;
  user_id: string;
  category: string;
  name: string;
  description: string | null;
  registration_number: string | null;
  price: number | null;
  price_negotiable: boolean;
  documents: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IpRequest {
  id: string;
  user_id: string;
  category: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  industries: string[];
  urgent: boolean;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrder {
  id: string;
  user_id: string;
  listing_id: string | null;
  listing_snapshot: {
    name: string;
    category: string;
    price: number;
    registration_number?: string;
  };
  status: string;
  price: number;
  payment_url: string | null;
  payment_expires_at: string | null;
  admin_notes: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus = "pending" | "reviewing" | "approved" | "rejected" | "published" | "sold";
export type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type OrderStatusType = "pending" | "manager_review" | "payment_ready" | "payment_expired" | "paid" | "completed" | "cancelled";

export const useAdminSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<IpSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("ip_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateSubmissionStatus = async (
    id: string,
    status: SubmissionStatus,
    adminNotes?: string
  ) => {
    try {
      const updateData: { status: SubmissionStatus; admin_notes?: string } = { status };
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from("ip_submissions")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updateData } : s))
      );

      toast({
        title: "Статус обновлён",
        description: `Заявка переведена в статус: ${status}`,
      });
      return true;
    } catch (error) {
      console.error("Error updating submission:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    submissions,
    loading,
    updateSubmissionStatus,
    refetch: fetchSubmissions,
  };
};

export const useAdminRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<IpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("ip_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateRequestStatus = async (
    id: string,
    status: RequestStatus,
    adminNotes?: string
  ) => {
    try {
      const updateData: { status: RequestStatus; admin_notes?: string } = { status };
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from("ip_requests")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updateData } : r))
      );

      toast({
        title: "Статус обновлён",
      });
      return true;
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    requests,
    loading,
    updateRequestStatus,
    refetch: fetchRequests,
  };
};

export const useAdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as unknown as AdminOrder[]) || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (
    id: string,
    status: OrderStatusType,
    paymentUrl?: string,
    adminNotes?: string
  ) => {
    try {
      const updateData: {
        status: OrderStatusType;
        payment_url?: string;
        payment_expires_at?: string;
        admin_notes?: string;
      } = { status };

      let paymentExpiresAt: string | undefined;

      if (paymentUrl) {
        updateData.payment_url = paymentUrl;
        // Set payment expiration to 30 minutes from now
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        paymentExpiresAt = expiresAt.toISOString();
        updateData.payment_expires_at = paymentExpiresAt;
      }

      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Find the order to get customer email
      const order = orders.find((o) => o.id === id);
      
      if (order && order.contact_email) {
        // Get user name from profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", order.user_id)
          .maybeSingle();
        
        try {
          await supabase.functions.invoke("send-order-notification", {
            body: {
              to: order.contact_email,
              customerName: profile?.full_name || "Клиент",
              orderName: order.listing_snapshot.name,
              orderCategory: order.listing_snapshot.category,
              orderPrice: order.price,
              status: status,
              paymentUrl: paymentUrl,
              paymentExpiresAt: paymentExpiresAt,
            },
          });
          console.log("Email notification sent");
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't fail the whole operation if email fails
        }
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...updateData } : o))
      );

      toast({
        title: "Заказ обновлён",
        description:
          status === "payment_ready"
            ? "Ссылка на оплату отправлена клиенту"
            : `Статус изменён на: ${status}`,
      });
      return true;
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить заказ",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    orders,
    loading,
    updateOrderStatus,
    refetch: fetchOrders,
  };
};
