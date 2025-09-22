import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { enqueueSnackbar } from "notistack";

const AddStoreItem = ({ item, onClose, onEdit }) => {
  const [productId, setProductId] = useState(item.productId);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [minprice, setMinPrice] = useState(item.minprice);
  const [maxprice, setMaxPrice] = useState(item.maxprice);
  const [salesdifference, setSalesDifference] = useState(item.salesdifference);
  const [priceincrease, setPriceIncrease] = useState(item.priceincrease);
  const [category, setCategory] = useState(item.category);
  const [image, setImage] = useState(item.image);
  const [trending, setTrending] = useState(item.trending);
  const [stock, setStock] = useState(item.stock);
  const [color, setColor] = useState("");
  const [colors, setColors] = useState(item.colors);
  const [size, setSize] = useState("");
  const [sizes, setSizes] = useState(item.sizes);

  const [productIdError, setProductIdError] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [minpriceError, setMinPriceError] = useState("");
  const [maxpriceError, setMaxPriceError] = useState("");
  const [salesdifferenceError, setSalesDifferenceError] = useState("");
  const [priceincreaseError, setPriceIncreaseError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [imageError, setImageError] = useState("");
  const [stockError, setStockError] = useState("");
  const [colorsError, setColorsError] = useState("");
  const [sizesError, setSizesError] = useState("");

  function validateProductId(productId) {
    let isValid = true;
    const productIdRegex = /^[0-9]{5}$/;
    setProductIdError("");
    if (!productIdRegex.test(productId)) {
      setProductIdError("Product ID should contain only 5 digits");
      isValid = false;
    }
    if (productId === "") {
      setProductIdError("Product ID is required");
      isValid = false;
    }
    return isValid;
  }

  function validateName(name) {
    let isValid = true;
    setNameError("");
    if (name === "") {
      setNameError("Name is required");
      isValid = false;
    }
    return isValid;
  }

  function validateDescription(description) {
    let isValid = true;
    setDescriptionError("");
    if (description === "") {
      setDescriptionError("Description is required");
      isValid = false;
    }
    return isValid;
  }

  function validateMinPrice(minprice) {
    let isValid = true;
    const minPriceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    setMinPriceError("");
    if (!minPriceRegex.test(minprice)) {
      setMinPriceError("Min price should be a number");
      isValid = false;
    }
    if (minprice === "") {
      setMinPriceError("Min price is required");
      isValid = false;
    }
    return isValid;
  }

  function validateMaxPrice(maxprice) {
    let isValid = true;
    const maxPriceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    setMaxPriceError("");
    if (!maxPriceRegex.test(maxprice)) {
      setMaxPriceError("Max price should be a number");
      isValid = false;
    }
    if (maxprice === "") {
      setMaxPriceError("Max price is required");
      isValid = false;
    }
    return isValid;
  }

  function validateSalesDifference(salesdifference) {
    let isValid = true;
    if (salesdifference === "") {
      setSalesDifferenceError("Sales difference is required");
      isValid = false;
    }
    return isValid;
  }

  function validatePriceIncrease(priceincrease) {
    let isValid = true;
    if (priceincrease === "") {
      setPriceIncreaseError("Price increase is required");
      isValid = false;
    }
    return isValid;
  }

  function validateCategory(category) {
    let isValid = true;
    if (category === "") {
      setCategoryError("Category is required");
      isValid = false;
    }
    return isValid;
  }

  function validateImage(image) {
    let isValid = true;
    if (image === "") {
      setImageError("Image is required");
      isValid = false;
    }
    return isValid;
  }

  function validateStock(stock) {
    let isValid = true;
    if (stock === "") {
      setStockError("Stock is required");
      isValid = false;
    }
    return isValid;
  }

  function validateColor(color) {
    let isValid = true;
    if (color === "") {
      setColorsError("Enter a color");
      isValid = false;
    } else {
      setColors([...colors, color]);
      setColor("");
      setColorsError("");
    }
    return isValid;
  }

  function validateColors(colors) {
    let isValid = true;
    if (colors.length === 0) {
      isValid = false;
      setColorsError("Please select at least one color");
    } else {
      setColorsError("");
    }
    return isValid;
  }

  function validateSize(size) {
    let isValid = true;
    if (size === "") {
      setSizesError("Enter a size");
      isValid = false;
    } else {
      setSizesError("");
      setSizes([...sizes, size]);
      setSize("");
    }
    return isValid;
  }

  function validateSizes(sizes) {
    let isValid = true;
    if (sizes.length === 0) {
      isValid = false;
      setSizesError("Please select at least one size");
    } else {
      setSizesError("");
    }
    return isValid;
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 5) {
      alert("Image size should be less than 5MB.");
      return;
    }
    const base64 = await convertToBase64(file);
    setImage(base64);
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleAdd = () => {
    event.preventDefault();
    const isValidProductId = validateProductId(productId);
    const isValidName = validateName(name);
    const isValidDescription = validateDescription(description);
    const isValidMinPrice = validateMinPrice(minprice);
    const isValidMaxPrice = validateMaxPrice(maxprice);
    const isValidSalesDifference = validateSalesDifference(salesdifference);
    const isValidPriceIncrease = validatePriceIncrease(priceincrease);
    const isValidCategory = validateCategory(category);
    const isValidImage = validateImage(image);
    const isValidStock = validateStock(stock);
    const isValidColors = validateColors(colors);
    const isValidSizes = validateSizes(sizes);

    if (
      isValidProductId &&
      isValidName &&
      isValidDescription &&
      isValidMinPrice &&
      isValidMaxPrice &&
      isValidSalesDifference &&
      isValidPriceIncrease &&
      isValidCategory &&
      isValidImage &&
      isValidStock &&
      isValidColors &&
      isValidSizes
    ) {
      const data = {
        productId,
        name,
        description,
        minprice,
        maxprice,
        salesdifference,
        priceincrease,
        category,
        image,
        trending,
        stock,
        colors,
        sizes,
      };
      axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/items/${item._id}`, data)
        .then(() => {
          onEdit();
          onClose();
          enqueueSnackbar("Item updated", { variant: "success" });
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar("Error adding item", { variant: "error" });
        });
    } else {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
    }
  };

  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[600px] overflow-scroll max-h-full max-w-full h-auto bg-white rounded-xl p-4 flex flex-col relative"
      >
        <h1 className=" text-primary text-3xl my-4 font-Philosopher text-center">
          Edit Store Product
        </h1>
        <MdOutlineCancel
          className="absolute top-6 right-6 text-3xl text-red-600 cursor-pointer"
          onClick={onClose}
        />
        <form onSubmit={handleAdd} noValidate>
          <div className="flex flex-col w-full items-center font-BreeSerif rounded-xl">
            <img src={image} className="w-60 h-60"></img>
            <div className="flex flex-row w-[80%] justify-between">
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Product Id</label>
                <AnimatePresence mode="wait" initial={false}>
                  {productIdError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {productIdError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="name"
                  value={productId}
                  name="name"
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Product Name</label>
                <AnimatePresence mode="wait" initial={false}>
                  {nameError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {nameError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2  border-gray-200 rounded-md border-2  shadow-sm "
                  label="Product Name"
                  type="text"
                  id="name"
                  value={name}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col w-[80%]">
              <label className="ml-0.5 mb-1">Description</label>
              <AnimatePresence mode="wait" initial={false}>
                {descriptionError && (
                  <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                    <MdError />
                    {descriptionError}
                  </motion.p>
                )}
              </AnimatePresence>
              <input
                className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                type="text"
                id="description"
                value={description}
                name="description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-row w-[80%] justify-between">
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Min Price</label>
                <AnimatePresence mode="wait" initial={false}>
                  {minpriceError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {minpriceError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="minprice"
                  value={minprice}
                  name="minprice"
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Max Price</label>
                <AnimatePresence mode="wait" initial={false}>
                  {maxpriceError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {maxpriceError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="maxprice"
                  value={maxprice}
                  name="maxprice"
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-row w-[80%] justify-between">
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Sales Difference</label>
                <AnimatePresence mode="wait" initial={false}>
                  {salesdifferenceError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {salesdifferenceError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="salesdifference"
                  value={salesdifference}
                  name="salesdifference"
                  onChange={(e) => setSalesDifference(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Price Increase</label>
                <AnimatePresence mode="wait" initial={false}>
                  {priceincreaseError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {priceincreaseError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="priceincrease"
                  value={priceincrease}
                  name="priceincrease"
                  onChange={(e) => setPriceIncrease(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-row w-[80%] justify-between">
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Category</label>
                <AnimatePresence mode="wait" initial={false}>
                  {categoryError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {categoryError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="category"
                  value={category}
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-52">
                <label className="ml-0.5 mb-1">Image</label>
                <AnimatePresence mode="wait" initial={false}>
                  {imageError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {imageError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="file"
                  id="image"
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => handleFileUpload(e)}
                />
              </div>
            </div>
            <div className="flex flex-row w-[80%] justify-between">
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Trending</label>
                <select
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  id="trending"
                  value={trending}
                  name="trending"
                  onChange={(e) => setTrending(e.target.value)}
                >
                  <option value="" hidden>
                    Select
                  </option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Stock</label>
                <AnimatePresence mode="wait" initial={false}>
                  {stockError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {stockError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="stock"
                  value={stock}
                  name="stock"
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-row w-[80%] justify-between">
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Colors</label>
                <AnimatePresence mode="wait" initial={false}>
                  {colorsError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {colorsError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="flex flex-row">
                  {colors.map((color) => (
                    <div
                      key={color}
                      className="m-1 p-2 bg-gray-200 text-gray-700 font-semibold rounded-md"
                    >
                      {color}
                    </div>
                  ))}
                </div>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="colors"
                  value={color}
                  name="colors"
                  onChange={(e) => setColor(e.target.value)}
                />
                <button
                  type="button"
                  className="p-2 bg-ternary text-primary m-2 font-BreeSerif rounded-md shadow-md  hover:bg-primary hover:text-secondary transition duration-300 ease-in-out"
                  onClick={() => {
                    validateColor(color);
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="p-2 bg-ternary text-primary m-2 font-BreeSerif rounded-md shadow-md  hover:bg-primary hover:text-secondary transition duration-300 ease-in-out"
                  onClick={() => {
                    setColors([]);
                    setColorsError("");
                  }}
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-col">
                <label className="ml-0.5 mb-1">Sizes</label>
                <AnimatePresence mode="wait" initial={false}>
                  {sizesError && (
                    <motion.p className="flex items-center my-1 gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
                      <MdError />
                      {sizesError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="flex flex-row">
                  {sizes.map((size) => (
                    <div
                      key={size}
                      className="m-1 p-2 bg-gray-200 text-gray-700 font-semibold rounded-md"
                    >
                      {size}
                    </div>
                  ))}
                </div>
                <input
                  className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
                  type="text"
                  id="sizes"
                  value={size}
                  name="sizes"
                  onChange={(e) => setSize(e.target.value)}
                />
                <button
                  type="button"
                  className="p-2 bg-ternary text-primary m-2 font-BreeSerif rounded-md shadow-md hover:bg-primary hover:text-secondary transition duration-300 ease-in-out"
                  onClick={() => {
                    validateSize(size);
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="p-2 bg-ternary text-primary m-2 font-BreeSerif rounded-md shadow-md hover:bg-primary hover:text-secondary transition duration-300 ease-in-out"
                  onClick={() => {
                    setSizes([]);
                    setSizesError("");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            <button
              className="p-4 bg-red-600 text-white m-8 w-90% font-BreeSerif rounded-md shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
              onClick={handleAdd}
            >
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddStoreItem.propTypes = {
  onClose: PropTypes.func,
  onEdit: PropTypes.func,
  item: PropTypes.object,
};

export default AddStoreItem;
