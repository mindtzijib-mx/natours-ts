import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import type { Tour } from "../services/api";

export const useTour = (slug: string) => {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTour = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTour(slug);

      // Handle nested data structure from backend
      // Backend returns: { status: "success", data: { data: {...} } }
      // But our API service expects: { status: "success", data: {...} }
      const tourData =
        (response as { data: { data?: Tour } }).data?.data || response.data;

      setTour(tourData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tour");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTour();
  }, [slug]);

  return { tour, loading, error, refetch: fetchTour };
};
