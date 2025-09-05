import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import CustomerNavbar from "../../components/navbar/CustomerNavbar";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import { enqueueSnackbar } from "notistack";
import Spinner from "../../components/Spinner.jsx";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const totalRef = useRef(0);
  const [userID, setuserID] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/login/auth`, { token: token })
        .then((response) => {
            setuserID(response.data.userID)
            if (response.data.status === false) {
                window.location.href = "/login";
            }else {
                axios
                    .get(`${import.meta.env.VITE_API_BASE_URL}/cart/${response.data.userID}`)
                    .then((response) => {
                        setCart(response.data);
                        console.log(response.data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log(err);
                        setLoading(false);
                    });
            }  
        })
        .catch((err) => {
            console.log(err);
        });
});


  const loadCart = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/cart/${userID}`)
      .then((response) => {
        setCart(response.data);
        console.log(response.data);2
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
      });
    if (!loading) {
      let total = 0;
      cart.forEach((item) => {
        total += item.product.minprice * item.quantity;
      });
      totalRef.current = total;
      setTotal(total);
    }
  };

  useEffect(() => {
    if (!loading) {
      let total = 0;
      cart.forEach((item) => {
        total += item.product.minprice * item.quantity;
      });
      totalRef.current = total;
      setTotal(total);
    }
  }, [cart, loading]);

  const handleMinus = (id) => {
    if (cart.find((item) => item._id === id).quantity <= 1) {
      handleDelete(id);
    }
    axios
      .put(`${import.meta.env.VITE_API_BASE_URL}/cart/minus/${userID}/${id}`)
      .then(() => {
        loadCart();
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Error", { variant: "error" });
      });
  };
  const handlePlus = (itemId, productId) => {
    if (cart.find((item) => item._id === itemId).quantity >= 5) {
      enqueueSnackbar("You can only order 5 items at a time", {
        variant: "error",
      });
      return;
    }
    if (
      cart.find((item) => item._id === itemId).quantity >=
      cart.find((item) => item._id === itemId).product.stock
    ) {
      enqueueSnackbar(
        `Only ${
          cart.find((item) => item._id === itemId).product.stock
        }  available in the stock`,
        { variant: "error" }
      );
      return;
    }
    axios
      .put(`${import.meta.env.VITE_API_BASE_URL}/cart/plus/${userID}/${itemId}/${productId}`)
      .then(() => {
        loadCart();
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Error", { variant: "error" });
      });
  };



  const handleDelete = (id) => {
    setLoading(true);
    axios
      .put(`${import.meta.env.VITE_API_BASE_URL}/cart/${userID}/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Item removed", { variant: "success" });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
      });
    window.location.reload(false);
  };

  const isCheckoutDisabled = cart.some(item => item.product.stock <= 0 || item.product.stock < item.quantity);

  const handleCheckoutClick = (e) => {
    if (isCheckoutDisabled) {
      e.preventDefault();
      enqueueSnackbar("Some items are out of stock or low on stock. Please review your cart.", { variant: "error" });
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col w-full">
      <CustomerNavbar />
      <h1 className="text-center font-Aboreto font-bold text-5xl mt-8 text-primary">
        CART
      </h1>
      <div className="flex flex-row justify-between">
        {/* cart items */}
        <div disabled className="flex flex-col w-3/4 ">
          {cart.map((item, index) =>
            item.product.stock === 0 ? (
              <div
                key={index}
                className="flex flex-row mx-8 my-5 justify-between mr-32 h-32 items-center rounded-lg p-5 shadow-md bg-gray-100 opacity-75 border-red-500 border-2"
              >
                {/* description */}
                <div className="flex flex-row">
                  <img src={item.product.image} className="w-20 h-20" />
                  <div className="flex flex-col ml-3">
                    <p className="font-BreeSerif">{item.product.name}</p>
                    <div className="flex flex-row font-BreeSerif">
                      <p>Size :&nbsp;</p>
                      <p>{item.size}</p>
                    </div>
                    <div className="flex flex-row font-BreeSerif">
                      <p>Color :&nbsp;</p>
                      <p>{item.color}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-red-600 font-bold font-BreeSerif">Out of Stock</p>
                </div>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(item._id)}
                >
                  <MdOutlineDelete className="text-3xl" />
                </button>
              </div>
            ) : (
              <div
                key={index}
                className={`flex flex-row bg-secondary mx-8 my-5 justify-between mr-32 h-32 items-center rounded-lg p-5 shadow-md ${
                  item.product.stock < item.quantity ? "border-red-500 border-2 bg-gray-100 opacity-75" : ""
                }`}
              >
                {/* description */}
                <div className="flex flex-row">
                  <img src={item.product.image} className="w-20 h-20" />
                  <div className="flex flex-col ml-3">
                    <p className="font-BreeSerif">{item.product.name}</p>
                    <div className="flex flex-row font-BreeSerif">
                      <p>Size :&nbsp;</p>
                      <p>{item.size}</p>
                    </div>
                    <div className="flex flex-row font-BreeSerif">
                      <p>Color :&nbsp;</p>
                      <p>{item.color}</p>
                    </div>
                  </div>
                </div>
                {/* Stock Warning */}
                {item.product.stock < item.quantity && (
                  <div className="text-red-600 font-bold font-BreeSerif">
                    Only {item.product.stock} left in stock
                  </div>
                )}
                {/* amount */}
                <div className="flex justify-evenly w-32 h-8">
                  <button
                    onClick={() => handleMinus(item._id)}
                    disabled={item.quantity === 1}
                  >
                    <FiMinusCircle className="text-3xl text-primary" />
                  </button>
                  <p className="font-BreeSerif border-2 p-0.5 px-2 mx-3 border-primary">
                    {item.quantity}
                  </p>
                  <button
                    onClick={() => handlePlus(item._id, item.product._id)}
                    disabled={item.product.stock <= item.quantity}
                  >
                    <FiPlusCircle
                      className={`text-3xl ${
                        item.product.stock <= item.quantity ? "text-gray-400" : "text-primary"
                      }`}
                    />
                  </button>
                </div>
                <p className="font-BreeSerif">
                  {"Rs." + item.product.minprice * item.quantity + ".00"}
                </p>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(item._id)}
                >
                  <MdOutlineDelete className="text-3xl" />
                </button>
              </div>
            )
          )}
        </div>
        {/* order summary */}
        <div className="flex flex-col w-1/4 h-fit mr-8 bg-secondary p-5 rounded-lg shadow-md">
          <h1 className=" font-Philosopher text-2xl mb-5 font-bold text-primary">
            Order Summary
          </h1>
          <div className="flex flex-row justify-between mb-2 font-BreeSerif">
            <p>Sub Total</p>
            <p className=" ">{total}</p>
          </div>
          <div className="flex flex-row justify-between mb-2 font-BreeSerif">
            <p>Sipping Fee</p>
            <p className=" ">500</p>
          </div>
          <hr className="my-3 font-extrabold border-ternary border-1" />
          <div className="flex flex-row justify-between font-BreeSerif">
            <p>Total</p>
            <p className=" ">{total + 500}</p>
          </div>
          <hr className="my-3 font-extrabold border-ternary border-2" />
          {cart.length > 0 && (
            <Link
              to="/Checkout"
              className="flex flex-row w-full justify-center"
              onClick={handleCheckoutClick}
            >
              <button className="bg-ternary text-bgc p-3 rounded-md font-BreeSerif shadow-lg">
                Proceed to Checkout
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="h-[300px]"></div>
      <Footer />
    </div>
  );
};

export default Cart;
