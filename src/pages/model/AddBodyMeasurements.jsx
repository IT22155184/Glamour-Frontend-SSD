import { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/form/Input';
import { FormProvider, useForm } from 'react-hook-form';
import SubmitButton from '../../components/button/SubmitButton';
import { enqueueSnackbar } from "notistack";
import Navbar from "../../components/navbar/CustomerNavbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import {measurementValidation} from '../../utils/inputValidations';
import {textValidation} from '../../utils/inputValidations';
import { getAccessToken, getUserData } from '../../utils/auth';


const AddMeasurement = () => {

  const [userID, setuserID] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const methods = useForm();
  const { handleSubmit } = methods;

  useEffect(() => {
    const token = getAccessToken();
    const userData = getUserData();
    axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify`, { token: token, userType: userData?.role || 'customer' })
        .then((response) => {
            setuserID(response.data.userId)
        })
        .catch((err) => {
            console.error(err);
        });
  }, []);

const handleSaveMeasurement = async (data) => {
  setLoading(true);
  try {
    if (!userID) {
      setLoading(false);
      enqueueSnackbar("User not verified yet. Please try again in a moment.", { variant: "warning" });
      return;
    }

    // Normalize Gender to expected values (Male, Female, Other)
    const normalizedGender = (() => {
      const value = String(data?.Gender || '').trim().toLowerCase();
      if (value === 'male') return 'Male';
      if (value === 'female') return 'Female';
      if (value === 'other') return 'Other';
      return data?.Gender; // leave as is; backend will validate
    })();

    const formData = {
      ...data,
      Gender: normalizedGender,
      MeasurementID: userID 
    };

    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/measurements`, formData);
    setLoading(false);
    navigate('/cusProfile');
  } catch (error) {
    setLoading(false);
    const serverMessage = error?.response?.data?.message || error?.message || 'Error adding measurement details';
    enqueueSnackbar(serverMessage, { variant: "error" });
    console.error(error);
  }
};

  return (
    <div >
      <Navbar />
      {loading ? <Spinner /> : ''}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSaveMeasurement)} className="bg-secondary rounded-xl w-[600px] p-8 mt-20 mx-auto font-BreeSerif">
          <h1 className='text-5xl  font-Aboreto text-primary font-bold my-8 text-center alignment-center'>Add New Measurement</h1>
          <Input
            formtype='input'
            label='Unique Name'
            id='uniqueName'
            type='text'
            placeholder='Enter a unique name'
            name='UniqueName'
            {...textValidation}
          />
          
          <Input
            formtype='input'
            label='Gender'
            id='gender'
            type='text'
            placeholder='Enter your gender'
            name='Gender'
            {...textValidation}
            />

          <Input
            formtype='input'
            label='Bust Size'
            id='bust'
            type='text'
            placeholder='Enter Bust Size'
            name='Bust'
            {...measurementValidation}
            />
          <Input
            formtype='input'
            label='Under Bust Size'
            id='underBust'
            type='text'
            placeholder='Enter Under Bust Size'
            name='UnderBust'
            {...measurementValidation}
            />
          <Input
            formtype='input'
            label='Neck Base Size'
            id='neckBase'
            type='text'
            placeholder='Enter Neck Base Size'
            name='NeckBase'
            {...measurementValidation}
            />
          <Input
            formtype='input'
            label='Waist'
            id='waist'
            type='text'
            placeholder='Enter Waist Size'
            name='Waist'
            {...measurementValidation}
            />
          <Input
            formtype='input'
            label='Hip Size'
            id='Hip'
            type='text'
            placeholder='Enter Hip Size'
            name='Hip'
            {...measurementValidation}
            />
          <Input
            formtype='input'
            label='Shoulder Width Size'
            id='shoulderWidth'
            type='text'
            placeholder='Enter Shoulder Width Size'
            name='ShoulderWidth'
            {...measurementValidation}

          />
          <center className='mt-5'><SubmitButton /></center>
        </form>
      </FormProvider>
      <div className='h-40'></div>
      <div className="h-20"/>
      <Footer />
    </div>
  )
}

export default AddMeasurement;