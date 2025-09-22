import axios from "axios";
import PropTypes from "prop-types";
import { MdOutlineCancel } from "react-icons/md";
import { enqueueSnackbar } from "notistack";

const DeleteStoreItem = ({id, onClose, onDelete}) => {

  const handleDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_API_BASE_URL}/items/${id}`)
      .then(() => {
        onDelete();
        onClose();
        enqueueSnackbar("Address deleted", { variant: "success" });
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar("Error deleting address", { variant: "error" });
      });
  };

  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[600px] max-w-full h-auto bg-white rounded-xl p-4 flex flex-col relative"
      >
        <h1 className="text-3xl my-4 font-Philosopher text-center">Delete product</h1>
        <MdOutlineCancel
          className="absolute top-6 right-6 text-3xl text-red-600 cursor-pointer"
          onClick={onClose}
        />
        <div className="flex flex-col items-center border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
          <h3 className="text-2xl font-BreeSerif">
            Are you shure you want to delete this product?
            This action cannot be undone.
          </h3>

          <button
            className="p-4 bg-red-600 text-white m-8 w-90% font-BreeSerif rounded-md shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
            onClick={handleDelete}
          >
            Yes, Delete it
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteStoreItem.propTypes = {
  id: PropTypes.string,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DeleteStoreItem;
