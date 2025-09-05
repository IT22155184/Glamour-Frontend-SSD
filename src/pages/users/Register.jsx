import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import Logo from "../../components/navbar/NavbarLogo";
import Input from "../../components/form/Input"; // Ensure you have this component
import Spinner from "../../components/Spinner";
import Footer from "../../components/footer/Footer";
import { pnoValidation } from "../../utils/inputValidations";
import { EmailValidation } from "../../utils/inputValidations";
import { PasswordValidation } from "../../utils/inputValidations";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const methods = useForm();
  const { handleSubmit } = methods;

  const handleSignup = async (data) => {
    setLoading(true);
    try {
      console.log(data);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, data);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      alert("An error happened. Please check the console");
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <div className="flex flex-row items-center justify-between bg-white mt-3 pb-3 px-4">
          <div className="flex justify-center w-full">
            <Logo />
          </div>
          <Link to="/login">
            <button
              type="submit"
              className="ml-auto p-2 bg-primary font-BreeSerif text-white rounded"
            >
              Login
            </button>
          </Link>
        </div>
      </div>

      <div
        className="w-full min-h-screen flex-col bg-no-repeat"
        style={{ backgroundPosition: "top right", backgroundSize: "cover" }}
      >
        <div className="flex flex-row w-full h-full">
          <div className="w-1/2 h-full">
            <img
              src="./Register/bgimage.jpg"
              alt="Signup Illustration"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-1/2 flex justify-center items-center p-8 bg-ternary">
            {loading && <Spinner />}
            <FormProvider {...methods}>
              <div className="bg-secondary rounded-xl p-8 w-full max-w-lg mx-auto shadow-xl">
                <h1 className="text-4xl font-Aboreto text-primary font-semibold my-8 text-center">
                  Create Your Account
                </h1>
                <form
                  onSubmit={handleSubmit(handleSignup)}
                  className="space-y-4"
                >
                  <Input
                    formtype="input"
                    label="First Name"
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    name="firstName"
                    autoComplete="given-name"
                  />
                  <Input
                    formtype="input"
                    label="Last Name"
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                  <Input
                    formtype="input"
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    autoComplete="email"
                    {...EmailValidation}
                  />
                  <Input
                    formtype="input"
                    label="Phone Number"
                    id="phoneNumber"
                    type="text"
                    placeholder="Enter contact number"
                    name="phoneNumber"
                    autoComplete="tel"
                    {...pnoValidation}
                  />
                  <Input
                    formtype="input"
                    label="Password"
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    autoComplete="new-password"
                    {...PasswordValidation}
                  />
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="mt-4 p-2 bg-primary text-white rounded w-1/3"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </FormProvider>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Signup;
