import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { useTour } from "../hooks/useTour";
import { Map } from "../utils/lazyComponents.tsx";

const TourDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { tour, loading, error } = useTour(slug || "");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-us", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="main">
        <div className="loading">Loading tour details...</div>
      </main>
    );
  }

  if (error || !tour) {
    return (
      <div className="alert alert--error">
        <p>{error || "Tour not found"}</p>
      </div>
    );
  }

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={`/tours/${tour.imageCover}`}
            alt={tour.name}
          />
        </div>
        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/icons.svg#icon-clock"></use>
              </svg>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/icons.svg#icon-map-pin"></use>
              </svg>
              <span className="heading-box__text">
                {tour.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/icons.svg#icon-calendar"></use>
                </svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">
                  {tour.startDates.length > 0 && formatDate(tour.startDates[0])}
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/icons.svg#icon-trending-up"></use>
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/icons.svg#icon-user"></use>
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">
                  {tour.maxGroupSize} people
                </span>
              </div>
              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/icons.svg#icon-star"></use>
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">
                  {tour.ratingsAverage} / 5
                </span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides.map((guide) => (
                <div className="overview-box__detail" key={guide._id}>
                  <img
                    className="overview-box__img"
                    src={`http://localhost:3000/api/v1/users/photo/${
                      guide.photo || "default.jpg"
                    }`}
                    alt={guide.name}
                  />
                  <span className="overview-box__label">{guide.name}</span>
                  <span className="overview-box__text">{guide.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name}</h2>
          <p className="description__text">{tour.description}</p>
        </div>
      </section>

      <section className="section-pictures">
        {tour.images.map((image, index) => (
          <div className="picture-box" key={index}>
            <img
              className="picture-box__img"
              src={`/tours/${image}`}
              alt={`${tour.name} ${index + 1}`}
            />
          </div>
        ))}
      </section>

      <section className="section-map">
        <div id="map" className="map">
          <Suspense fallback={<div className="loading">Loading map...</div>}>
            <Map locations={tour.locations} tourName={tour.name} />
          </Suspense>
        </div>
      </section>

      <section className="section-reviews">
        <div className="reviews">
          <div className="reviews__card">
            <div className="reviews__avatar">
              <img
                className="reviews__avatar-img"
                src="/users/default.jpg"
                alt="User"
              />
              <h6 className="reviews__user">User Name</h6>
            </div>
            <p className="reviews__text">Sample review text</p>
            <div className="reviews__rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="reviews__star reviews__star--active">
                  <use xlinkHref="/icons.svg#icon-star"></use>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/logo-white.png" alt="Natours logo" />
          </div>
          <img
            className="cta__img cta__img--1"
            src={`/tours/${tour.images[0] || tour.imageCover}`}
            alt="Tour"
          />
          <img
            className="cta__img cta__img--2"
            src={`/tours/${tour.images[1] || tour.imageCover}`}
            alt="Tour"
          />
          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {tour.duration} days. 1 adventure. Infinite memories. Make it
              yours today!
            </p>
            <button className="btn btn--green span-all-rows">
              Book tour now!
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default TourDetail;
