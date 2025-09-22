import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner.jsx";
import HomeSlideShow from "../../components/home/HomeSlideShow.jsx";
import Footer from "../../components/footer/Footer.jsx";
import Navbar from "../../components/navbar/CustomerNavbar.jsx";
import HorizontalScroll from "../../components/HorizontalScroll.jsx";
import Category from "../../components/home/Category.jsx";
import { enqueueSnackbar } from "notistack";

const Home = () => {
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/cusItems/trending`)
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        enqueueSnackbar("Error fetching items", { variant: "error" });
      });
  }, []);

 

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <Navbar />
      <center>
        <div className="mt-[2%]">
          <HomeSlideShow />
        </div>
      </center>
      <h1 className="m-10 text-[40px] font-Aboreto text-center text-primary">
        New & Trending
      </h1>

      <HorizontalScroll list={items}></HorizontalScroll>
      

      <div className="flex flex-col">
        <div className="flex flex-row justify-evenly">
          <Category
            image="./Clothes/mens.jpg"
            heading="Mens"
            link="/Catalogue"
            state={"mens"}
          />
          <Category
            image="./Clothes/womens.jpg"
            heading="Womens"
            link="/Catalogue"
            state={"women"}
          />
        </div>
      </div>

      <div className="flex flex-row w-full mt-[2%]">
        <div className="flex flex-col w-1/2">
          <img src="/Clothes/home/Home2.jpg" alt="image"  />
          <div className="flex flex-row">
            <img src="/Clothes/home/Home4.jpg" alt="image" className="w-1/2" />
            <img src="/Clothes/home/Home3.jpg" alt="image" className="w-1/2" />
          </div>
        </div>
        <img src="/Clothes/home/Home1.jpg" alt="image" className="w-1/2" />
      </div>
<div className="h-20"/>
      <Footer />
    </div>
  );
};

export default Home;
