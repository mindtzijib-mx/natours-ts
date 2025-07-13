import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import type { Tour } from "../services/api";

export const useTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTours();

      // Handle nested data structure from backend
      // Backend returns: { status: "success", data: { data: [...] } }
      // But our API service expects: { status: "success", data: [...] }
      // So we need to check if response.data has a nested data property
      const toursData =
        (response as { data: { data?: Tour[] } }).data?.data || response.data;

      // Ensure we're setting an array
      if (Array.isArray(toursData)) {
        setTours(toursData);
      } else {
        console.error("API returned non-array data:", toursData);
        setError("Invalid data format received from server");
        setTours([]);
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tours");
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return { tours, loading, error, refetch: fetchTours };
};

interface UseTourReturn {
  tour: Tour | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTour = (slug: string): UseTourReturn => {
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTour = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.getTour(slug);
      setTour(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tour";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchTour();
    }
  }, [slug]);

  return {
    tour,
    isLoading,
    error,
    refetch: fetchTour,
  };
};
