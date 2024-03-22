"use client"
import React, { useEffect } from 'react';
import { DoRegister } from '@/wailsjs/wailsjs/go/app/App';
import { useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Image from "next/image";
import Women from "../../Public/undraw_secure_login_pdn4.svg";
import Mener from "../../Public/men.svg"
import SignupResult from './SignupResult';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import Candau from "../../Public/lock-dynamic-gradient.svg"
import LoadingComp from './Loading';


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
  const [loadingIsOpen, setLoadingIsOpen] = useState(false);


  async function pullRegister() {
setLoadingIsOpen(true)
    try {
      setIsLoading(true);

      await DoRegister(name, email, password);
      
        console.log('despues: ' + isSignupResultOpen)

        setIsLoading(false);
        setShowSignup(false)



    } catch (error) {
      console.error('Error fetching version:', error);
    } finally {
      setLoadingIsOpen(false)

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

        <div className=' font-bold text-5xl'>
          <span className='bg-gradient bg-clip-text text-transparent'>Go</span> <span className='text-back'>Pass</span>
        </div>
        <div className='border-2 border-border p-2 flex justify-center items-center rounded-lg '>
          <MenuRoundedIcon className='text-darkgrey' sx={{ fontSize: 40 }} />
        </div>
      </div>
      {/* Login Box */}
      <div className=' flex justify-center items-center  mt-10'>
        <div className='xl:grid xl:grid-cols-2 flex justify-center w-[90%] rounded-lg border-2 border-border bg-blackbox  max-xl:py-20 '>

          <form onSubmit={handleSubmit}>
            <div className='flex flex-col justify-center items-center h-full font-semibold text-xl '>
              <div className='text-5xl font-bold mb-12 text-back'>
                Let&apos;s <span className='bg-gradient bg-clip-text text-transparent'>Start!</span>
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 mb-4 '>
                <PersonIcon className='absolute ml-4 text-darkgrey' />
                <input autoComplete="nope" type="text" className='flex rounded-lg border-border border-[2px] pl-12  text-back xl:w-full w-[34rem] h-14 py-2 bg-black focus:outline-none placeholder:text-darkgrey' placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className='flex items-center w-full  2xl:px-40 xl:px-24 mb-4 '>
                <EmailRoundedIcon className='absolute ml-4 text-darkgrey' />
                <input autoComplete="nope" type="text" className='flex rounded-lg border-border border-[2px] pl-12  text-back xl:w-full w-[34rem] h-14 py-2 bg-black focus:outline-none placeholder:text-darkgrey ' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 '>
                <KeyIcon className='absolute ml-4 text-darkgrey ' />
                <input autoComplete="nope" type="password" className='flex rounded-lg border-border border-[2px] pl-12  text-back xl:w-full w-[34rem] h-14 py-2 bg-black focus:outline-none placeholder:text-darkgrey' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className='flex items-center w-full 2xl:px-40 xl:px-24 mt-5' >
                <div className=' flex  w-full rounded-lg p-0.5 bg-gradient group'>
                  <button className='flex items-center justify-center w-full h-14 bg-black rounded-lg hover:bg-transparent '>
                    <span className='bg-gradient bg-clip-text text-transparent hover:text-black group-hover:text-black'>
                      Sign Up
                    </span>
                  </button>

                </div>
              </div>


              <div className=' text-back  font-medium '>
                Already have an account. <span className='font-semibold cursor-pointer bg-gradient bg-clip-text text-transparent' onClick={() => setShowSignup(false)}>Login</span>
              </div>
              <h3 className='flex justify-center items-center opacity-50 text-xs select-none'>{version}</h3>
            </div>
          </form>
          <SignupResult isOpen={isSignupResultOpen} onClose={() => setIsSignupResultOpen(!isSignupResultOpen)} />
          <div className='hidden xl:flex justify-center items-center xl:opacity-100'>

            <Image src={Candau} alt='Women' className='absolute scale-80 ' />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;