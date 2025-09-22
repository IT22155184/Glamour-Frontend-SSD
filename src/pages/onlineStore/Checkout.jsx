import CustomerNavbar from "../../components/navbar/CustomerNavbar";
import Footer from "../../components/footer/Footer.jsx";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getAccessToken, getUserData } from "../../utils/auth";
import { provinces, districts } from "../../utils/arrays.js";
import Spinner from "../../components/Spinner";
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

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

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const totalRef = useRef(0);
    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [contactError, setContactError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [provinceError, setProvinceError] = useState("");
    const [districtError, setDistrictError] = useState("");
    const [postalCodeError, setPostalCodeError] = useState("");

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

    function validateAddress(address) {
        let isValid = true;
        setAddressError("");
        if (address === "") {
            setAddressError("Address is required");
            isValid = false;
        }
        return isValid;
    }

    function validateProvince(province) {
        let isValid = true;
        setProvinceError("");
        if (province === "") {
            setProvinceError("Province is required");
            isValid = false;
        }
        return isValid;
    }

    function validateDistrict(district) {
        let isValid = true;
        setDistrictError("");
        if (district === "") {
            setDistrictError("District is required");
            isValid = false;
        }
        return isValid;
    }

    function validatePostalCode(postalCode) {
        let isValid = true;
        const pCodeRegex = /^[0-9]{5}$/;
        setPostalCodeError("");
        if (!pCodeRegex.test(postalCode)) {
            setPostalCodeError("Postal Code should contain only 5 digits");
            isValid = false;
        }
        if (postalCode === "") {
            setPostalCodeError("Postal Code is required");
            isValid = false;
        }
        return isValid;
    }

    //Fetching delivery info
    useEffect(() => {
        if (userID) {
            setLoading(true);
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/deliveryInfo/${userID}`)
                .then((response) => {
                    setInfo(response.data);
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

    //Handle delivery info change
    const handleInfoChange = (e) => {
        const selectedIndex = e.target.value;
        if (selectedIndex === "") {
            setId("");
            setFirstName("");
            setLastName("");
            setContact("");
            setEmail("");
            setAddress("");
            setPostalCode("");
            setProvince("");
            setDistrict("");
        } else {
            setId(info[selectedIndex]._id);
            setFirstName(info[selectedIndex].firstName);
            setLastName(info[selectedIndex].lastName);
            setContact(info[selectedIndex].contact);
            setEmail(info[selectedIndex].email);
            setAddress(info[selectedIndex].address);
            setPostalCode(info[selectedIndex].postalCode);
            setProvince(info[selectedIndex].province);
            setDistrict(info[selectedIndex].district);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();  //ensure form submisssion does not reload the page
        const isValidFirstName = validateFirstName(firstName);
        const isValidLastName = validateLastName(lastName);
        const isValidContact = validateContact(contact);
        const isValidEmail = validateEmail(email);
        const isValidAddress = validateAddress(address);
        const isValidPostalCode = validatePostalCode(postalCode);
        const isValidProvince = validateProvince(province);
        const isValidDistrict = validateDistrict(district);

        if (isValidFirstName && isValidLastName && isValidContact && isValidEmail && isValidAddress && isValidPostalCode && isValidProvince && isValidDistrict) {
            const deliveryInfo = {
                firstName: firstName,
                lastName: lastName,
                contact: contact,
                email: email,
                address: address,
                postalCode: postalCode,
                province: province,
                district: district
            };

            // sessionStorage.setItem("total", total + 500);
            if (!id) {
                axios.post(`${import.meta.env.VITE_API_BASE_URL}/deliveryInfo/${userID}`, deliveryInfo)
                    .then((response) => {
                        localStorage.setItem("deliveryInfoId", response.data._id);
                        enqueueSnackbar("Delivery Information Saved", { variant: "success" });
                        navigate('/Payment'); //navigate to payment
                    })
                    .catch((error) => {
                        console.error(error);
                        enqueueSnackbar("Error creating address", { variant: "error" });
                    });
            } else {
                axios.put(`${import.meta.env.VITE_API_BASE_URL}/deliveryInfo/${id}`, deliveryInfo)
                    .then((response) => {
                        localStorage.setItem("deliveryInfoId", id);
                        enqueueSnackbar("Delivery Information Saved", { variant: "success" });
                        navigate('/Payment'); // navigate to payment
                    })
                    .catch((error) => {
                        console.error(error);
                        enqueueSnackbar("Error updating address", { variant: "error" });
                    });
            }
        } else {
            enqueueSnackbar("Please fill all the required fields", { variant: "error" });
        }
    }
    if (loading) {
        return <Spinner />;
    }
    return (
        <div>
            <form onSubmit={handleSubmit} noValidate>
                <CustomerNavbar />
                <h1 className="text-center font-Aboreto font-bold text-5xl mt-8 mb-5 text-primary">CHECKOUT</h1>
                <div className="flex flex-row w-full justify-between font-BreeSerif">
                    {/*for Delivery Info*/}
                    <div className="flex flex-col w-[30rem] mx-16 h-fit bg-secondary p-5 rounded-lg shadow-md">
                        <h2 className="font-Philosopher text-2xl mb-5 font-bold text-primary">Delivery Information</h2>
                        <select className="h-11 ml-3 mb-5 font-BreeSerif p-2 border-gray-200 rounded-md border-2" onChange={(e) => handleInfoChange(e)}>
                            <option value="" defaultChecked >Select Delivery Information</option>
                            {info.map((info, index) => (
                                <option key={index} value={index} >{info.firstName + " " + info.lastName}</option>
                            ))}
                        </select>

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
                                    <label className="ml-0.5 mb-1">Address</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {addressError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {addressError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input
                                    className="h-11 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    type="text"
                                    id="address"
                                    value={address}
                                    name="address"
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col ml-10">
                                <div>
                                    <label className="ml-0.5 mb-1">Postal Code</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {postalCodeError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {postalCodeError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input
                                    className="h-11 p-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    type="text"
                                    id="postalcode"
                                    value={postalCode}
                                    name="postalcode"
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row mt-5 justify-between">
                            <div className="flex flex-col">
                                <div>
                                    <label className="ml-0.5 mb-1">Select Province</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {provinceError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {provinceError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <select
                                    className="h-11 p-2 w-[200px] mr-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    id="province"
                                    value={province}
                                    name="province"
                                    onChange={(e) => setProvince(e.target.value)}
                                >
                                    <option value="" defaultChecked hidden>Select</option>
                                    {provinces.map((opt) => (
                                        <option key={opt.id} value={opt.value}>{opt.option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col ml-10">
                                <div>
                                    <label className="ml-0.5 mb-1">District</label>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {districtError && (
                                            <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                                                <MdError />
                                                {districtError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <select
                                    className="h-11 p-2 w-[200px] mr-2 border-gray-200 rounded-md border-2 shadow-sm"
                                    id="district"
                                    value={district}
                                    name="district"
                                    onChange={(e) => setDistrict(e.target.value)}
                                    disabled={!province}
                                >
                                    <option value="" defaultChecked hidden>Select</option>
                                    {province && districts[province].map((opt) => (
                                        <option key={opt.id} value={opt.value}>{opt.option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {/*for payment*/}
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
                        <button
                            onClick={handleSubmit}
                            className="bg-ternary text-primary font-bold p-3 rounded-md font-BreeSerif shadow-lg"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </form>
            <div className=" h-20"/>
            <Footer />
        </div>
    );
};

export default Checkout;