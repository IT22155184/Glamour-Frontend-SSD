import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerNavbar from '../../components/navbar/CustomerNavbar';
import Footer from '../../components/footer/Footer';
import Spinner from '../../components/Spinner';
import DeleteButton from '../../components/button/DeleteButton';
import EditButton from '../../components/button/EditButton';
import EditAddress from './EditAddress';
import DeleteAddress from './DeleteAddress';

const CusAddresses = () => {
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [id, setId] = useState(null);
    const [caddress, setCAddress] = useState(null);

    const [userID, setuserID] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .post(`${import.meta.env.VITE_API_BASE_URL}/login/auth`, { token: token })
            .then((response) => {
                setuserID(response.data.userID)
                if (response.data.status === false) {
                    window.location.href = "/login";
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });

    useEffect(() => {
        if(userID)
        {setLoading(true);

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/deliveryInfo/${userID}`)
            .then((response) => {
                setAddresses(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });}
    }, [userID]);

    if (loading) {
        return <Spinner />
    }
    return (
        <div>
            <CustomerNavbar />
            <h1 className='text-center font-Aboreto font-bold text-5xl my-8 text-primary'>YOUR ADDRESSES</h1>
            <div className='flex flex-col items-center w-full'>
                <div className='flex flex-row flex-wrap pb-7 md:pb-8 2xl:pb-9 bg-secondary font-BreeSerif text-primary w-3/4 rounded-md'>
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className='flex flex-col mt-7 ml-7 md:ml-8 md:mt-8 2xl:mt-9 pt-3 pb-16 pl-5 pr-14 bg-white rounded-md'
                        >
                            <p>{address.firstName}&nbsp;{address.lastName}</p>
                            <p>{address.address + ","}&nbsp;{address.district + ","}&nbsp;{address.province + "."}</p>
                            <p>{address.postalCode}</p>
                            <p>{address.email}</p>
                            <p>0{address.contact}</p>
                            <EditButton
                                onClick={() => {
                                    setCAddress(address), setShowEdit(true);
                                }}
                                className={"absolute translate-x-[1px] translate-y-[135px]"}
                            />
                            <DeleteButton
                                onClick={() => {
                                    setId(address._id), setShowDelete(true);
                                }}
                                className={"absolute translate-x-[100px] translate-y-[135px]"}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {showEdit && (
                <EditAddress caddress={caddress} onClose={() => setShowEdit(false)} />
            )}
            {showDelete && (
                <DeleteAddress id={id} onClose={() => setShowDelete(false)} />
            )}
           <div className=" h-20"/>
            <Footer />
        </div>
    );
};

export default CusAddresses