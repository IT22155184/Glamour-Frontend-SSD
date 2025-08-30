import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Input from "../../components/form/Input"; // Ensure you have this component
import Spinner from "../../components/Spinner";
import StaffFooter from "../../components/footer/stafffooter/StaffFooter";
import { storeAuthData } from "../../utils/auth";
import { useAuth } from "../../contexts/AuthContext";

const EmpLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const methods = useForm();
  const { handleSubmit } = methods;
  const { login } = useAuth();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3005/auth/login",
        data
      );
      setLoading(false);

      if (response.data.success) {
        // Store authentication data using new format
        storeAuthData(response.data);

        // Update auth context
        login(response.data);

        if (response.data.userType === "employee") {
          navigate("/Store_Manager");
          enqueueSnackbar(`Welcome back, ${response.data.user.firstName}!`, {
            variant: "success",
          });
        } else {
          enqueueSnackbar(`Invalid login`, {
            variant: "error",
          });
        }
      } else {
        enqueueSnackbar("Login failed", { variant: "error" });
      }
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Invalid email or password", { variant: "error" });
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full bg-fixed bg-ternary bg-no-repeat">
      <div className="flex h-fit flex-row justify-center bg-white mt-3 pb-3 ">
        <img
          src="/Logo1.png"
          alt="logo"
          className="w-[2rem] h-[3rem] ml-[1rem] mr-[1rem]"
        />
        <img
          src="/Logo2.png"
          alt="logo"
          className="w-[18rem] h-[2rem] hidden mt-2 lg:block"
        />
      </div>
      {loading && <Spinner />}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="bg-secondary rounded-xl w-[600px] p-8 mt-20 mx-auto font-BreeSerif shadow-2xl"
        >
          <h1 className="text-4xl font-Aboreto text-primary font-semibold my-8 text-center">
            Login to Your Account
          </h1>
          <Input
            formtype="input"
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            name="email"
            required
          />
          <Input
            formtype="input"
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            name="password"
            required
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-4 p-2 bg-primary text-white rounded w-1/3"
            >
              Login
            </button>
          </div>
        </form>
      </FormProvider>
      <div className="text-center mt-4 font-BreeSerif text-xl">
        <span className="text-white">New Here? </span>
        <Link to="/EmpRegister">
          <button type="button" className="text-blue-500 underline">
            Sign Up
          </button>
        </Link>
      </div>
      <div className=" h-[440px]"></div>
      <StaffFooter />
    </div>
  );
};

export default EmpLogin;
