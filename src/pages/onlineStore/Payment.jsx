import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import CustomerNavbar from '../../components/navbar/CustomerNavbar';
import Footer from '../../components/footer/Footer';
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { enqueueSnackbar } from "notistack";
import { getAccessToken, getUserData } from '../../utils/auth';

const Payment = () => {
    const [userID, setuserID] = useState(0);

    useEffect(() => {
        const token = getAccessToken();
        const userData = getUserData();
        axios
            .post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, { token: token, userType: userData?.role || 'customer' })
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

    // const [payment, setPayment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [slip, setSlip] = useState("");
    const [cart, setCart] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState([]);
    const [total, setTotal] = useState(0);
    const totalRef = useRef(0);
    const navigate = useNavigate();

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [contactError, setContactError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [slipError, setSlipError] = useState("");

    function validateFirstName(firstName) {
        let isValid = true;
        const nameRegex = /^[a-zA-Z]+$/;
        setFirstNameError("");
        if (!nameRegex.test(firstName)) {
            setFirstNameError("First name should be in alphabets only");
            isValid = false;
        }
        if (firstName === "") {
            setFirstNameError("First name is required");
            isValid = false;
        }
        return isValid;
    }

    function validateLastName(lastName) {
        let isValid = true;
        const nameRegex = /^[a-zA-Z]+$/;
        setLastNameError("");
        if (!nameRegex.test(lastName)) {
            setLastNameError("Last name should be in alphabets only");
            isValid = false;
        }
        if (lastName === "") {
            setLastNameError("Last name is required");
            isValid = false;
        }
        return isValid;
    }

    function validateContact(contact) {
        let isValid = true;
        const contactRegex = /^[0-9]{9}$/;
        setContactError("");
        if (!contactRegex.test(contact)) {
            setContactError("Contact should contain only 10 digits");
            isValid = false;
        }
        if (contact === "") {
            setContactError("Contact Number is required");
            isValid = false;
        }
        return isValid;
    }

    function validateEmail(email) {
        let isValid = true;
        const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
        setEmailError("");
        if (!emailRegex.test(email)) {
            setEmailError("Invalid email address");
            isValid = false;
        }
        if (email === "") {
            setEmailError("Email is required");
            isValid = false;
        }
        return isValid;
    }

    function validateSlip(email) {
        let isValid = true;
        setSlipError("");
        if (email === "") {
            setSlipError("Payment slip is required");
            isValid = false;
        }
        return isValid;
    }

    //Fetching delivery info
    useEffect(() => {
        if (userID) {
            const deliveryid = localStorage.getItem("deliveryInfoId");
            setLoading(true);
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/deliveryInfo/delivery/${deliveryid}`)
                .then((response) => {
                    setDeliveryInfo(response.data);
                }).catch((error) => {
                    console.error(error);
                });
        }
    }, [userID]);

    //fetch cart items
    useEffect(() => {
        if (userID) {
            setLoading(true);
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart/${userID}`)
                .then((response) => {
                    setCart(response.data);
                    setLoading(false);
                }).catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [userID]);

    //Calculate and display total amount needed to be paid
    useEffect(() => {
        if (!loading) {
            let total = 0;  //declare a variable as total and initialize it to 0
            cart.forEach((item) => {
                total += item.product.minprice * item.quantity;
            });
            totalRef.current = total;
            setTotal(total);
        }
    }, [cart, loading]);  //total is re-calculates when the cart is updated

    const handleSubmit = async (e) => {
        e.preventDefault();  //ensure form submisssion does not reload the page

        const isValidFirstName = validateFirstName(firstName);
        const isValidLastName = validateLastName(lastName);
        const isValidContact = validateContact(contact);
        const isValidEmail = validateEmail(email);
        const isValidSlip = validateSlip(slip);

        if (isValidFirstName && isValidLastName && isValidContact && isValidEmail && isValidSlip) {
            const payment = {
                firstName: firstName,
                lastName: lastName,
                contact: contact,
                email: email,
                bank: "Bank of Ceylon",  // Hardcoded bank name
                branch: "Kaduwela",
                totalPay: total + 500,     // Hardcoded branch name
                slip: slip,
            };

            sessionStorage.setItem("total", total + 500);

            try {
                setLoading(true);
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment`, payment);
                setLoading(false);

                const paymentId = response.data._id;

                const products = cart.map((item) => ({
                    product: item.product.productId,
                    name: item.product.name,
                    price: item.product.minprice,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                }));

                const ordercon = {
                    userId: userID,
                    products: products,
                    deliveryInfo: deliveryInfo,
                    total: total + 500,
                    paymentId: paymentId,
                };
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders`, ordercon);

                //after a successful payment clear the cart
                await clearCartItems(userID);

                enqueueSnackbar("Payment Successful", { variant: "success" });
                navigate(`/SuccessPayment/${paymentId}`);
            } catch (error) {
                console.error(error);
                setLoading(false);
                enqueueSnackbar("Payment Unsuccessful", { variant: "error" });
            }
        } else {
            enqueueSnackbar("Please fill all the required fields", { variant: "error" });
        }
    }

    const handleImageUpload = async (file) => {
        const base64 = await convertToBase64(file);
        setSlip(base64)
    }
    if (loading) {
        return <Spinner />;
    }

    //clear the cart after the payment
    const clearCartItems = async (userID) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cart/${userID}`);
            setCart([]);
            // enqueueSnackbar("Cart cleared successfully", { variant: "success" });
        } catch (error) {
            console.error("Error clearing the cart: ", error);
            // enqueueSnackbar("Error clearing cart", { variant: "error" });
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} noValidate>
                <CustomerNavbar />
                <h1 className="text-center font-Aboreto font-bold text-5xl mt-8 mb-5 text-primary">PAYMENT</h1>
                <div className="flex flex-row w-full justify-between font-BreeSerif">
                    {/*for Payment*/}
                    <div className="flex flex-col w-[30rem] mx-16 h-fit bg-secondary p-5 rounded-lg shadow-md">
                        <h2 className="font-Philosopher text-2xl mb-5 font-bold text-primary">Payment Information</h2>

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <div>
                                    <label className="ml-0.5 mb-1">First Name</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {firstNameError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {firstNameError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input
                                    className="h-11 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    type="text"
                                    id="name"
                                    value={firstName}
                                    name="firstName"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col ml-10">
                                <div>
                                    <label className="ml-0.5 mb-1">Last Name</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {lastNameError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {lastNameError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input
                                    className="h-11 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    type="text"
                                    id="name"
                                    value={lastName}
                                    name="lastName"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row mt-5 justify-between">
                            <div className="flex flex-col">
                                <div>
                                    <label className="ml-0.5 mb-1">Contact Number</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {contactError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {contactError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex flex-row">
                                    <p className="p-2 border-gray-200 border-2 rounded-l-md">+94</p>
                                    <input
                                        className="h-11 w-40 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                        type="text"
                                        id="contact"
                                        value={contact}
                                        name="contact"
                                        onChange={(e) => setContact(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ml-10">
                                <div>
                                    <label className="ml-0.5 mb-1">Email</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {emailError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {emailError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input
                                    className="h-11 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    type="text"
                                    id="email"
                                    value={email}
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row mt-5 justify-between">
                            <div className="flex flex-col">
                                <div>
                                    <label className="ml-0.5 mb-1">Bank Name</label>
                                </div>
                                <input
                                    className="h-11 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    type="text"
                                    id="bank"
                                    defaultValue="Bank of Ceylon"
                                    name="bank"
                                />
                            </div>
                            <div className="flex flex-col ml-10">
                                <div>
                                    <label className="ml-0.5 mb-1">Branch Name</label>
                                </div>
                                <input
                                    className="h-11 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    type="text"
                                    id="branch"
                                    defaultValue="Kaduwela"
                                    name="branch"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row mt-5 justify-between">
                            <div className="flex flex-col">
                                <div>
                                    <label className="ml-0.5 mb-1">Total Payment</label>
                                </div>
                                <input
                                    className="h-11 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    type="number"
                                    id="payment"
                                    value={total + 500}
                                    name="payment"
                                    readOnly
                                />
                            </div>
                            <div className="flex flex-col ml-10">
                                <div>
                                    <label className="ml-0.5 mb-1">Upload Bank Slip</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {slipError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {slipError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                    <input
                                        type="file"
                                        name="slip"
                                        id="slip"
                                        accept=".jpeg, .png, .jpg, .pdf"
                                        className="text-primary font-bold p-3 rounded-md font-BreeSerif"
                                        onChange={(e) => handleImageUpload(e.target.files[0])}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="bg-ternary text-primary font-bold p-3 rounded-md font-BreeSerif shadow-lg mt-5"
                        >
                            Proceed & Pay
                        </button>
                    </div>
                    {/*for payment info*/}
                    <div className="flex flex-col w-1/4 mr-8 h-fit bg-secondary p-5 rounded-lg shadow-md">
                        <h2 className="font-Philosopher text-2xl font-bold text-primary items-center">Bank Details</h2>
                        <div className="my-1">
                            <p>Account No : 1000 1234 6500 3000</p>
                            <p>Account Name : Glamour</p>
                            <p>Bank Name : Bank of Ceylon</p>
                            <p>Branch Name : Kaduwela</p>
                        </div>
                        <hr className="my-3 font-extrabold border-ternary border-1" />
                        <div className="flex flex-row justify-between font-BreeSerif">
                            <p>Total Amount</p>
                            <p> {total + 500} </p>
                        </div>
                        <hr className="my-3 font-extrabold border-ternary border-2" />
                    </div>
                </div>
            </form>
            <div className=' h-20'/>
            <Footer />
        </div>
    );
};

export default Payment;

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error)
        };
    });
}