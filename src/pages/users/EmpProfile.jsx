import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import StoreNavbar from "../../components/navbar/staffheader/StoreNavbar";
import StaffFooter from "../../components/footer/stafffooter/StaffFooter";
import { useAuth } from "../../contexts/AuthContext";

const EmpProfile = () => {
    const [userProfile, setUserProfile] = useState([]);
    const { user, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn && user && user.role === 'employee') {
            axios
                .get('http://localhost:3005/auth/profile')
                .then((response) => {
                    console.log(response.data);
                    setUserProfile(response.data.user || response.data);
                })
                .catch((error) => {
                    console.error("Error fetching profile information:", error);
                });
        }
    }, [user, isLoggedIn]);

    return (
        <div>
            <StoreNavbar />
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
                                    <p className="font-semibold">First Name</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p>{userProfile.firstName || "N/A"}</p>
                                </div>
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p className="font-semibold">Last Name</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p>{userProfile.lastName || "N/A"}</p>
                                </div>
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p className="font-semibold">Email Address</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p>{userProfile.email || "N/A"}</p>
                                </div>
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p className="font-semibold">Phone Number</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p>{userProfile.phoneNumber || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex justify-center mt-6">
                                <Link to="/EditEmpProfile">
                                    <button className="bg-bgc font-BreeSerif text-white py-2 px-8 rounded">
                                        Edit Profile
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <StaffFooter />
        </div>
    );
};

export default EmpProfile;
