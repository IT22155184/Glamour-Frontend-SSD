import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner.jsx";
import RadioButton from "../../components/RadioButton.jsx";
import CustomerNavbar from "../../components/navbar/CustomerNavbar";
import Footer from "../../components/footer/Footer";
import CardView from "../../components/CardView";
import { useLocation } from "react-router-dom";
import { mensTops, mensBottoms, mensFliter } from "../../utils/arrays.js";
import { womensTops, womensBottoms, womensFliter } from "../../utils/arrays.js";
import { Link } from "react-router-dom";

const Catalogue = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [userID, setuserID] = useState("");
  const [boolean, setBoolean] = useState(false);

  const location = useLocation();
  const recievedData = location.state;

  function filterItems(e) {
    const inputValue = e.target.value.toLowerCase();
    const filteredData = items.filter(
      (opt) => opt.category.toLowerCase() === inputValue
    );
    setFilteredData(filteredData);
  }

  function clearfilterdata() {
    setFilteredData(items);
  }

  function filterMensItems() {
    const filteredData = items.filter((opt) =>
      mensFliter.includes(opt.category.toLowerCase(mensFliter))
    );
    setFilteredData(filteredData);
  }

  function filterWomensItems() {
    const filteredData = items.filter((opt) =>
      womensFliter.includes(opt.category.toLowerCase(womensFliter))
    );
    setFilteredData(filteredData);
  }

  function filterPersonalizedItems(e) {
    const inputValue = JSON.parse(e.target.value);
    if (inputValue[2].toLowerCase() == "male") {
      const filteredTops = items.filter((opt) =>
        mensTops.includes(opt.category.toLowerCase(mensTops))
      );
      const filteredwithSizeTops = filteredTops.filter((opt) =>
        opt.sizes
          .map((size) => size.toLowerCase())
          .includes(inputValue[0].toLowerCase())
      );
      const filteredBottoms = items.filter((opt) =>
        mensBottoms.includes(opt.category.toLowerCase(mensBottoms))
      );
      const filteredwithSizeBottoms = filteredBottoms.filter((opt) =>
        opt.sizes
          .map((size) => size.toLowerCase())
          .includes(inputValue[1].toLowerCase())
      );
      const filteredData = filteredwithSizeTops.concat(filteredwithSizeBottoms);
      setFilteredData(filteredData);
    } else if (inputValue[2].toLowerCase() == "female") {
      const filteredTops = items.filter((opt) =>
        womensTops.includes(opt.category.toLowerCase(womensTops))
      );
      const filteredwithSizeTops = filteredTops.filter((opt) =>
        opt.sizes
          .map((size) => size.toLowerCase())
          .includes(inputValue[0].toLowerCase())
      );
      const filteredBottoms = items.filter((opt) =>
        womensBottoms.includes(opt.category.toLowerCase(womensBottoms))
      );
      const filteredwithSizeBottoms = filteredBottoms.filter((opt) =>
        opt.sizes
          .map((size) => size.toLowerCase())
          .includes(inputValue[1].toLowerCase())
      );
      const filteredData = filteredwithSizeTops.concat(filteredwithSizeBottoms);
      setFilteredData(filteredData);
    }
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/cusItems`)
      .then((response) => {
        setLoading(false);
        setItems(response.data);
        if (recievedData) {
          const filteredData = response.data.filter(
            (opt) => opt.category.toLowerCase() === recievedData
          );
          setFilteredData(filteredData);
        } else {
          setFilteredData(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    const token = getAccessToken?.() || localStorage.getItem("token");
    const userData = getUserData?.();
    if (token !== null) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, { token: token, userType: userData?.role || 'customer' })
        .then((response) => {
          setuserID(response.data.userId);
          axios
            .get(
              `${import.meta.env.VITE_API_BASE_URL}/measurements/user/${response.data.userId}`
            )
            .then((response) => {
              setPersonalized(response.data);
              if (response.data.Hip > 0) {
                setBoolean(true);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [userID, recievedData]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <CustomerNavbar />
      <div className="flex flex-row pt-8 pl-8">
        <div className=" bg-secondary w-1*4 p-5 rounded-lg shadow-lg  h-fit">
          <h1 className=" font-Aboreto text-primary font-bold text-2xl">
            CATEGORIES
          </h1>
          <div>
            {boolean && (
              <>
                <h2 className=" font-Philosopher text-primary text-2xl my-3">
                  Personalized
                </h2>
                <RadioButton
                  key={personalized._id}
                  name="check"
                  value={JSON.stringify([
                    personalized.TopSize,
                    personalized.PantSize,
                    personalized.Gender,
                    personalized._id,
                  ])}
                  label={personalized.UniqueName}
                  onChange={(e) => filterPersonalizedItems(e)}
                />
              </>
            )}
            {!boolean && (
              <>
                <h2 className=" font-Philosopher text-primary text-2xl my-3">
                  Personalized
                </h2>
                <Link to="/measurements/create">
                  <button className="bg-primary text-white font-bold py-2 px-8 rounded">
                    Add Measurements
                  </button>
                </Link>
              </>
            )}
          </div>
          {/* Mens */}
          <div>
            <h2
              className=" font-Philosopher text-primary text-2xl my-3 hover:cursor-pointer"
              onClick={() => filterMensItems()}
            >
              Mens
            </h2>
            <RadioButton
              name="check"
              value="mensshirt"
              label="Shirts"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="menstshirt"
              label="T-Shirts"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="menstrousers"
              label="Trousers"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="mensdenims"
              label="Denims"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="mensshorts"
              label="Shorts"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="menshoodies"
              label="Hoodies"
              onChange={(e) => filterItems(e)}
            />
          </div>
          {/* Womens */}
          <div>
            <h2
              className=" font-Philosopher text-primary text-2xl my-3 hover:cursor-pointer"
              onClick={() => filterWomensItems()}
            >
              Women
            </h2>
            <RadioButton
              name="check"
              value="womenssets"
              label="Sets"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="womensdresses"
              label="Dresses"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="womenstops"
              label="Tops"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="womenskirts"
              label="Skirts"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="womenstrousers"
              label="Trousers"
              onChange={(e) => filterItems(e)}
            />
            <RadioButton
              name="check"
              value="womensdenims"
              label="Denims"
              onChange={(e) => filterItems(e)}
            />
          </div>
          <button
            className="bg-primary self text-white font-bold rounded-lg px-4 py-2 mt-5"
            onClick={() => clearfilterdata()}
          >
            Clear Filter
          </button>
        </div>
        <div className="flex flex-row flex-wrap ml-10 h-fit">
          {filteredData.map((item) => (
            <CardView
              key={item._id}
              id={item._id}
              heading={item.name}
              stock={item.stock}
              image={item.image}
              price={item.minprice}
            />
          ))}
        </div>
      </div>
      <div className="h-20" />
      <Footer />
    </div>
  );
};

export default Catalogue;
