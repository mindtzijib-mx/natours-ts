import React from "react";
import { useTours } from "../hooks/useTours";
import TourCard from "../components/TourCard";
import type { Tour } from "../services/api";

const Home: React.FC = () => {
  const { tours, loading, error } = useTours();

  if (loading) {
    return (
      <main className="main">
        <div className="card-container">
          <div className="loading">Loading tours...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main">
        <div className="card-container">
          <div className="alert alert--error">
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  // Ensure tours is an array before mapping
  const toursArray = Array.isArray(tours) ? tours : [];

  return (
    <div className="card-container">
      {toursArray.length === 0 ? (
        <div className="alert alert--info">
          <p>No tours available at the moment.</p>
        </div>
      ) : (
        toursArray.map((tour: Tour) => <TourCard key={tour._id} tour={tour} />)
      )}
    </div>
  );
};

export default Home;
