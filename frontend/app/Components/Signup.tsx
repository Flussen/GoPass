"use client"
import React, { useEffect } from 'react';
import { DoRegister } from '@/wailsjs/wailsjs/go/app/App';
import { useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import Image from "next/image";
import Women from "../../Public/undraw_secure_login_pdn4.svg";
import Mener from "../../Public/men.svg"
import SignupResult from './SignupResult';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Candau from "../../Public/lock-dynamic-gradient.svg"
import LoadingComp from './Loading';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

interface SignupProps {
  setShowSignup: (value: boolean) => void;
  version: string;
  setIsLoading: (loading: boolean) => void;
}



const Signup: React.FC<SignupProps> = ({ setShowSignup, version, setIsLoading }) => {


  const [isSignupResultOpen, setIsSignupResultOpen] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [passwordIncorrect, setPasswordIncorrect]= useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);

  async function pullRegister() {
    setIsLoading(true);

    if(name==''|| email=='' || password == ''){
      setIsLoading(false);
      setPasswordIncorrect(true)
    }else{
      try {
  
        await DoRegister(name, email, password);
  
        console.log('despues: ' + isSignupResultOpen)
  
        setShowSignup(false)
  
  
  
      } catch (error) {
        console.error('Error fetching version:', error);
      } finally {
        setIsLoading(false);

      }
    }
    
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previene la recarga de la página
    await pullRegister(); // Llama a la función pullRegister

  };

  useEffect(() => {
    console.log('El estado de isSignupResultOpen ha cambiado a: ' + isSignupResultOpen);
    // Aquí puedes colocar cualquier código que deba ejecutarse después de que isSignupResultOpen se actualice
  }, [isSignupResultOpen]);
  return (
    <div id='login' className=' h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center px-[5%] pt-[3%]'>

        <div className=' font-bold text-4xl'>
          <span className='bg-green bg-clip-text text-transparent'>Go</span> <span className='text-white'>Pass</span>
        </div>
        <div className='bg-darkgray p-2 flex justify-center items-center rounded-lg h-12 w-12'>
          <MenuRoundedIcon className='text-green' sx={{ fontSize: 24 }} />
        </div>
      </div>
      {/* Login Box */}
      <div className=' flex justify-center items-center h-[83%] pb-[3%]  mt-10'>
        <div className='xl:grid xl:grid-cols-2 flex justify-center w-[90%] h-full rounded-lg bg-darkgray  max-xl:py-20 '>


          <div className='flex flex-col justify-center items-center h-full  font-semibold text-lg z-[50] '>
            <div
              onClick={() => { setShowSignup(false), toggleSwitch }}
              className={`w-56  flex items-center rounded-full  cursor-pointer bg-blaack border-2 border-green mb-5 font-medium`}
            >

              <div
                className={`flex justify-center bg-green w-28 py-0.5 rounded-full shadow-md transform duration-300 ease-in-out text-base   ${isEnabled ? 'translate-x-28' : 'translate-x-0'
                  }`}
              > {isEnabled ? 'Sign Up' : 'Login'}</div>
              <div
                className={`flex justify-center  w-28 py-0.5 rounded-full shadow-md transform duration-300 ease-in-out text-base text-white  ${!isEnabled ? 'translate-x-0' : '-translate-x-28'
                  }`}
              > {!isEnabled ? 'Sign Up' : 'Login'}</div>
            </div>
            <div className='text-5xl font-bold mb-12 text-white'>
              Let&apos;s <span className='text-green'>Start!</span>
            </div>
            <div className='flex-col items-center w-full 2xl:px-40 xl:px-24 mb-4 '>
              <div className='flex items-center w-full   '>
                <PersonRoundedIcon className='absolute ml-4 text-green' sx={{ fontSize: 24 }} />
                <input autoComplete="nope" type="text" className='flex rounded-lg  pl-12  text-white xl:w-full w-[34rem] h-14 py-2 bg-blaack focus:outline-none placeholder:text-whitegray' placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>

            <div className='flex-col items-center w-full 2xl:px-40 xl:px-24 mb-4 '>
              <div className='flex items-center w-full   '>
                <EmailRoundedIcon className='absolute ml-4 text-green' sx={{ fontSize: 24 }} />
                <input autoComplete="nope" type="email" className='flex rounded-lg  pl-12  text-white xl:w-full w-[34rem] h-14 py-2 bg-blaack focus:outline-none placeholder:text-whitegray' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className='flex-col items-center w-full 2xl:px-40 xl:px-24 mb-4 '>
              <div className='flex items-center w-full   '>
                <KeyRoundedIcon className='absolute ml-4 text-green' sx={{ fontSize: 24 }} />
                <input autoComplete="nope" type="password" className='flex rounded-lg  pl-12  text-white xl:w-full w-[34rem] h-14 py-2 bg-blaack focus:outline-none placeholder:text-whitegray' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div className='flex items-center w-full 2xl:px-40 xl:px-24 ' >
            <div className=' flex  w-full rounded-lg p-0.5 mb-4'>
                <button onClick={handleSubmit} className='flex items-center justify-center w-full h-14 bg-green text-blaack rounded-lg group hover:bg-darkgreen'>
                  Login
                </button>


              </div>
            </div>


            {
              passwordIncorrect ? <span className='text-red text-sm mb-1  '>Complete all</span>
                :
                <></>
            }
            <h3 className='flex justify-center items-center text-whitegray text-xs select-none'>{version}</h3>
          </div>

          <SignupResult isOpen={isSignupResultOpen} onClose={() => setIsSignupResultOpen(!isSignupResultOpen)} />
          <div className='hidden xl:flex justify-center rounded-lg bg-green items-center xl:opacity-100'>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;