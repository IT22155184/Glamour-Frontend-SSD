import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from '../../components/Spinner';
import StoreNavbar from "../../components/navbar/staffheader/StoreNavbar";
import StaffFooter from "../../components/footer/stafffooter/StaffFooter";
import { enqueueSnackbar } from "notistack";
import { MdOutlineCancel } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function EditEmpProfile() {
    const [userProfile, setUserProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: ""
    });
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useAuth();

    // Fetch user profile based on authenticated user
    useEffect(() => {
        if (isLoggedIn && user && user.role === 'employee') {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`)
                .then((response) => {
                    const profileData = response.data.user || response.data;
                    const { firstName, lastName, email, phoneNumber } = profileData;
                    setUserProfile({ firstName, lastName, email, phoneNumber, password: "" });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    enqueueSnackbar("Error fetching profile information:", { variant: "error" });
                });
        }
    }, [user, isLoggedIn]);

    // Handle input change
    const handleInputChange = (e, field) => {
        setUserProfile((prevProfileInfo) => ({
            ...prevProfileInfo,
            [field]: e.target.value,
        }));
    };

    // Handle save profile
    const handleSaveProfile = async () => {
        const { firstName, lastName, email, phoneNumber, password } = userProfile;

        if (!firstName || !lastName || !email || !phoneNumber) {
            enqueueSnackbar("Please fill in all the fields", { variant: "error" });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            enqueueSnackbar("Please enter a valid email address", { variant: "error" });
            return;
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            enqueueSnackbar("Please enter a valid 10-digit phone number", { variant: "error" });
            return;
        }

        if (password && (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password))) {
            enqueueSnackbar("Password must be at least 8 characters long and contain at least one digit and one special character", { variant: "error" });
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, userProfile);
            enqueueSnackbar("Profile updated successfully.", { variant: "success" });
            navigate("/EmpProfile")
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Failed to save profile", { variant: "error" });
        }
    };

    // Handle delete profile
    const handleDeleteProfile = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`);
            enqueueSnackbar("Profile deleted successfully", { variant: "success" });
            logout();
            navigate("/EmpRegister");
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Failed to delete profile", { variant: "error" });
        }
    };

    const DeleteConfirmationModal = () => (
        <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={() => setShowDeleteModal(false)} 
    >
      <div
        onClick={(event) => event.stopPropagation()} 
        className="w-[900px] max-w-full h-auto bg-white rounded-xl p-4 flex flex-col relative"
      >
        <h1 className="text-3xl ml-4 my-4 font-Philosopher text-ternary">
          Confirm Deletion
        </h1>
        <MdOutlineCancel
          className="absolute top-6 right-6 text-3xl text-red-600 cursor-pointer"
          onClick={() => setShowDeleteModal(false)} 
        />
        <div className="flex flex-col rounded-xl mx-auto text-2xl font-BreeSerif">
          <div className="flex flex-row">
            Are you sure you want to delete your profile? This action cannot be undone.
          </div>
          <div className="flex justify-center gap-x-40 mt-2">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={handleDeleteProfile} 
            >
              Delete
            </button>
            <button
              className="bg-black text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={() => setShowDeleteModal(false)} // Close modal on cancel
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    
      );

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <StoreNavbar />
            <div className="flex flex-col items-center">
                <div className="mt-8 w-full max-w-4xl">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 items-center rounded-full overflow-hidden mb-4">
                            <input type="image" src="emp.png" alt="image" className="object-cover w-full h-full" />
                        </div>
                        <div className="bg-secondary shadow-lg rounded-lg w-full p-8 mb-8">
                            <h1 className="text-5xl font-Aboreto font-bold text-primary mb-6 text-center">Edit Profil Details</h1>
                            <div className="grid grid-cols-2 gap-4 font-BreeSerif">
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p className="font-semibold">First Name</p>
                                </div>
                                <input
                                    className="p-4 rounded-lg border-2 border-gray-300"
                                    type="text"
                                    value={userProfile.firstName || ""}
                                    onChange={(e) => handleInputChange(e, 'firstName')}
                                />

                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p className="font-semibold">Last Name</p>
                                </div>
                                <input
                                    className="p-4 rounded-lg border-2 border-gray-300"
                                    type="text"
                                    value={userProfile.lastName || ""}
                                    onChange={(e) => handleInputChange(e, 'lastName')}
                                />
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p className="font-semibold">Email Address</p>
                                </div>
                                <input
                                    className="p-4 rounded-lg border-2 border-gray-300"
                                    type="text"
                                    value={userProfile.email || ""}
                                    onChange={(e) => handleInputChange(e, 'email')}
                                />
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p className="font-semibold">Phone Number</p>
                                </div>
                                <input
                                    className="p-4 rounded-lg border-2 border-gray-300"
                                    type="text"
                                    value={userProfile.phoneNumber || ""}
                                    onChange={(e) => handleInputChange(e, 'phoneNumber')}
                                />
                                <div className="bg-primary text-white p-4 rounded-lg">
                                    <p className="font-semibold">Password</p>
                                </div>
                                <input
                                    className="p-4 rounded-lg border-2 border-gray-300"
                                    type="password"
                                    placeholder="••••••••"
                                    value={userProfile.password}
                                    onChange={(e) => handleInputChange(e, 'password')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center space-x-4 mt-8">
                <button
                    className="bg-primary text-white font-BreeSerif py-3 px-6 rounded-lg shadow-md hover:bg-primary-dark hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50"
                    onClick={handleSaveProfile}
                >
                    SAVE
                </button>
                <button
                    className="bg-red-500 text-white font-BreeSerif py-3 px-6 rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                    onClick={() => setShowDeleteModal(true)}
                >
                    DELETE
                </button>
            </div>
            {showDeleteModal && <DeleteConfirmationModal />}
            <div className="h-20" />
            <StaffFooter />
        </div>
    );
}

export default EditEmpProfile;
