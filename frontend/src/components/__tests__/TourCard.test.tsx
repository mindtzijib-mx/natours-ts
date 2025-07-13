import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import TourCard from "../TourCard";
import type { Tour } from "../../services/api";

// Mock tour data
const mockTour: Tour = {
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
  description:
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  imageCover: "tour-1-cover.jpg",
  images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],
  startDates: ["2024-04-04", "2024-09-13"],
  startLocation: {
    type: "Point",
    coordinates: [-117.2061, 51.3995],
    address: "Banff, CAN",
    description: "Banff, CAN",
  },
  locations: [
    {
      type: "Point",
      coordinates: [-117.2061, 51.3995],
      address: "Banff, CAN",
      description: "Banff, CAN",
      day: 1,
    },
  ],
  guides: [
    {
      _id: "guide1",
      name: "Miyah Myles",
      email: "miyah.myles@example.com",
      photo: "user-1.jpg",
      role: "lead-guide",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

// Wrapper component for testing with Router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("TourCard", () => {
  it("renders tour information correctly", () => {
    render(
      <TestWrapper>
        <TourCard tour={mockTour} />
      </TestWrapper>
    );

    // Check if tour name is displayed
    expect(screen.getByText("The Forest Hiker")).toBeInTheDocument();

    // Check if difficulty and duration are displayed
    expect(screen.getByText("easy 5-day tour")).toBeInTheDocument();

    // Check if summary is displayed
    expect(
      screen.getByText(
        "Breathtaking hike through the Canadian Banff National Park"
      )
    ).toBeInTheDocument();

    // Check if price is displayed
    expect(screen.getByText("$397")).toBeInTheDocument();

    // Check if rating is displayed
    expect(screen.getByText("4.7")).toBeInTheDocument();
    expect(screen.getByText("rating (37)")).toBeInTheDocument();

    // Check if location is displayed
    expect(screen.getByText("Banff, CAN")).toBeInTheDocument();

    // Check if group size is displayed
    expect(screen.getByText("25 people")).toBeInTheDocument();

    // Check if number of stops is displayed
    expect(screen.getByText("1 stops")).toBeInTheDocument();
  });

  it("renders tour image with correct alt text", () => {
    render(
      <TestWrapper>
        <TourCard tour={mockTour} />
      </TestWrapper>
    );

    const image = screen.getByAltText("The Forest Hiker");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/img/tours/tour-1-cover.jpg");
  });

  it("renders link to tour detail page", () => {
    render(
      <TestWrapper>
        <TourCard tour={mockTour} />
      </TestWrapper>
    );

    const link = screen.getByRole("link", { name: /details/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tour/the-forest-hiker");
  });

  it("displays formatted date correctly", () => {
    render(
      <TestWrapper>
        <TourCard tour={mockTour} />
      </TestWrapper>
    );

    // Check if the first start date is displayed
    expect(screen.getByText("April 2024")).toBeInTheDocument();
  });
});
