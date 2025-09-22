import { MdOutlineCancel } from "react-icons/md";
import PropTypes from "prop-types";

const ViewDeliveryDetails = ({ delivery, onClose }) => {
  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[600px] max-w-full h-auto bg-white rounded-xl p-4 flex flex-col relative"
      >
        <h1 className="text-3xl my-4 font-Aboreto font-bold text-primary text-center">
          View Delivery Details
        </h1>
        <MdOutlineCancel
          className="absolute top-6 right-6 text-3xl text-red-600 cursor-pointer"
          onClick={onClose}
        />
        <div className="flex flex-col w-full items-center font-BreeSerif rounded-xl">
          <div className="flex flex-row justify-between" >
            <div className="flex flex-col">
              <label className="ml-0.5 mb-1">First name</label>
              <input
                className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                type="text"
                readOnly
                value={delivery.firstName}
              />
            </div>
            <div className="flex flex-col ml-10">
              <label className="ml-0.5 mb-1">Last name</label>
              <input
                className="h-11 p-2  border-gray-200 rounded-md border-2  shadow-sm "
                readOnly
                type="text"
                value={delivery.lastName}
              />
            </div>
          </div>
          {/*contact*/}
          <div className="flex flex-row mt-5 justify-between" >
            <div className="flex flex-col">
              <label className="ml-0.5 mb-1">Contact number</label>
              <input
                className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                readOnly
                type="text"
                value={delivery.contact}
              />
            </div>
            <div className="flex flex-col ml-10">
              <label className="ml-0.5 mb-1">Email</label>
              <input
                className="h-11 p-2  border-gray-200 rounded-md border-2  shadow-sm "
                readOnly
                type="email"
                value={delivery.email}
              />
            </div>
          </div>
          <div className="flex flex-row mt-5 justify-between" >
            <div className="flex flex-col">
              <label className="ml-0.5 mb-1">Address</label>
              <input
                className="h-11 p-2  border-gray-200 rounded-md border-2  shadow-sm "
                readOnly
                type="text"
                value={delivery.address}
              />
            </div>
            <div className="flex flex-col ml-10">
              <label className="ml-0.5 mb-1">Postal code</label>
              <input
                className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                readOnly
                type="text"
                value={delivery.postalCode}
              />
            </div>
          </div>
          <div className="flex flex-row mt-5 justify-between">
            <div className="flex flex-col">
              <label className="ml-0.5 mb-1">Province</label>
              <input
              readOnly
                className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                type="text"
                value={delivery.province}
              />
            </div>
            <div className="flex flex-col ml-10 ">
              <label className="ml-0.5 mb-1">District</label>
              <input
                readOnly
                className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                type="text"
                value={delivery.district}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewDeliveryDetails.propTypes = {
  delivery: PropTypes.object,
  onClose: PropTypes.func,
};

export default ViewDeliveryDetails;
