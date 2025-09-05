import axios from "axios";
import PropTypes from "prop-types";
import { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import Spinner from "../../components/Spinner";
import { enqueueSnackbar } from "notistack";

const DeleteOrder = ({ id, onClose }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        setLoading(true);
        axios.put(`${import.meta.env.VITE_API_BASE_URL}/orders/${id}`, { status: "Canceled" })
            .then((response) => {
                console.log(response);
                window.location.reload();
                enqueueSnackbar("Order Cancelled", { variant: "success" });
            })
            .catch((error) => {
                console.log(error);
                window.location.reload();
                enqueueSnackbar("Error Cancelling Order", { variant: "error" });
            });
    };

    return (
        <div
            className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="w-[600px] max-w-full h-auto bg-secondary rounded-xl p-4 flex flex-col relative"
                onClick={(event) => event.stopPropagation()}
            >
                <h1 className='text-3xl my-4 font-Aboreto text-primary font-bold text-center'>Cancel Order</h1>
                <MdOutlineCancel
                    className='absolute top-6 right-6 text-3xl text-red-600 cursor-pointer'
                    onClick={onClose}
                />
                {loading ? <Spinner /> : ""}
                <div className="flex flex-col items-center rounded-xl w-[600px] p-3 mx-auto">
                    <h3 className="text-2xl font-BreeSerif text-primary">Are you sure you want to cancel this order?</h3>
                    <button
                        className="p-4 bg-red-600 text-white m-8 w-90% font-BreeSerif rounded-md shadow-md hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Yes, Cancel this Order
                    </button>
                </div>
            </div>
        </div>
    );
};

DeleteOrder.propTypes = {
    id: PropTypes.string,
    onClose: PropTypes.func,
};

export default DeleteOrder;