import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Listing {
  id: string;
  user_id: string;
  category: string;
  name: string;
  description: string | null;
  registration_number: string | null;
  price: number | null;
  price_negotiable: boolean;
  documents: string[];
  status: string;
  views_count: number;
  favorites_count: number;
  cart_count: number;
  created_at: string;
  updated_at: string;
}

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("ip_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const getListingById = async (id: string): Promise<Listing | null> => {
    try {
      const { data, error } = await supabase
        .from("ip_listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching listing:", error);
      return null;
    }
  };

  const trackView = async (listingId: string, userId?: string) => {
    try {
      await supabase.from("listing_views").insert({
        listing_id: listingId,
        viewer_id: userId || null,
      });
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  return {
    listings,
    loading,
    fetchListings,
    getListingById,
    trackView,
  };
};

export const useMyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = useCallback(async () => {
    if (!user) {
      setListings([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("ip_listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching my listings:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  return {
    listings,
    loading,
    refetch: fetchMyListings,
  };
};
