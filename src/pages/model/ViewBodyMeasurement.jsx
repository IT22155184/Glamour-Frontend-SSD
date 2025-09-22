import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/CustomerNavbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { getAccessToken, getUserData } from '../../utils/auth';

const ViewMeasurement = () => {

    const [userID, setuserID] = useState("");
    const [measurements, setMeasurements] = useState(null);
    const [loadingMeasurements, setLoadingMeasurements] = useState(true);

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

    // Fetch body measurements for the user
    useEffect(() => {
        if (userID) {
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/measurements/user/${userID}`)
                .then((response) => {
                    if (response.data) {
                        setMeasurements(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching body measurements:", error);
                })
                .finally(() => {
                    setLoadingMeasurements(false);
                });
        }
    }, [userID]);

    const femaleTops = [
        '/Female/Blouse.webp',
        '/Female/Dress.jpg',
        '/Female/Tshirt.jpeg'
    ];

    const femalePants = [
        '/Female/Pant1.jpg',
        '/Female/Pant2.jpeg',
    ];

    const maleShirts = [
        '/Male/GreenLST.webp',
        '/Male/shirt.jpg',
        '/Male/tshirt.jpeg'
    ];

    const maleTrousers = [
        '/Male/Pant.webp',
        '/Male/GreenShort.jpeg',
    ];

    return (
        <div className='w-full mt-6 h-full bg-fixed bg-no-repeat ' style={{ backgroundPosition: 'top right', backgroundSize: 'cover' }}>
            <Navbar />
            <div className="mt-20 min-h-full flex flex-col items-center">
                {loadingMeasurements ? (
                    <p className="text-center text-gray-500">Loading measurements...</p>
                ) : measurements ? (
                    <div className="w-full max-w-4xl bg-secondary shadow-lg rounded-lg p-8 mb-8">
                        <h2 className="text-5xl font-bold font-Aboreto text-primary text-center mb-8">
                            Body Measurements
                        </h2>
                        <div className="grid grid-cols-2 gap-6 font-BreeSerif">
                            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                                <p className="text-lg font-semibold text-black">
                                    Measurement ID
                                </p>
                                <p className="text-lg text-gray-700">
                                    {measurements.UniqueName || "N/A"}
                                </p>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                                <p className="text-lg font-semibold text-black">
                                    Gender
                                </p>
                                <p className="text-lg text-gray-700">
                                    {measurements.Gender || "N/A"}
                                </p>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                                <p className="text-lg font-semibold text-black">
                                    Bust Size (inches)
                                </p>
                                <p className="text-lg text-gray-700">
                                    {measurements.Bust || "N/A"}
                                </p>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                                <p className="text-lg font-semibold text-black">
                                    Under Bust (inches)
                                </p>
                                <p className="text-lg text-gray-700">
                                    {measurements.UnderBust || "N/A"}
                                </p>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                                <p className="text-lg font-semibold text-black">
                                    Waist Size (inches)
                                </p>
                                <p className="text-lg text-gray-700">
                                    {measurements.Waist || "N/A"}
                                </p>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                                <p className="text-lg font-semibold text-black">
                                    Hip Size (inches)
                                </p>
                                <p className="text-lg text-gray-700">
                                    {measurements.Hip || "N/A"}
                                </p>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                                <p className="text-lg font-semibold text-black">
                                    Shoulder Width (inches)
                                </p>
                                <p className="text-lg text-gray-700">
                                    {measurements.ShoulderWidth || "N/A"}
                                </p>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                                <p className="text-lg font-semibold text-black">
                                    Neck Base (inches)
                                </p>
                                <p className="text-lg text-gray-700">
                                    {measurements.NeckBase || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <Link to={`/measurements/edit/${measurements._id}`}>
                                <button className="bg-bgc font-BreeSerif text-white py-2 px-8 rounded">
                                    Edit Measurements
                                </button>
                            </Link>
                        </div>
                    </div>

                ) : (
                    <Link to="/measurements/create">
                        <button className="bg-primary text-white font-bold py-2 px-8 rounded">
                            Add Measurements
                        </button>
                    </Link>
                )}

                <div className="w-full max-w-4xl bg-secondary font-BreeSerif shadow-lg rounded-lg p-8">
                    {measurements?.Gender === "Female" && (
                        <>
                            <h2 className="text-2xl text-primary w-full text-center mb-4">
                                Your model size for below cloth types:{" "}
                                {measurements.TopSize || "N/A"}
                            </h2>
                            <Link to="/Catalogue">
                                <div className="flex justify-center space-x-4">
                                    {femaleTops.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt="Female Top"
                                            className="w-40 rounded-lg shadow-md"
                                        />
                                    ))}
                                </div>
                            </Link>
                            <h2 className="text-2xl text-primary w-full text-center mt-10 mb-4">
                                Your model size for below cloth types:{" "}
                                {measurements.PantSize || "N/A"}
                            </h2>
                            <Link to="/Catalogue">
                                <div className="flex justify-center space-x-4">
                                    {femalePants.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt="Female Pants"
                                            className="w-40 rounded-lg shadow-md"
                                        />
                                    ))}
                                </div>
                            </Link>
                        </>
                    )}

                    {measurements?.Gender === "Male" && (
                        <>
                            <h2 className="text-2xl font-bold text-primary w-full text-center mt-10 mb-4">
                                Your model size for below cloth types:{" "}
                                {measurements.TopSize || "N/A"}
                            </h2>
                            <Link to="/Catalogue">
                                <div className="flex justify-center space-x-4">
                                    {maleShirts.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt="Male Shirt"
                                            className="w-40 rounded-lg shadow-md"
                                        />
                                    ))}
                                </div>
                            </Link>
                            <h2 className="text-2xl font-bold text-primary w-full text-center mt-10 mb-4">
                                Your model size for below cloth types:{" "}
                                {measurements.PantSize || "N/A"}
                            </h2>
                            <Link to="/Catalogue">
                                <div className="flex justify-center space-x-4">
                                    {maleTrousers.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt="Male Pants"
                                            className="w-40 rounded-lg shadow-md"
                                        />
                                    ))}
                                </div>
                            </Link>
                        </>
                    )}
                </div>

            </div>
            <div className="h-20" />
            <Footer />
        </div>
    )
}

export default ViewMeasurement;