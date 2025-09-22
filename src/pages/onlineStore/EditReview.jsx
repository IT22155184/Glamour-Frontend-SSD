// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import SubmitButton from "../../components/button/SubmitButton.jsx";
import PropTypes from "prop-types";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { enqueueSnackbar } from "notistack";

const EditReview = ({ id, review, onClose}) => {
  const [rate, setRate] = useState(review.rating);
  const [reviewComment, setReviewComment] = useState(review.reviewComment);

  const [rateError, setRateError] = useState("");
  const [reviewCommentError, setReviewCommentError] = useState("");

  function validateRate(rate) {
    let isValid = true;
    if (rate < 1 || rate > 5) {
      setRateError("Rating should be between 1 and 5");
      isValid = false;
    }
    if (rate === "") {
      setRateError("Rate is required");
      isValid = false;
    }
    return isValid;
  }

  function validateReviewComment(reviewComment) {
    let isValid = true;
    if (reviewComment === "") {
      setReviewCommentError("Please enter a review");
      isValid = false;
    } else {
      setReviewCommentError("");
    }
    return isValid;
  }

  const handleEditReview = (reviewId) => {
    event.preventDefault();

    const isValidRate = validateRate(rate);
    const isValidReviewComment = validateReviewComment(reviewComment);

    if (isValidRate && isValidReviewComment) {
      const updatedReview = {
        userId: review.userId,
        userName: review.userName,
        rating: Number(rate),
        reviewComment: reviewComment,
      };
      axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}/${reviewId}`, updatedReview)
        .then((response) => {
          enqueueSnackbar("Review updated successfully", {
            variant: "success",
          });
          window.location.reload(true);
        })
        .catch((err) => {
          enqueueSnackbar("Error updating data", { variant: "error" });
          console.error(err);
        });
    }
  };

  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[700px] max-w-full h-auto bg-white rounded-xl p-4 flex flex-col relative"
      >
        <div className="text-[20px] font-BreeSerif text-primary mx-10">
          <div className="text-[30px]">EditReview</div>
          <form onSubmit={handleEditReview} noValidate>
            <div className="flex flex-row justify-between w-fit my-4">
              Rating
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <input
                    className="border-2 border-primary rounded-lg p-2 mx-4"
                    type="number"
                    min="1"
                    max="5"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                  / 5
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {rateError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {rateError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex flex-row justify-between w-fit my-4">
              Review
              <div className="flex flex-col">
                <textarea
                  className="border-2 border-primary rounded-lg p-2 ml-3"
                  placeholder="Enter your review here"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
                <AnimatePresence mode="wait" initial={false}>
                  {reviewCommentError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {reviewCommentError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <SubmitButton onClick={() => handleEditReview(review._id)} />
          </form>
        </div>
      </div>
    </div>
  );
};

EditReview.propTypes = {
  id: PropTypes.string.isRequired,
  review: PropTypes.shape({
    rating: PropTypes.number.isRequired,
    reviewComment: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditReview;
