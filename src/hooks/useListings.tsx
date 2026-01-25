import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { demoListings, getDemoListingById, DemoListing } from "@/data/demoListings";

export interface Listing {
  id: string;
  submission_id?: string | null;
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
  updated_at?: string;
  is_demo?: boolean;
  demo_label?: string;
  legal_status?: string;
  can_buy?: boolean;
}

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("ip_listings")
        .select("*")
        .in("status", ["active", "published"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Mark real listings
      const realListings: Listing[] = (data || []).map(item => ({
        ...item,
        documents: item.documents || [],
        is_demo: false,
        can_buy: true,
      }));
      
      // Convert demo listings to Listing type
      const demoItems: Listing[] = demoListings.map(demo => ({
        id: demo.id,
        user_id: demo.user_id,
        category: demo.category,
        name: demo.name,
        description: demo.description,
        registration_number: demo.registration_number,
        price: demo.price,
        price_negotiable: demo.price_negotiable,
        documents: [],
        status: demo.status,
        views_count: demo.views_count,
        favorites_count: demo.favorites_count,
        cart_count: demo.cart_count,
        created_at: demo.created_at,
        is_demo: true,
        demo_label: demo.demo_label,
        legal_status: demo.legal_status,
        can_buy: false,
      }));
      
      // Sort: real items first, then demo items
      const combined = [...realListings, ...demoItems];
      
      setListings(combined);
    } catch (error) {
      console.error("Error fetching listings:", error);
      // On error, still show demo listings
      const demoItems: Listing[] = demoListings.map(demo => ({
        id: demo.id,
        user_id: demo.user_id,
        category: demo.category,
        name: demo.name,
        description: demo.description,
        registration_number: demo.registration_number,
        price: demo.price,
        price_negotiable: demo.price_negotiable,
        documents: [],
        status: demo.status,
        views_count: demo.views_count,
        favorites_count: demo.favorites_count,
        cart_count: demo.cart_count,
        created_at: demo.created_at,
        is_demo: true,
        demo_label: demo.demo_label,
        legal_status: demo.legal_status,
        can_buy: false,
      }));
      setListings(demoItems);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const getListingById = async (id: string): Promise<Listing | null> => {
    // Check if it's a demo listing first
    if (id.startsWith("demo-")) {
      const demo = getDemoListingById(id);
      if (demo) {
        return {
          id: demo.id,
          user_id: demo.user_id,
          category: demo.category,
          name: demo.name,
          description: demo.description,
          registration_number: demo.registration_number,
          price: demo.price,
          price_negotiable: demo.price_negotiable,
          documents: [],
          status: demo.status,
          views_count: demo.views_count,
          favorites_count: demo.favorites_count,
          cart_count: demo.cart_count,
          created_at: demo.created_at,
          is_demo: true,
          demo_label: demo.demo_label,
          legal_status: demo.legal_status,
          can_buy: false,
        };
      }
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from("ip_listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        return {
          ...data,
          documents: data.documents || [],
          is_demo: false,
          can_buy: true,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching listing:", error);
      return null;
    }
  };

  const trackView = async (listingId: string, userId?: string) => {
    // Don't track views for demo listings
    if (listingId.startsWith("demo-")) return;
    
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
