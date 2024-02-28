"use client"
import React from 'react';
import { DoRegister } from '@/wailsjs/wailsjs/go/app/App';
import { useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Image from "next/image";
import Women from "../../Public/undraw_secure_login_pdn4.svg";
import Mener from "../../Public/men.svg"

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
interface SignupProps {
  setShowSignup: (value: boolean) => void;
  handleLoginSignup: () => void;
  version: string;
}



const Signup: React.FC<SignupProps> = ({ setShowSignup, version, handleLoginSignup }) => {



  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function pullRegister() {

    try {
      const response = await DoRegister(name, email, password);
      if (response) {
        handleLoginSignup();
        alert('Usuario registrado con éxito')
      } else {
        alert('Error al registrar usuario ' + response);
      }
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previene la recarga de la página
    await pullRegister(); // Llama a la función pullRegister
  };


  return (
    <div id='login' className='bg-back'>
      {/* Header */}
      <div className='flex justify-between items-center px-[5%] pt-[3%]'>

        <div className='text-blue font-bold text-5xl'>
          Go<span className='text-bkblue'>Pass</span>
        </div>
        <div className='border-2 border-lightgrey p-2 flex justify-center items-center rounded-xl '>
          <MenuRoundedIcon className='text-grey' sx={{ fontSize: 40 }} />
        </div>
      </div>
      {/* Login Box */}
      <div className=' flex justify-center items-center   mt-10'>
        <div className='xl:grid xl:grid-cols-2 flex justify-center w-[90%] rounded-xl py-32  bg-white'>
          
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col justify-center items-center h-full space-y-4 font-semibold text-xl'>
              <div className='xl:text-[3vw]  text-5xl font-bold mb-8'>
                Let&apos;s Start!
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 '>
                <PersonIcon className='absolute ml-4 text-grey' />
                <input type="text" className='flex rounded-2xl border-grey border-[2px] pl-11  xl:w-full w-[34rem] h-14 py-2 focus:outline-none' placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 '>
                <EmailRoundedIcon className='absolute ml-4 text-grey' />
                <input type="text" className='flex rounded-2xl border-grey border-[2px] pl-11  xl:w-full w-[34rem] h-14 py-2 focus:outline-none' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 '>
                <KeyIcon className='absolute ml-4 text-grey ' />
                <input type="password" className='flex rounded-2xl  border-grey border-[2px] pl-11 w-full h-14 py-2 focus:outline-none' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 ' >
                <button className='flex items-center justify-center w-full h-14 bg-blue rounded-2xl text-white'>
                  Sign Up
                </button>
              </div>

              <div className=' text-grey font-medium '>
                Already have an account. <span className='text-blue font-semibold cursor-pointer' onClick={() => setShowSignup(false)}>Login</span>
              </div>
              <h3 className='flex justify-center items-center opacity-50 text-xs select-none'>{version}</h3>
            </div>
          </form>
          <div className='hidden xl:flex justify-center items-center xl:opacity-100'>

            <Image src={Mener} alt='Women' className='absolute 2xl:scale-100 scale-80' />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;