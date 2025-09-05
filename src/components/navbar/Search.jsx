import { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/items`)
      .then((response) => {
        setLoading(false);
        setOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const filteredOptions = (e) => {
    const inputValue = e.target.value.toLowerCase();
    const filteredData = options.filter((opt) =>
      opt.name.toLowerCase().includes(inputValue)
    );
    setKeyword(e.target.value);
    setFilteredData(filteredData);
  };

  if (Loading) {
    return <Spinner />;
  }
  return (
    <div className="group relative cursor-pointer ">
      <div className="flex flex-row p-3.5">
        <input
          className=" h-10 border-2 border-primary rounded-l-xl shadow-md focus:outline-none pl-2"
          value={keyword}
          placeholder="Search..."
          onChange={(e) => filteredOptions(e)}
        ></input>
        <div className=" bg-primary text-white h-10 w-10  rounded-r-xl shadow-md">
          <CiSearch className=" text-[35px] mt-0.5" />
        </div>
      </div>
      {keyword && (
        <div className=" invisible px-2 font-BreeSerif absolute z-50 flex w-fit flex-col bg-secondary rounded-md text-primary shadow-xl group-hover:visible">
          {filteredData.map((opt) => (
            <Link
              key={opt._id}
              to={`/ProductPage/${opt._id}`}
              className="flex w-96 rounded-md p-2 my-2 font-semibold text-primary hover:text-secondary hover:bg-primary"
            >
              <img
                src={opt.image}
                alt={opt.name}
                className="w-32 rounded-lg mr-5"
              />
              {opt.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
