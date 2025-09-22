import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SubmitButton from '../../components/button/SubmitButton';
import { enqueueSnackbar } from "notistack";
import Navbar from "../../components/navbar/CustomerNavbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import DeleteMeasurement from './DeleteBodyMeasurement';
import DeleteButton from '../../components/button/DeleteButton';

const EditMeasurement = () => {
  const [UniqueName, setUniqueName] = useState('');
  const [Gender, setGender] = useState('');
  const [Bust, setBust] = useState('');
  const [UnderBust, setUnderBust] = useState('');
  const [NeckBase, setNeckBase] = useState('');
  const [Waist, setWaist] = useState('');
  const [Hip, setHip] = useState('');
  const [ShoulderWidth, setShoulderWidth] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [measurementExists, setMeasurementExists] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/measurements/${id}`)
      .then((response) => {
        if (response.data) {
          setUniqueName(response.data.UniqueName);
          setGender(response.data.Gender);
          setBust(response.data.Bust);
          setUnderBust(response.data.UnderBust);
          setNeckBase(response.data.NeckBase);
          setWaist(response.data.Waist);
          setHip(response.data.Hip);
          setShoulderWidth(response.data.ShoulderWidth);
        } else {
          setMeasurementExists(false); 
        }
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        setMeasurementExists(false); 
        enqueueSnackbar("An error occurred", { variant: "error" });
        console.error(error);
      });
  }, [id]);

  const handleEditMeasurement = () => {
    const data = {
      UniqueName,
      Gender,
      Bust,
      UnderBust,
      NeckBase,
      Waist,
      Hip,
      ShoulderWidth,
    }
    setLoading(true);
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/measurements/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Measurement updated", { variant: "success" });
        navigate('/measurements/view/:id');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error updating measurement", { variant: "error" });
        console.error(error);
      })
  };

  if (!measurementExists) {
    return (
      <div className="h-full ">
        <Navbar />
        <div className="text-center mt-20">
          <h2 className="text-3xl text-red-600">Measurement details and the Model has been deleted.</h2>
          <button
            className="mt-10 bg-primary font-BreeSerif text-white px-4 py-2 rounded-md"
            onClick={() => navigate('/cusprofile')}
          >
            Go to Profile
          </button>
        </div>
        <div className="h-20" />
        <Footer />
      </div>
    );
  }

  return (
    <div className='w-full h-full bg-fixed bg-no-repeat' style={{ backgroundPosition: 'top right', backgroundSize: 'cover' }}>
      <Navbar />
      {loading ? <Spinner /> : ''}

      <div className="bg-secondary  rounded-xl w-[600px] p-8 mx-auto mt-20 font-BreeSerif">
        <h1 className='text-4xl text-center my-4 font-Aboreto font-bold text-primary'>Edit Measurement Details</h1>

        <div className="flex w-[80%] justify-between mb-2">
          <label className='text-primary'>Measurement Name</label>
        </div>
        <div>
          <input
            type='text'
            placeholder='Enter Unique name for your model'
            name='UniqueName'
            className='h-11 w-[80%] p-2 border-gray-200 rounded-md border-2'
            value={UniqueName}
            onChange={(e) => setUniqueName(e.target.value)}
          // readOnly
          />
        </div>

        <div className="flex w-[80%] justify-between mb-2">
          <label className='text-primary'>Gender</label>
        </div>
        <div>
          <input
            type='text'
            placeholder='Enter your Gender'
            name='Gender'
            className='h-11 w-[80%] p-2 border-gray-200 rounded-md border-2'
            value={Gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>

        <div className="flex w-[80%] justify-between mb-2">
          <label className='text-primary'>Bust Size</label>
        </div>
        <div>
          <input
            type='text'
            placeholder='Enter Bust Size'
            name='Bust'
            className='h-11 w-[80%] p-2 border-gray-200 rounded-md border-2'
            value={Bust}
            onChange={(e) => setBust(e.target.value)}
          />
        </div>

        <div className="flex w-[80%] justify-between mb-2">
          <label className='text-primary'>Under Bust Size</label>
        </div>
        <div>
          <input
            type='text'
            placeholder='Enter Under Bust Size'
            name='UnderBust'
            className='h-11 w-[80%] p-2 border-gray-200 rounded-md border-2'
            value={UnderBust}
            onChange={(e) => setUnderBust(e.target.value)}
          />
        </div>

        <div className="flex w-[80%] justify-between mb-2">
          <label className='text-primary'>Neck Base Size</label>
        </div>
        <div>
          <input
            type='text'
            placeholder='Enter Neck Base Size'
            name='NeckBase'
            className='h-11 w-[80%] p-2 border-gray-200 rounded-md border-2'
            value={NeckBase}
            onChange={(e) => setNeckBase(e.target.value)}
          />
        </div>

        <div className="flex w-[80%] justify-between mb-2">
          <label className='text-primary'>Waist Size</label>
        </div>
        <div>
          <input
            type='text'
            placeholder='Enter Waist Size'
            name='Waist'
            className='h-11 w-[80%] p-2 border-gray-200 rounded-md border-2'
            value={Waist}
            onChange={(e) => setWaist(e.target.value)}
          />
        </div>

        <div className="flex w-[80%] justify-between mb-2">
          <label className='text-primary'>Hip Size</label>
        </div>
        <div>
          <input
            type='text'
            placeholder='Enter Hip Size'
            name='Hip'
            className='h-11 w-[80%] p-2 border-gray-200 rounded-md border-2'
            value={Hip}
            onChange={(e) => setHip(e.target.value)}
          />
        </div>

        <div className="flex w-[80%] justify-between mb-2">
          <label className='text-primary'>Shoulder Width Size</label>
        </div>
        <div>
          <input
            type='text'
            placeholder='Enter Shoulder Width SIze'
            name='ShoulderWidth'
            className='h-11 w-[80%] p-2 border-gray-200 rounded-md border-2'
            value={ShoulderWidth}
            onChange={(e) => setShoulderWidth(e.target.value)}
          />
        </div>

        <center className="mt-3" onClick={handleEditMeasurement}><SubmitButton /></center>


      </div>
      <center className="mt-10">
        <DeleteButton onClick={() => setShowDeleteModal(true)} />
      </center>
      {showDeleteModal && (
        <DeleteMeasurement
          id={id}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      <div className="h-20" />
      <Footer />
    </div>
  )
}

export default EditMeasurement;