import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Tables } from "@/integrations/supabase/types";

export type IpSubmission = Tables<"ip_submissions">;

export const useMySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<IpSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMySubmissions = useCallback(async () => {
    if (!user) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("ip_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions((data as IpSubmission[]) || []);
    } catch (error) {
      console.error("Error fetching my submissions:", error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMySubmissions();
  }, [fetchMySubmissions]);

  return {
    submissions,
    loading,
    refetch: fetchMySubmissions,
  };
};
