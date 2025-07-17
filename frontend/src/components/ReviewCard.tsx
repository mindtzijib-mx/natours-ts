import React from "react";

interface Review {
  _id: string;
  review: string;
  rating: number;
  user: {
    _id: string;
    name: string;
    photo: string;
  };
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="reviews__card">
      <div className="reviews__avatar">
        <img
          className="reviews__avatar-img"
          src={`http://localhost:3000/api/v1/users/photo/${
            review.user.photo || "default.jpg"
          }`}
          alt={review.user.name}
        />
        <h6 className="reviews__user">{review.user.name}</h6>
      </div>
      <p className="reviews__text">{review.review}</p>
      <div className="reviews__rating">
        <svg className="reviews__star reviews__star--active">
          <use xlinkHref="/icons.svg#icon-star"></use>
        </svg>
      </div>
    </div>
  );
};

export default ReviewCard;
