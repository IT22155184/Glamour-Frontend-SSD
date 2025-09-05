import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import TableView from '../../components/table/TableView';
import StoreNavbar from "../../components/navbar/staffheader/StoreNavbar";
import StaffFooter from "../../components/footer/stafffooter/StaffFooter";

const MeasurementTable = () => {

    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data1, setdata1] = useState([]);
    const headers = ['Gender', 'Bust Size', 'Under Bust Size', 'Neck Base Size', 'Waist Size', 'Hip Size', 'Shoulder Width Size', 'Top Size', 'Pant Size']

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/measurements`)
            .then((response) => {
                setMeasurements(response.data.data);
                const set = response.data.data.map(obj => ({ name: obj.UniqueName, _id: obj._id }));
                setdata1(set);
                setLoading(false);

            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);


    console.log(data1);

    return (
        <div className='w-full h-full bg-secondary bg-fixed bg-no-repeat' style={{ backgroundPosition: 'top right', backgroundSize: 'cover' }}>
            <StoreNavbar models={true} />
            <div>
                <h1 className='text-6xl text-center font-Aboreto text-primary font-semibold my-8 alignment-center'>Measurements List</h1>
                {loading ? (
                    <Spinner />
                ) : (

                    <table className='bg-white ml-1 mr-1 font-BreeSerif w-full'>
                        <TableView headers={headers} />
                        <tbody>
                            {measurements.map((measurement, index) => (
                                <tr key={measurement._id} className='h-8'>

                                    <td className='border border-slate-700 rounded-md text-center'>
                                        {measurement.Gender}
                                    </td>
                                    <td className='border border-slate-700 rounded-md text-center'>
                                        {measurement.Bust}
                                    </td>
                                    <td className='border border-slate-700 rounded-md text-center'>
                                        {measurement.UnderBust}
                                    </td>
                                    <td className='border border-slate-700 rounded-md text-center'>
                                        {measurement.NeckBase}
                                    </td>
                                    <td className='border border-slate-700 rounded-md text-center'>
                                        {measurement.Waist}
                                    </td>
                                    <td className='border border-slate-700 rounded-md text-center'>
                                        {measurement.Hip}
                                    </td>
                                    <td className='border border-slate-700 rounded-md text-center'>
                                        {measurement.ShoulderWidth}
                                    </td>
                                    <td className='border text-primary border-slate-700 rounded-md text-center'>
                                        {measurement.TopSize}
                                    </td>
                                    <td className='border text-primary border-slate-700 rounded-md text-center'>
                                        {measurement.PantSize}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}



            </div>
            <center className="mt-20">
                <Link to="/ModelSizesReport">
                    <button className="bg-primary text-white font-BreeSerif py-2 px-8 rounded">
                        Generate Model Sizes Report
                    </button>
                </Link>
            </center>
            <div className='h-40'></div>
            <StaffFooter />
        </div>
    );

}

export default MeasurementTable;