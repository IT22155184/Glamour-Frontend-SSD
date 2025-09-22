import { MdOutlineCancel } from "react-icons/md";
import PropTypes from "prop-types";
import html2pdf from "html2pdf.js";

const ViewBill = ({ bill, onClose }) => {
  const downloadPDF = () => {
    const opt = {
      margin: 1,
      filename: bill._id + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    var element = document.getElementById("bill");
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[600px] max-w-full h-auto bg-white rounded-xl p-4 flex flex-col relative"
      >
        <h1 className="text-3xl my-4 font-Aboreto text-primary font-bold text-center">
          View Bill
        </h1>
        <MdOutlineCancel
          className="absolute top-6 right-6 text-3xl text-red-600 cursor-pointer"
          onClick={onClose}
        />
        <div
          className="flex flex-col w-full items-center font-BreeSerif rounded-xl"
          id="bill"
        >
          <div className="flex flex-row w-full justify-between p-2">
            <span className="font-semibold">Bill ID:</span>
            <span>{bill._id}</span>
          </div>
          <div className="flex flex-row w-full justify-between p-2">
            <span className="font-semibold">Date:</span>
            <span>{new Date(bill.createdAt).toDateString()}</span>
          </div>
          <div className="flex flex-col w-full p-2">
            <span className="font-semibold">Delivery Details:</span>
              <div className="flex flex-row">
                <div className="flex flex-col pr-4">
                  <span>Name: </span>
                  <span>Phone: </span>
                  <span>Address: </span>
                  <span>Postal Code: </span>
                </div>
                <div className="flex flex-col">
                  <span>{bill.deliveryInfo.firstName}{" "}{bill.deliveryInfo.lastName}</span>
                  <span>{bill.deliveryInfo.contact}</span>
                  <span>{bill.deliveryInfo.address}{", "}{bill.deliveryInfo.district}{", "}{bill.deliveryInfo.province}{"."}</span>
                  <span>{bill.deliveryInfo.postalCode}</span>
                </div>
              </div>
          </div>
          <div className="flex flex-col w-full p-2">
            <span className="font-semibold">Products:</span>
            {bill.products.map((product, index) => (
              <div className="flex justify-between" key={index}>
                {product.name} - {product.color} - {product.size} -{" "}
                {product.quantity}{" "}
                <div> Rs.{product.price * product.quantity}.00</div>
              </div>
            ))}
          </div>
          <div className=" w-full p-2 flex justify-between font-semibold">
            Delivery fee: <div className=" font-normal">Rs.500.00</div>
          </div>
          <div className="flex flex-row w-full justify-between p-2">
            <span className="font-semibold">Total:</span>
            <span>Rs.{bill.total}.00</span>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <button
            onClick={downloadPDF}
            className="bg-black text-white font-BreeSerif py-2 px-4 rounded"
          >
            Download Bill
          </button>
        </div>
      </div>
    </div>
  );
};

ViewBill.propTypes = {
  bill: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewBill;
