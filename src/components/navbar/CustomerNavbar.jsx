import Logo from "./NavbarLogo.jsx";
import DropDownButton from "../button/DropDownButton.jsx";
import { mens, womens } from "../../utils/arrays.js";
import Search from "./Search.jsx";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <div className="h-[70px] flex-row justify-between bg-white mt-3 shadow-md hidden md:flex">
      <Logo />
      <div className="flex flex-row p-5">
        <DropDownButton title="Men's" options={mens} />
        <DropDownButton title="Women's" options={womens} />
      </div>
      <div className="flex flex-row font-BreeSerif h-[70px] justify-between">
        <Search />
        <Link to="/Cart">
          <MdOutlineShoppingCart className="text-[50px] text-primary mt-2 lg:ml-4" />
        </Link>
        <div className="group relative cursor-pointer py-2 mr-8">
          <div className="flex items-center">
            <IoPersonCircleOutline className=" menu-hover lg:mx-4 text-[50px] text-primary" />
          </div>
          <div className="invisible absolute z-50 flex px-2  w-28 flex-col bg-primary rounded-md text-c shadow-xl group-hover:visible">
            <Link className="rounded-md p-2 my-2 block  text-secondary  hover:bg-secondary hover:text-primary" to="/cusProfile">
              Profile
            </Link>
            <Link className="rounded-md p-2 my-2 block  text-secondary  hover:bg-secondary hover:text-primary" to="/measurements/view/:id">
              Model
            </Link>
            <Link
              className="rounded-md p-2 my-2 block  text-secondary  hover:bg-secondary hover:text-primary "
              to="/Orders"
            >
              Orders
            </Link>
            <Link
              className="rounded-md p-2 my-2 block  text-secondary  hover:bg-secondary hover:text-primary"
              to="/Addresses"
            >
              Addresses
            </Link>
            {isLoggedIn && (
              <button
                className="rounded-md text-start p-2 my-2 block  text-secondary  hover:bg-secondary hover:text-primary"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            )}
            {!isLoggedIn && (
              <Link
                to="/login"
                className="rounded-md p-2 my-2 block  text-secondary  hover:bg-secondary hover:text-primary"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerNavbar;