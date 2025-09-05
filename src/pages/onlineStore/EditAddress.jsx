import { useState } from 'react'
import axios from "axios";
import { MdOutlineCancel } from 'react-icons/md';
import { provinces, districts } from "../../utils/arrays.js";
import Spinner from "../../components/Spinner";
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";

const EditAddress = ({ caddress, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState(caddress.firstName);
    const [lastName, setLastName] = useState(caddress.lastName);
    const [contact, setContact] = useState(caddress.contact);
    const [email, setEmail] = useState(caddress.email);
    const [address, setAddress] = useState(caddress.address);
    const [province, setProvince] = useState(caddress.province);
    const [district, setDistrict] = useState(caddress.district);
    const [postalCode, setPostalCode] = useState(caddress.postalCode);

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

    const handleEdit = () => {
        event.preventDefault();  //ensure form submisssion does not reload the page
        const isValidFirstName = validateFirstName(firstName);
        const isValidLastName = validateLastName(lastName);
        const isValidContact = validateContact(contact);
        const isValidEmail = validateEmail(email);
        const isValidAddress = validateAddress(address);
        const isValidPostalCode = validatePostalCode(postalCode);
        const isValidProvince = validateProvince(province);
        const isValidDistrict = validateDistrict(district);

        if (
            isValidFirstName &&
            isValidLastName &&
            isValidContact &&
            isValidEmail &&
            isValidAddress &&
            isValidPostalCode &&
            isValidProvince &&
            isValidDistrict
        ) {
            setLoading(true);

            const data = {
                firstName,
                lastName,
                contact,
                email,
                address,
                postalCode,
                province,
                district
            };
            axios.put(`${import.meta.env.VITE_API_BASE_URL}/deliveryInfo/${caddress._id}`, data)
                .then(() => {
                    setLoading(false);
                    window.location.reload(true);
                    enqueueSnackbar("Address updated", { variant: "success" });
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    enqueueSnackbar("Error updating address", { variant: "error" });
                });
        } else {
            enqueueSnackbar("Please fill all the required fields", { variant: "error" });
        }
    }
    return (
        <div
            className='fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
            onClick={onClose}
        >
            <div
                className='w-[600px] max-w-full h-auto bg-secondary rounded-xl p-4 flex flex-col relative'
                onClick={(event) => event.stopPropagation()}  //prevent closing the pop up upon a click inside the pop up
            >
                <h1 className='text-3xl my-4 font-Aboreto text-primary font-bold text-center'>Edit Address</h1>
                <MdOutlineCancel
                    className='absolute top-6 right-6 text-3xl text-red-600 cursor-pointer'
                    onClick={onClose}
                />
                {loading ? <Spinner /> : ""}
                <form onSubmit={handleEdit} noValidate>  {/* disable built-in validations */}
                    <div className='flex flex-col w-full items-center font-BreeSerif rounded-xl'>
                        <div className="flex flex-row w-[80%] justify-between">
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
                            <div className="flex flex-col">
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
                        <button
                            className='p-4 bg-red-600 text-white m-8 w-90% font-BreeSerif rounded-md shadow-md hover:bg-red-700'
                            onClick={handleEdit}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditAddress.propTypes = {
    caddress: PropTypes.object,
    onClose: PropTypes.func,
};

export default EditAddress;