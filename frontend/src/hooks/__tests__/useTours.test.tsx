import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTours } from "../useTours";
import { apiService } from "../../services/api";
import type { Tour } from "../../services/api";

// Mock the API service
vi.mock("../../services/api", () => ({
  apiService: {
    getTours: vi.fn(),
  },
}));

const mockTours: Tour[] = [
  {
    _id: "1",
    name: "The Forest Hiker",
    slug: "the-forest-hiker",
    duration: 5,
    maxGroupSize: 25,
    difficulty: "easy",
    ratingsAverage: 4.7,
    ratingsQuantity: 37,
    price: 397,
    summary: "Breathtaking hike through the Canadian Banff National Park",
    description: "Test description",
    imageCover: "tour-1-cover.jpg",
    images: ["tour-1-1.jpg"],
    startDates: ["2024-04-04"],
    startLocation: {
      type: "Point",
      coordinates: [-117.2061, 51.3995],
      address: "Banff, CAN",
      description: "Banff, CAN",
    },
    locations: [],
    guides: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

describe("useTours", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch tours successfully", async () => {
    const mockGetTours = vi.mocked(apiService.getTours);
    mockGetTours.mockResolvedValue({
      status: "success",
      data: mockTours,
    });

    const { result } = renderHook(() => useTours());

    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.tours).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for the data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tours).toEqual(mockTours);
    expect(result.current.error).toBe(null);
    expect(mockGetTours).toHaveBeenCalledTimes(1);
  });

  it("should handle error when fetching tours fails", async () => {
    const mockGetTours = vi.mocked(apiService.getTours);
    const errorMessage = "Failed to fetch tours";
    mockGetTours.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTours());

    // Initially should be loading
    expect(result.current.loading).toBe(true);

    // Wait for the error to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tours).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(mockGetTours).toHaveBeenCalledTimes(1);
  });

  it("should refetch tours when refetch is called", async () => {
    const mockGetTours = vi.mocked(apiService.getTours);
    mockGetTours.mockResolvedValue({
      status: "success",
      data: mockTours,
    });

    const { result } = renderHook(() => useTours());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear the mock to verify it's called again
    mockGetTours.mockClear();

    // Call refetch
    await result.current.refetch();

    expect(mockGetTours).toHaveBeenCalledTimes(1);
  });
});
