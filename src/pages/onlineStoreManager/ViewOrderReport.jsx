// eslint-disable-next-line no-unused-vars
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import StoreNavbar from "../../components/navbar/staffheader/StoreNavbar.jsx";
import StaffFooter from "../../components/footer/stafffooter/StaffFooter.jsx";
import Spinner from "../../components/Spinner";
import TableView from "../../components/table/TableView";
import { enqueueSnackbar } from "notistack";
import html2pdf from "html2pdf.js";

const ViewOrderReport = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const reportRef = useRef(null);

  const headers = [
    "Order ID",
    "Order Date",
    "Products",
    "Total Amount",
    "Status",
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/orders/monthly`, { params: { month, year } })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        enqueueSnackbar("Error fetching orders", { variant: "error" });
      });
  }, [month, year]);

  const downloadPDF = () => {
    const opt = {
      margin: 1,
      filename: "MonthlyOrderReport.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a3", orientation: "portrait" },
    };
    // var element = document.getElementById("mOrders");
    html2pdf().from(reportRef.current).set(opt).save();
  };

  return (
    <div
      className="w-full h-full bg-secondary"
      /*bg-fixed bg-no-repeat bg-bgform 
      style={{ backgroundPosition: "top right", backgroundSize: "cover" }}*/
    >
      <StoreNavbar home={true} />
      <h1 className="text-6xl my-8 font-semibold font-Aboreto text-center text-primary">
        Monthly Order Report
      </h1>

      <div className="flex flex-row justify-center">
        <div className="border mx-[1.75%] border-black rounded-lg w-fit my-8 flex flex-row bg-white">
          <h1 className="text-2xl font-BreeSerif text-primary m-12">
            Download Monthly Order Report
          </h1>
          <button
            type="submit"
            className="w-fit h-fit p-1.5 text-lg font-BreeSerif bg-primary text-white rounded-lg shadow-md m-12"
            onClick={downloadPDF}
          >
            Download Report
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center" ref={reportRef}>
        <div className="border mx-[1.75%] border-black rounded-lg w-fit my-8 flex flex-row bg-white">
          <h1 className="text-2xl font-BreeSerif text-primary m-6">
            Total Orders: {orders.length}
          </h1>
          <h1 className="text-2xl font-BreeSerif text-primary m-6">
            Total Sales: Rs.{" "}
            {orders.reduce((acc, order) => acc + order.total, 0)}
          </h1>
          <h1 className="text-2xl font-BreeSerif text-primary m-6">
            Total Products Sold:{" "}
            {orders.reduce((acc, order) => acc + order.products.length, 0)}
          </h1>
        </div>

        <div className="flex justify-center my-4">
          <label className="text-xl font-BreeSerif text-primary mr-4">Month</label>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Month"
            className="p-2 border-2 rounded-md border-ternary font-BreeSerif mr-10"
          />
          <label className="text-xl font-BreeSerif text-primary mr-4">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="p-2 border-2 rounded-md border-ternary font-BreeSerif"
          />
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <table className="min-w-full font-BreeSerif bg-white">
            <TableView headers={headers} />
            <tbody>
              {orders.map((order) => {
                const date = new Date(order.createdAt);
                console.log(order);
                return (
                  <tr key={order._id} className="h-8 font-BreeSerif">
                    <td className="border border-slate-700 text-center">
                      {order._id}
                    </td>
                    <td className="border border-slate-700 text-center">
                      {date.toLocaleDateString()}
                    </td>
                    <td className="border border-slate-700 text-center">
                      {order.products.map((product, index) => (
                        <div key={index}>
                          {product.product} - {product.color} - {product.size} -{" "}
                          {product.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="border border-slate-700 text-center">
                      {order.total}
                    </td>
                    <td className="border border-slate-700 text-center">
                      {order.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <br />
      <br />
      <br />
      <StaffFooter />
    </div>
  );
};

export default ViewOrderReport;
