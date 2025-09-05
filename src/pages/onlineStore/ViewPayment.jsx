import { MdOutlineCancel } from "react-icons/md";
import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";

const ViewPayment = ({ paymentId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [successPayment, setSuccessPayment] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/payment/${paymentId}`)
      .then((response) => {
        setSuccessPayment(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error);
        setLoading(false);
      });
  }, [paymentId]);

  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='w-[600px] max-w-full h-auto bg-secondary rounded-xl p-4 flex flex-col relative'
      >
        <h1 className="text-3xl my-4 font-Aboreto text-primary font-bold text-center">
          View Payment
        </h1>
        <MdOutlineCancel
          className="absolute top-6 right-6 text-3xl text-red-600 cursor-pointer"
          onClick={onClose}
        />
        <div
          className="flex flex-col w-full font-BreeSerif rounded-xl"
          id="bill"
        >
          <br />
          <div className="mb-2">
            <span className="font-bold">Full Name: </span>
            {successPayment.firstName} {successPayment.lastName}
          </div>
          <div className="mb-2">
            <span className="font-bold">Email Address: </span>
            {successPayment.email}
          </div>
          <div className="mb-2">
            <span className="font-bold">Phone Number: </span>
            0{successPayment.contact}
          </div>
          <div className="mb-2">
            <span className="font-bold">Bank Name: </span>
            {successPayment.bank}
          </div>
          <div className="mb-2">
            <span className="font-bold">Branch: </span>
            {successPayment.branch}
          </div>
          <div className="mb-2">
            <span className="font-bold">Total Amount: </span>
            Rs.{successPayment.totalPay}.00
          </div>
          <div>
            <span className="font-bold">Slip Upload:</span>
            <img
              src={successPayment.slip}
              alt="slip"
              style={{ width: "450px", height: "auto" }}
              className="border border-black border-1 p-2 block mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ViewPayment.propTypes = {
  paymentId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ViewPayment;
