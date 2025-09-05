import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import html2pdf from 'html2pdf.js';
import StoreNavbar from "../../components/navbar/staffheader/StoreNavbar";
import StaffFooter from "../../components/footer/stafffooter/StaffFooter";

const ModelSizesReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const reportRef = useRef(null);

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/measurements/range?startDate=${startDate}&endDate=${endDate}`);

      console.log(response.data);
      setData(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const countSizes = (data, gender, sizeType) => {
    if (!Array.isArray(data)) return {};

    return data
      .filter(measurement => measurement.Gender.toLowerCase() === gender.toLowerCase())
      .map(measurement => measurement[sizeType])
      .reduce((acc, size) => {
        acc[size] = (acc[size] || 0) + 1;
        return acc;
      }, {});
  };

  const downloadPDF = () => {
    const opt = {
      margin: 1,
      filename: 'Model_Sizes_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(reportRef.current).save();
  };

  const maleTopSizes = countSizes(data, 'male', 'TopSize');
  const femaleTopSizes = countSizes(data, 'female', 'TopSize');
  const malePantSizes = countSizes(data, 'male', 'PantSize');
  const femalePantSizes = countSizes(data, 'female', 'PantSize');

  return (
    <div className="w-full h-full bg-fixed bg-no-repeat" style={{ backgroundPosition: 'top right', backgroundSize: 'cover' }}>
      <StoreNavbar models={true} />
      <div className="bg-secondary flex flex-col items-center border-2 rounded-xl w-[600px] h-auto p-4 mx-auto font-BreeSerif mt-10 " ref={reportRef}>
        <h1 className="text-6xl text-center font-Aboreto text-primary font-semibold my-8 alignment-center">
          Model Sizes Report
        </h1>

        <div className='ml-10 mt-7 mb-10 flex flex-col items-center'> 
          <div className="flex items-center mb-4"> 
            <label>From: </label>
            <input
              className='h-11 p-2  border-gray-200 rounded-md border-2  shadow-sm mr-20'
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label>To: </label>
            <input
              className='h-11 p-2  border-gray-200 rounded-md border-2  shadow-sm mr-4'
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
            onClick={handleSubmit}
          >
            Generate
          </button>
        </div>


        {loading && <Spinner />}
        {error && <div>Error: {error}</div>}

        {/* Male Top Sizes */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Top Sizes for Male
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(maleTopSizes).map(([size, count]) => (
              <div key={size} className="flex items-center gap-4 p-4 space-x-4">
                <p className="text-lg font-semibold text-gray-600">Size:</p>
                <p>{size}</p>
                <p className="text-lg font-semibold text-gray-600">Count:</p>
                <p>{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Female Top Sizes */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Top Sizes for Female
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(femaleTopSizes).map(([size, count]) => (
              <div key={size} className="flex items-center gap-4 p-4 space-x-4">
                <p className="text-lg font-semibold text-gray-600">Size:</p>
                <p>{size}</p>
                <p className="text-lg font-semibold text-gray-600">Count:</p>
                <p>{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Male Pant Sizes */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Pant Sizes for Male
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(malePantSizes).map(([size, count]) => (
              <div key={size} className="flex items-center gap-4 p-4 space-x-4">
                <p className="text-lg font-semibold text-gray-600">Size:</p>
                <p>{size}</p>
                <p className="text-lg font-semibold text-gray-600">Count:</p>
                <p>{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Female Pant Sizes */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Pant Sizes for Female
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(femalePantSizes).map(([size, count]) => (
              <div key={size} className="flex items-center gap-4 p-4 space-x-4">
                <p className="text-lg font-semibold text-gray-600">Size:</p>
                <p>{size}</p>
                <p className="text-lg font-semibold text-gray-600">Count:</p>
                <p>{count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4 mb-4">
        <button onClick={downloadPDF} className="bg-black text-white font-BreeSerif py-2 px-4 rounded">
          Download PDF
        </button>
      </div>
      <StaffFooter />
    </div>
  );
};

export default ModelSizesReport;
