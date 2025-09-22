import { useState, useEffect } from 'react'
import { enqueueSnackbar } from 'notistack';
import Spinner from '../../components/Spinner';
import CustomerNavbar from '../../components/navbar/CustomerNavbar';
import Footer from '../../components/footer/Footer';
import ViewPayment from './ViewPayment';
import DeleteOrder from './DeleteOrder';
import axios from 'axios';

const Order = () => {

  const [userID, setuserID] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, { token: token })
      .then((response) => {
        setuserID(response.data.userId)
        if (response.data.success === false) {
          window.location.href = "/login";
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showPayment, setShowPayment] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [id, setId] = useState(null);
  const [pay, setPaymentId] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());               //update the time and date once every 10 secs
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  function Completed() {
    const statuses = ["delivered", "canceled"];
    const filteredData = orders.filter((opt) =>   //some() method checks whether at least one element in an array satisfies a given condition
      statuses.some((status) => opt.status.toLowerCase().includes(status)));
    setCompleted("bg-secondary");
    setOngoing("");
    setFilteredData(filteredData);
  }

  function Ongoing(data) {
    const statuses = ["delivered", "canceled"];
    const filteredData = data.filter((opt) =>   //some() method checks whether at least one element in an array satisfies a given condition
      !statuses.some((status) => opt.status.toLowerCase().includes(status)));
    setCompleted("");
    setOngoing("bg-secondary");
    setFilteredData(filteredData);
  }

  useEffect(() => {
    if(userID)
    {setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${userID}`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        Ongoing(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        enqueueSnackbar("Error fetching orders", { variant: "error" });
      }, [ongoing]);}
  }, [userID]);

  if (loading) {
    return <Spinner />
  }
  return (
    <div className='flex flex-col'>
      <CustomerNavbar />
      <div className='flex flex-row'>
        <div className='w-fit min-h-[50vh]'></div>
        <div className='flex flex-col w-full'>
          <h1 className='text-center text-5xl font-Aboreto font-bold py-5 text-primary'>YOUR ORDERS</h1>
          <div className='font-Philosopher text-3xl text-center'>
            <button
              className={`px-5 py-1 rounded-xl text-primary ${ongoing}`}
              onClick={() => Ongoing(orders)}
            >
              Ongoing Orders
            </button>
            <button
              className={`px-5 py-1 rounded-xl text-primary ml-10 ${completed}`}
              onClick={() => Completed()}
            >
              Completed Orders
            </button>
          </div>
          <div className='mt-10'>
            {filteredData.map((order) => {
              const time = new Date(order.createdAt);
              const time2 = new Date(date);

              var diff =
                (time2.getFullYear() - time.getFullYear()) * 525600 +
                (time2.getMonth() - time.getMonth()) * 43200 +
                (time2.getDate() - time.getDate()) * 1440 +
                (time2.getHours() - time.getHours()) * 60 +
                (time2.getMinutes() - time.getMinutes());

              return (
                <div
                  className='flex flex-row justify between w-fit font-BreeSerif mt-10 bg-secondary mx-10 p-5 rounded-xl shadow-lg'
                  key={order._id}
                >
                  <div>
                    <p className='text-primary'>Order id : &nbsp;{order._id}</p>
                    <h1 className='text-primary mt-3'>Placed on: &nbsp;{time.toString()}</h1>
                    <h1 className='mt-3 text-primary'>Items: &nbsp;{ }</h1>
                    <div className='text-primary'>
                      {order.products.map((product) => (
                        <div key={product._id}>
                          <h1>{product.name}&nbsp;x&nbsp;{product.quantity}&nbsp;x&nbsp;Rs.{product.price}.00</h1>
                        </div>
                      ))}
                    </div>
                    <h1 className='text-primary mt-3'>Total: &nbsp;Rs.{order.total}.00</h1>
                    <h1 className='mt-3 text-primary'>Current Progress: &nbsp;{order.status}</h1>
                  </div>
                  <div className='flex flex-row justify between'>
                    <button
                      onClick={() => {
                        setPaymentId(order.paymentId), setShowPayment(true);
                      }}
                      className='rounded-xl self-end text-white w-fit h-fit bg-primary hover:bg-sky-800 py-2 px-5'
                    >
                      View Payment Information
                    </button>

                    <div className='flex items-end ml-3'>
                      {order.status === "canceled" || order.status === "Canceled" ? (
                        <p className="text-red-600">Order Cancelled</p>
                      ) : (
                        order.status === "Delivered" ? (
                          <p className="text-red-600">Order Delivered</p>
                        ) : (
                          diff <= 120 && order.status !== "Canceled" ? (
                            <button
                              onClick={() => {
                                setId(order._id), setShowDelete(true);
                              }}
                              className="rounded-xl text-white h-fit bg-red-500 hover:bg-red-600 py-2 px-4"
                            >
                              Cancel Order
                            </button>
                          ) : (
                            <p className="text-red-600">You cannot delete your order after 2 hours</p>
                          )
                        )
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {showPayment && (
        <ViewPayment paymentId={pay} onClose={() => setShowPayment(false)} />
      )}
      {showDelete && (
        <DeleteOrder id={id} onClose={() => setShowDelete(false)} />
      )}
      <div className=" h-20"/>
      <Footer />
    </div>
  )
}

export default Order