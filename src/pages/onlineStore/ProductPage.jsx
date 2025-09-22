import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner.jsx";
import Navbar from "../../components/navbar/CustomerNavbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { enqueueSnackbar } from "notistack";
import ReviewCard from "../../components/ReviewCard.jsx";
import ProgressBar from "../../components/ProgressBar.jsx";
import AddButton from "../../components/button/AddButton.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";
import SafeText from "../../components/SafeText.jsx";
import { sanitizeFormData } from "../../utils/xssProtection.js";
import { useAuth } from '../../contexts/AuthContext.jsx';

const ProductPage = () => {
  const [amount, setAmount] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [userID, setuserID] = useState("");
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewComment, setReviewComment] = useState("");
  const [rate, setRate] = useState("");
  const [rateError, setRateError] = useState("");
  const [reviewCommentError, setReviewCommentError] = useState("");
  const [AmountError, setAmountError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [colorError, setColorError] = useState("");
  const [userProfile, setUserProfile] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const { isLoggedIn, user } = useAuth();

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

  function validateamount(amount) {
    let isValid = true;
    if (amount < 1) {
      setAmountError("Amount should be greater than 0");
      isValid = false;
    }
    if (amount === "") {
      setAmountError("Amount is required");
      isValid = false;
    }
    if (amount > 5) {
      setAmountError("Amount should be less than 5");
      isValid = false;
    }
    if (amount > product.stock) {
      setAmountError("Amount should be less than remaining stock");
      isValid = false;
    }
    return isValid;
  }

  function validateSize(size) {
    let isValid = true;
    if (size === "") {
      setSizeError("Please select a size");
      isValid = false;
    } else {
      setSizeError("");
    }
    return isValid;
  }

  function validateColor(color) {
    let isValid = true;
    if (color === "") {
      setColorError("Please select a color");
      isValid = false;
    } else {
      setColorError("");
    }
    return isValid;
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/cusItems/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  // Fetch logged-in user's profile using the current auth system
  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`)
        .then((response) => {
          setUserProfile(response.data.user || response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile information:", error);
        });
    } else {
      setUserProfile([]);
    }
  }, [isLoggedIn]);

  const methods = useForm();

  const onSubmit = methods.handleSubmit(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }
    const isValidAmount = validateamount(amount);
    const isValidSize = validateSize(size);
    const isValidColor = validateColor(color);

    if (isValidAmount && isValidSize && isValidColor) {
      const cart = {
        items: [
          {
            product: product._id,
            quantity: amount,
            color: color,
            size: size,
          },
        ],
      };
      setLoading(true);
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/cart/${user._id}`, cart)
        .then((response) => {
          setLoading(false);
          enqueueSnackbar("Added to cart", { variant: "success" });
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          enqueueSnackbar("Error adding to cart", { variant: "error" });
        });
    }
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`)
      .then((response) => {
        setReviews(response.data);
        // Calculate overall rating
        const totalRating = response.data.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const averageRating = totalRating / response.data.length;
        setOverallRating(averageRating || 0);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const AddReview = () => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }
    event.preventDefault();

    const isValidRate = validateRate(rate);
    const isValidReviewComment = validateReviewComment(reviewComment);

    if (isValidRate && isValidReviewComment) {
      // Sanitize the review data before sending
      const sanitizedData = sanitizeFormData(
        {
          userName: userProfile.firstName + " " + userProfile.lastName,
          reviewComment: reviewComment,
        },
        {
          userName: { maxLength: 100, stripTags: true },
          reviewComment: { maxLength: 500, stripTags: true },
        }
      );

      const review = {
        userId: userProfile._id,
        userName: sanitizedData.userName,
        rating: Number(rate),
        reviewComment: sanitizedData.reviewComment,
      };
      setLoading(true);
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/reviews/${id}`, review)
        .then((response) => {
          setLoading(false);
          setRate(0);
          setReviewComment("");
          window.location.reload(true);
          enqueueSnackbar("Review Added", { variant: "success" });
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          enqueueSnackbar("Error adding review", { variant: "error" });
        });
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row justify-evenly mt-[4%] mb-[6%]">
        <img src={product.image} className="rounded-l-[10px] px-16 w-1/2" />
        <div className="flex flex-col w-1/2">
          <SafeText
            content={product.name}
            className="pb-[2%] text-6xl font-Aboreto text-primary"
            maxLength={100}
          />
          <SafeText
            content={product.description}
            className="mb-[2%] w-[700px] font-BreeSerif text-primary"
            maxLength={1000}
          />
          <p className="mb-[2%] mt-8 text-5xl font-BreeSerif text-primary">
            Rs.{product.minprice}.00
          </p>
          <form onSubmit={(e) => e.preventDefault} noValidate>
            <div className="flex flex-col w-1/2 mt-[10%]">
              <label className=" font-Philosopher text-primary text-3xl mt-[10%]">
                Amount
              </label>
              <AnimatePresence mode="wait" initial={false}>
                {AmountError && (
                  <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold w-fit text-red-500 bg-red-100 rounded-md">
                    <MdError />
                    {AmountError}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="w-1/2">
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  label="Amount"
                  min="1"
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  disabled={product.stock === 0}
                  onChange={(e) => setAmount(e.target.value)}
                  max={product.stock > 5 ? 5 : product.stock}
                />
              </div>
            </div>
            {product.stock === 0 && (
              <p className="text-red-500 font-BreeSerif text-3xl">
                Out of stock
              </p>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <p className="text-red-500">
                Only {product.stock} items left in stock
              </p>
            )}
            {product.stock >= 5 && (
              <p className="text-red-500">Only 5 items can be added to cart</p>
            )}

            <h1 className=" font-Philosopher text-primary text-3xl mt-5 ">
              Select Size
            </h1>
            <div className="fle flex-col">
              <AnimatePresence mode="wait" initial={false}>
                {colorError && (
                  <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 w-fit bg-red-100 rounded-md">
                    <MdError />
                    {colorError}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="flex flex-row my-5 border-t-2 border-l-2 border-b-2 border-ternary align-middle w-fit">
                {product.sizes.map((size, index) => (
                  <div
                    key={index}
                    className="flex flex-row border-r-2 cursor-pointer border-ternary "
                  >
                    <input
                      key={size.id}
                      type="radio"
                      id={size}
                      name="size"
                      value={size}
                      disabled={product.stock === 0}
                      onChange={(e) => setSize(e.target.value)}
                      className="hidden peer"
                    />
                    <label
                      key={size.id}
                      htmlFor={size}
                      className="cursor-pointer font-BreeSerif text-black p-2 text-center w-20 h-10 peer-checked:bg-primary peer-checked:text-white"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {product.colors.length > 0 && (
              <>
                <h1 className=" font-Philosopher text-primary text-3xl ">
                  Choose Color
                </h1>
                <div className="fle flex-col">
                  <AnimatePresence mode="wait" initial={false}>
                    {sizeError && (
                      <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 w-fit bg-red-100 rounded-md">
                        <MdError />
                        {sizeError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <div className="flex flex-row my-5 border-t-2 border-l-2 border-b-2 border-ternary align-middle  w-fit">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex flex-row border-r-2 cursor-pointer border-ternary"
                      >
                        <input
                          disabled={product.stock === 0}
                          key={color.id}
                          type="radio"
                          id={color}
                          name="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="hidden peer"
                        />
                        <label
                          key={color.id}
                          htmlFor={color}
                          className="cursor-pointer font-BreeSerif text-black p-2 text-center w-20 h-10 peer-checked:bg-primary peer-checked:text-white"
                        >
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <button
              onClick={onSubmit}
              disabled={product.stock === 0}
              className="bg-ternary text-black font-BreeSerif w-1/2 text-xl  p-4 rounded-[10px] shadow-xl"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>

      <hr className="mx-4 mb-4 border-1 border-primary" />

      <div className="flex flex-col items-center mb-[6%] w-full ">
        <h1 className="text-4xl mb-4 font-bold font-Aboreto text-primary">
          Reviews
        </h1>
        <div className="flex flex-row justify-evenly w-fit bg-secondary p-4 rounded-xl">
          <div className="text-[20px] font-BreeSerif text-primary mx-10">
            Overall Rating
            <br />
            <div className="text-6xl">{overallRating.toFixed(1)}</div>
            <div className="flex flex-col">
              <div className="flex flex-row text-[20px]">
                <ProgressBar ratings={reviews.map((review) => review.rating)} />
              </div>
            </div>
          </div>
          <div className="text-[20px] font-BreeSerif text-primary mx-10">
            <div className="text-[30px]">Add Your Review</div>
            <form onSubmit={AddReview} noValidate>
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
              <div className="flex flex-row font justify-between w-fit my-4">
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
              <AddButton onClick={AddReview} />
            </form>
          </div>
        </div>
      </div>

      <div className="mx-16">
        <ReviewCard reviews={product.reviews} profile={userProfile} id={id} />
      </div>
      <div className="h-20" />
      <Footer />
    </div>
  );
};

export default ProductPage;
