import { useEffect, useState } from "react";
import NavbarButton from "../NavbarButton";
import NavbarLogo from "../NavbarLogo";
import { Link } from "react-router-dom";
import NavbarUserProfile from "../NavbarUserProfile";
import PropTypes from "prop-types";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const StoreNavbar = (props) => {
  const [profileInfo, setProfileInfo] = useState({});
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn && user && user.role === 'employee') {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`)
        .then((response) => {
          console.log(response.data)
          setProfileInfo(response.data.user || response.data);
        }).catch((error) => {
          console.error("Error fetching profile information:", error);
        });
    }
  }, [user, isLoggedIn]);

  return (
    <div className="">
      <div className="flex h-fit flex-row justify-between bg-white mt-3 pb-3 ">
        <NavbarLogo />
        <NavbarUserProfile
          url2={"/EmpProfile"}
          source={"/emp.png"}
          username={profileInfo.firstName + " " + profileInfo.lastName}
          url={"/Store_Manager"}
        />
      </div>

      <div className="flex flex-row bg-secondary h-fit shadow-md">
        <NavbarButton
          active={props.home}
          button={"Home"}
          url={"/Store_Manager"}
        />
        <NavbarButton
          active={props.pro}
          button={"Products"}
          url={"/StoreItemsList"}
        />
        <NavbarButton
          active={props.models}
          button={"Model Sizes"}
          url={"/measurements/view"}
        />
        <NavbarButton
          active={props.ogo}
          button={"Ongoing Orders"}
          url={"/OngoingOrders"}
        />
        <NavbarButton
          active={props.coo}
          button={"Completed Orders"}
          url={"/CompletedOrders"}
        />
        <NavbarButton
          active={props.can}
          button={"Canceled Orders"}
          url={"/CanceledOrders"}
        />

      </div>
    </div>
  );
};

StoreNavbar.propTypes = {
  home: PropTypes.bool,
  ogo: PropTypes.bool,
  coo: PropTypes.bool,
  pro: PropTypes.bool,
  can: PropTypes.bool,
  models: PropTypes.bool,
};

export default StoreNavbar;
