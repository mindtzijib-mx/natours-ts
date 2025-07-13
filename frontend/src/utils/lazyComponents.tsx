import { lazy } from "react";

// Lazy load page components
export const Home = lazy(() => import("../pages/Home.tsx"));
export const TourDetail = lazy(() => import("../pages/TourDetail.tsx"));
export const Login = lazy(() => import("../pages/Login.tsx"));
export const Signup = lazy(() => import("../pages/Signup.tsx"));
export const Account = lazy(() => import("../pages/Account.tsx"));
export const Error = lazy(() => import("../pages/Error.tsx"));

// Lazy load smaller components (optional - for very large components)
export const Map = lazy(() => import("../components/Map.tsx"));
export const ReviewCard = lazy(() => import("../components/ReviewCard.tsx"));

// Loading component
export const LoadingSpinner = () => (
  <div className="loading">
    <div className="loading__spinner"></div>
    <p>Loading...</p>
  </div>
);
