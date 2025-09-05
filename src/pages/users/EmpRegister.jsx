import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from "react-router-dom";
import Input from '../../components/form/Input';
import StaffFooter from "../../components/footer/stafffooter/StaffFooter";
import Spinner from '../../components/Spinner';
import {pnoValidation} from '../../utils/inputValidations';
import {EmailValidation} from '../../utils/inputValidations';
import {PasswordValidation} from '../../utils/inputValidations';

const EmpSignup = () => {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const methods = useForm();
    const { handleSubmit } = methods;

    const handleSignup = async (data) => {
        setLoading(true);
        try {
            console.log(data)
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, data);
            setLoading(false);
            navigate('/EmpLogin');
        } catch (error) {
            setLoading(false);
            alert('An error happened. Please check the console');
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <div className='flex flex-row items-center justify-between bg-white mt-3 pb-3 px-4'>
                    <div className='flex justify-center w-full'>
                        <img
                            src="/Logo1.png"
                            alt="logo"
                            className="w-[2rem] h-[3rem] ml-[1rem] mr-[1rem]"
                        />
                        <img src="/Logo2.png" alt="logo" className="w-[18rem] h-[2rem] hidden mt-2 lg:block" />
                    </div>
                    <Link to="/EmpLogin">
                        <button
                            type="submit"
                            className='ml-auto p-2 bg-primary font-BreeSerif text-white rounded'>
                            Login
                        </button>
                    </Link>
                </div>
            </div>

            <div className='w-full min-h-screen flex-col bg-no-repeat' style={{ backgroundPosition: 'top right', backgroundSize: 'cover' }}>
                <div className="flex flex-row w-full h-full">
                    <div className="w-1/2 h-full">
                        <img
                            src="./Register/bgimage.jpg"
                            alt="Signup Illustration"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="w-1/2 flex justify-center items-center p-8 bg-ternary">
                        {loading && <Spinner />}
                        <FormProvider {...methods}>
                            <div className="bg-secondary shadow-2xl rounded-xl p-8 w-full max-w-lg mx-auto">
                                <h1 className='text-4xl font-Aboreto text-primary font-semibold my-8 text-center'>Create Your Account</h1>
                                <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
                                    <Input
                                        formtype='input'
                                        label='First Name'
                                        id='firstName'
                                        type='text'
                                        placeholder='Enter your first name'
                                        name='firstName'
                                    />
                                    <Input
                                        formtype='input'
                                        label='Last Name'
                                        id='lastName'
                                        type='text'
                                        placeholder='Enter your last name'
                                        name='lastName'
                                    />
                                    <Input
                                        formtype='input'
                                        label='Email'
                                        id='email'
                                        type='email'
                                        placeholder='Enter email'
                                        name='email'
                                        {...EmailValidation}
                                    />
                                    <Input
                                        formtype='input'
                                        label='Phone Number'
                                        id='phoneNumber'
                                        type='text'
                                        placeholder='Enter contact number'
                                        name='phoneNumber'
                                        {...pnoValidation}
                                    />
                                    <Input
                                        formtype='input'
                                        label='Password'
                                        id='password'
                                        type='password'
                                        placeholder='Enter password'
                                        name='password'
                                        {...PasswordValidation}
                                    />
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className='mt-4 p-2 bg-primary font-BreeSerif text-white rounded w-1/3'>
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </FormProvider>
                    </div>
                </div>
                <StaffFooter />
            </div>
        </div>
    );

};

export default EmpSignup;