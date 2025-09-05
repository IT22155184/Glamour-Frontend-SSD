import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import Spinner from '../../components/Spinner';
import CustomerNavbar from '../../components/navbar/CustomerNavbar';
import Footer from '../../components/footer/Footer';

const PaymentSuccessReport = () => {
  const [successPayment, setSuccessPayment] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const reportRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/payment/${id}`)
      .then((response) => {
        setSuccessPayment(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const downloadPDF = () => {

    const opt = {
      margin: 1,
      filename: `PaymentDetailReport_${id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(reportRef.current).set(opt).save();
  };

  return (
    <div>
      <CustomerNavbar/>
      <div>
      <center>
        <h1 className="text-center font-Aboreto font-bold text-5xl mt-8 mb-5 text-primary">
          Payment Successful!
        </h1>
      </center>
      {loading ? (
        <Spinner />
      ) : (
        <div ref={reportRef} className="flex flex-col bg-secondary rounded-xl w-[600px] p-8 mx-auto font-BreeSerif text-primary mb-5">
          <div className="flex flex-row">
            <img src="/Logo2.png" alt="logo" className="w-[24rem] h-[5rem] lg:w-[24rem] lg:h-[5rem]" />
            <img src="/Logo1.png" alt="logo" className="w-[4rem] h-[5rem] lg:w-[4rem] lg:h-[5rem] ml-auto"/>
          </div>
          <h1 className="font-Philosopher text-2xl mt-4 mb-5 font-bold text-center text-primary">Payment Detail Report</h1>
          <div className="my-4 text-black">
            <span className="text-xl mr-4">Payment ID : </span>
            <span>{successPayment._id}</span>
          </div>
          <div className="my-4 text-black">
            <span className="text-xl mr-4">Customer Name : </span>
            <span>{successPayment.firstName} {successPayment.lastName}</span>
          </div>
          <div className="my-4 text-black">
            <span className="text-xl mr-4">Email : </span>
            <span>{successPayment.email}</span>
          </div>
          <div className="my-4 text-black">
            <span className="text-xl mr-4">Bank Name : </span>
            <span>{successPayment.bank}</span>
          </div>
          <div className="my-4 text-black">
            <span className="text-xl mr-4">Branch Name : </span>
            <span>{successPayment.branch}</span>
          </div>
          <div className="my-4 text-black">
            <span className="text-xl mr-4">Total Payment : </span>
            <span>Rs.{successPayment.totalPay}.00</span>
          </div>
          <div className="my-4 text-black">
            <span className="text-xl mr-4">Payment Slip : </span>
            <img
                src={successPayment.slip}
                alt="slip"
                style={{ width: "450px", height: "auto" }}
                className="border border-black border-1 p-2 block mb-2"
            />
          </div>
        </div>
      )}
      <div className="flex justify-center mb-4">
        <button onClick={downloadPDF} className="bg-black text-white p-3 rounded-md font-BreeSerif shadow-lg">
          Download Receipt
        </button>
      </div>
      </div>
      <div className='h-20'/>
      <Footer />
    </div>
  );
};

export default PaymentSuccessReport;
