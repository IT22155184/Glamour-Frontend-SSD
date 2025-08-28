import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/CustomerNavbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
    const [userProfile, setUserProfile] = useState([]);
    const [measurements, setMeasurements] = useState(null);
    const [loadingMeasurements, setLoadingMeasurements] = useState(true);
    const { user, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn && user) {
            // Fetch user profile using the auth/profile endpoint
            axios
                .get('http://localhost:3005/auth/profile')
                .then((response) => {
                    console.log(response.data);
                    setUserProfile(response.data.user || response.data);
                })
                .catch((error) => {
                    console.error("Error fetching profile information:", error);
                });
                
            // Fetch body measurements for the user
            axios
                .get(`http://localhost:3005/measurements/user/${user._id}`)
                .then((response) => {
                    console.log(response.data);
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
    }, [user, isLoggedIn]);

    return (
        <div>
            <Navbar />
            <div className="min-h-full flex flex-col items-center">
                <div className="mt-8 w-full max-w-4xl">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                            <img
                                src="emp.png"
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="bg-secondary shadow-lg rounded-lg w-full p-8 mb-8">
                            <h1 className="text-5xl font-Aboreto font-bold text-primary mb-6 text-center">
                                Profile Details
                            </h1>
                            <div className="grid grid-cols-2 gap-4 font-BreeSerif">
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p>First Name</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p>{userProfile.firstName || "N/A"}</p>
                                </div>
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p>Last Name</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p>{userProfile.lastName || "N/A"}</p>
                                </div>
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p>Email Address</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p>{userProfile.email || "N/A"}</p>
                                </div>
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p>Phone Number</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p>{userProfile.phoneNumber || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex justify-center mt-6">
                                <Link to="/EditCusProfile">
                                    <button className="bg-bgc font-BreeSerif text-white py-2 px-8 rounded">
                                        Edit Profile
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    {loadingMeasurements ? (
                        <p className="text-center text-gray-500">Loading measurements...</p>
                    ) : measurements ? (
                        <Link to="/measurements/view/:id">
                            <button className="bg-primary text-white font-BreeSerif py-2 px-8 rounded">
                                View Model
                            </button>
                        </Link>
                    ) : (
                        <Link to="/measurements/create">
                            <button className="bg-primary text-white font-bold py-2 px-8 rounded">
                                Add Measurements
                            </button>
                        </Link>
                    )}
                </div>
            </div>
            <div className="h-20"/>
            <Footer />
        </div>
    );
};

export default Profile;
