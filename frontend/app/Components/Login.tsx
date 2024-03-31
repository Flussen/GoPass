"use client"
import React, { use, useEffect } from 'react';
import { useState } from 'react';
import { DoLogin } from '@/wailsjs/wailsjs/go/app/App';
import { GetVersion } from '@/wailsjs/wailsjs/go/app/App';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonIcon from '../../Public/person.svg';
import KeyIcon from '../../Public/key.svg';
import Image from "next/image";
import Women from "../../Public/undraw_secure_login_pdn4.svg"
import Shield from "../../Public/sheild-dynamic-gradient.svg"
import LoadingComp from "./Loading"
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import World from "../../Public/world.svg"
interface LoginProps {
  setShowSignup: (value: boolean) => void;
  version: string;
  token: string;
  userKey: string;
  setUserKey: (userKey: string) => void;
  setUserName: (userKey: string) => void;
  setShowDashboard: (show: boolean) => void;
  setIsLoading: (show: boolean) => void;
  setToken: (toke: string) => void;
}

interface LoginState {
  token: string;
  userKey: string;
}



const Login: React.FC<LoginProps> = ({ setShowSignup, version, setUserKey, setUserName, setShowDashboard, setIsLoading, setToken }) => {


  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [loadingIsOpen, setLoadingIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(!isEnabled);


  async function pullLogin() {

    setLoadingIsOpen(true)
    try {
      const response = await DoLogin(name, password);
      console.log(response)
      const result = JSON.parse(response) as LoginState;
      console.log(result)
      if (result.token !== null && result.token !== '' && result.userKey !== null && result.userKey !== '') {
        setUserKey(result.userKey);
        setShowDashboard(true);
        console.log('Token Saved:' + result.token)
        setUserName(name)
      }
    } catch (error) {
      console.log(error)
      setPasswordIncorrect(true)
    } finally {
      setLoadingIsOpen(false)
    }
  }


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previene la recarga de la página
    await pullLogin(); // Llama a la función pullLogin
    // Simula una carga o espera por una operación asíncrona

  };
  return (
    <div id='login' className=' h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center px-[5%] pt-[3%]'>

        <div className=' font-bold text-4xl'>
          <span className='bg-primary bg-clip-text text-transparent'>Go</span> <span className='text-white'>Pass</span>
        </div>
        <div className='bg-darkgray p-2 flex justify-center items-center rounded-lg h-12 w-12'>
          <MenuRoundedIcon className='text-primary' sx={{ fontSize: 24 }} />
        </div>
      </div>
      {/* Login Box */}
      <div className=' flex justify-center items-center h-[83%] pb-[3%]  mt-10'>
        <div className='xl:grid xl:grid-cols-2 flex justify-center w-[90%] h-full rounded-lg bg-darkgray  max-xl:py-20  '>
          <div className='hidden xl:flex bg-primary justify-center items-center rounded-lg xl:opacity-100'>


          </div>


          <div className='flex flex-col justify-center items-center h-full  font-semibold text-lg  '>
            <div
              onClick={() => { setShowSignup(true), toggleSwitch }}
              className={`w-56  flex items-center rounded-full  cursor-pointer bg-blaack border-2 border-primary mb-5 font-medium`}
            >

              <div
                className={`flex justify-center bg-primary w-28 py-0.5 rounded-full shadow-md transform duration-300 ease-in-out text-base   ${isEnabled ? 'translate-x-28' : 'translate-x-0'
                  }`}
              > {isEnabled ? 'Sign Up' : 'Login'}</div>
              <div
                className={`flex justify-center  w-28 py-0.5 rounded-full shadow-md transform duration-300 ease-in-out text-base text-white  ${!isEnabled ? 'translate-x-0' : '-translate-x-28'
                  }`}
              > {!isEnabled ? 'Sign Up' : 'Login'}</div>
            </div>
            <div className='text-5xl font-bold mb-12 text-white '>
              <span className='bg-primary bg-clip-text text-transparent'>Welcome</span>  Back!
            </div>

            <div className='flex-col items-center w-full 2xl:px-40 xl:px-24 mb-4 '>

              <div className='flex items-center w-full   '>
                <PersonRoundedIcon className='absolute ml-4 text-primary' sx={{ fontSize: 24 }} />
                <input autoComplete="nope" type="text" className='flex rounded-lg  pl-12   xl:w-full w-[34rem] h-14 py-2 bg-blaack focus:outline-none placeholder:text-whitegray' placeholder='Username' value={name} onChange={(e) => setName(e.target.value)} />
              </div>

            </div>

            <div className='flex-col items-center w-full 2xl:px-40 xl:px-24 mb-4  '>

              <div className='flex items-center w-full '>
                <KeyRoundedIcon className='absolute ml-4 text-primary' sx={{ fontSize: 24 }} />
                <input autoComplete="nope" type="password" className='flex rounded-lg   b pl-12 w-full h-14 py-2 focus:outline-none bg-blaack placeholder:text-whitegray' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>


            </div>
            <div className={`flex items-center w-full 2xl:px-40 xl:px-24 ${passwordIncorrect ? 'mb-2' : 'mb-4'} `} >
              <div className=' flex  w-full rounded-lg p-0.5 '>
                <button onClick={handleSubmit} className='flex items-center justify-center w-full h-14 bg-primary text-blaack rounded-lg group hover:bg-darkprimary'>
                  Login
                </button>
                

              </div>

            </div>
            {
              passwordIncorrect ? <span className='text-red text-sm mb-1  '>Incorrect Credentials</span>
                :
                <></>
            }


            <h3 className='flex justify-center items-center  text-xs select-none text-whitegray'>{version}</h3>

          </div>


          {loadingIsOpen ?
            <LoadingComp /> :
            <></>}
        </div>

      </div>
    </div>
  );
};

export default Login;